/**
 * 极简 QR Code 编码器（字节模式，版本 1-10，纠错等级 L/M/Q/H）
 * ---------------------------------------------------------------------------
 * 为了保持组件库零外部依赖，这里按 ISO/IEC 18004 标准自行实现：
 * GF(256) 运算 → Reed-Solomon 纠错 → 比特流组帧 → 模块布局 → 掩码择优。
 * 布局遵循标准：定位图形、校正图形、时序图形、格式信息与版本信息。
 */

/* ------------------------------------------------------------------ *
 * GF(256) 伽罗华域运算
 * ------------------------------------------------------------------ */
const EXP_TABLE = new Array(256);
const LOG_TABLE = new Array(256);

for (let i = 0; i < 8; i += 1) EXP_TABLE[i] = 1 << i;
for (let i = 8; i < 256; i += 1) {
  EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
}
for (let i = 0; i < 255; i += 1) LOG_TABLE[EXP_TABLE[i]] = i;

const gexp = (n) => {
  let v = n;
  while (v < 0) v += 255;
  while (v >= 256) v -= 255;
  return EXP_TABLE[v];
};
const glog = (n) => LOG_TABLE[n];

/* ------------------------------------------------------------------ *
 * 多项式（Reed-Solomon 纠错码生成）
 * ------------------------------------------------------------------ */
class Poly {
  constructor(num, shift) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset += 1;
    this.num = new Array(num.length - offset + shift).fill(0);
    for (let i = 0; i < num.length - offset; i += 1) this.num[i] = num[i + offset];
  }

  get(index) {
    return this.num[index];
  }

  getLength() {
    return this.num.length;
  }

  multiply(e) {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new Poly(num, 0);
  }

  mod(e) {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = this.num.slice();
    for (let i = 0; i < e.getLength(); i += 1) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new Poly(num, 0).mod(e);
  }
}

function errorCorrectPolynomial(count) {
  let a = new Poly([1], 0);
  for (let i = 0; i < count; i += 1) a = a.multiply(new Poly([1, gexp(i)], 0));
  return a;
}

/* ------------------------------------------------------------------ *
 * RS 分块表：版本 1-10，[纠错码数, 块数, 数据码数] 分组
 * 每行顺序为 L / M / Q / H，分多组的版本用 || 连接
 * ------------------------------------------------------------------ */
const RS_BLOCKS = {
  1: [
    [[7, 1, 19]], [[10, 1, 16]], [[13, 1, 13]], [[17, 1, 9]]
  ],
  2: [
    [[10, 1, 34]], [[16, 1, 28]], [[22, 1, 22]], [[28, 1, 16]]
  ],
  3: [
    [[15, 1, 55]], [[26, 1, 44]], [[18, 2, 17]], [[22, 2, 13]]
  ],
  4: [
    [[20, 1, 80]], [[18, 2, 32]], [[26, 2, 24]], [[16, 4, 9]]
  ],
  5: [
    [[26, 1, 108]], [[24, 2, 43]], [[18, 2, 15], [18, 2, 16]], [[22, 2, 11], [22, 2, 12]]
  ],
  6: [
    [[18, 2, 68]], [[16, 4, 27]], [[24, 4, 19]], [[28, 4, 15]]
  ],
  7: [
    [[20, 2, 78]], [[18, 4, 31]], [[18, 2, 14], [18, 4, 15]], [[26, 4, 13], [26, 1, 14]]
  ],
  8: [
    [[24, 2, 97]], [[22, 2, 38], [22, 2, 39]], [[22, 4, 18], [22, 2, 19]], [[26, 4, 14], [26, 2, 15]]
  ],
  9: [
    [[30, 2, 116]], [[22, 3, 36], [22, 2, 37]], [[20, 4, 16], [20, 4, 17]], [[24, 4, 12], [24, 4, 13]]
  ],
  10: [
    [[18, 2, 68], [18, 2, 69]], [[26, 4, 43], [26, 1, 44]], [[24, 6, 19], [24, 2, 20]], [[28, 6, 15], [28, 2, 16]]
  ]
};

// 各版本矩阵总码字数，用于自检 RS 表是否与标准一致
const TOTAL_CODEWORDS = {
  1: 26, 2: 44, 3: 70, 4: 100, 5: 134, 6: 172, 7: 196, 8: 242, 9: 292, 10: 346
};

// 校正图形中心坐标
const ALIGN_POS = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
};

const EC_LEVEL = { L: 0, M: 1, Q: 2, H: 3 };
const EC_BITS = { L: 1, M: 0, Q: 3, H: 2 };
const EC_MAX_VERSION = 10;

/* ------------------------------------------------------------------ *
 * 比特缓冲
 * ------------------------------------------------------------------ */
class BitBuffer {
  constructor() {
    this.buffer = [];
    this.length = 0;
  }

  put(num, length) {
    for (let i = 0; i < length; i += 1) this.putBit(((num >>> (length - i - 1)) & 1) === 1);
  }

  putBit(bit) {
    const byteIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= byteIndex) this.buffer.push(0);
    if (bit) this.buffer[byteIndex] |= 0x80 >>> this.length % 8;
    this.length += 1;
  }
}

/* ------------------------------------------------------------------ *
 * 工具
 * ------------------------------------------------------------------ */
function utf8Bytes(str) {
  if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(str));
  const out = [];
  for (let i = 0; i < str.length; i += 1) {
    let c = str.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    else if (c < 0xd800 || c >= 0xe000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    else {
      i += 1;
      c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return out;
}

const getBCHDigit = (data) => {
  let digit = 0;
  let d = data;
  while (d !== 0) {
    digit += 1;
    d >>>= 1;
  }
  return digit;
};

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

function bchTypeInfo(data) {
  let d = data << 10;
  while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
    d ^= G15 << (getBCHDigit(d) - getBCHDigit(G15));
  }
  return ((data << 10) | d) ^ G15_MASK;
}

function bchVersion(data) {
  let d = data << 12;
  while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
    d ^= G18 << (getBCHDigit(d) - getBCHDigit(G18));
  }
  return (data << 12) | d;
}

/* ------------------------------------------------------------------ *
 * 码字组装
 * ------------------------------------------------------------------ */
function buildRSBlocks(version, level) {
  const table = RS_BLOCKS[version][EC_LEVEL[level]];
  const blocks = [];
  table.forEach(([ecCount, count, dataCount]) => {
    for (let i = 0; i < count; i += 1) {
      blocks.push({ totalCount: ecCount + dataCount, dataCount, ecCount });
    }
  });
  return blocks;
}

function createBytes(buffer, rsBlocks) {
  let offset = 0;
  let maxDcCount = 0;
  let maxEcCount = 0;
  const dcData = [];
  const ecData = [];

  rsBlocks.forEach((block) => {
    const dcCount = block.dataCount;
    const ecCount = block.ecCount;
    maxDcCount = Math.max(maxDcCount, dcCount);
    maxEcCount = Math.max(maxEcCount, ecCount);

    const dc = new Array(dcCount).fill(0);
    for (let i = 0; i < dc.length; i += 1) dc[i] = 0xff & buffer.buffer[i + offset];
    offset += dcCount;
    dcData.push(dc);

    const rsPoly = errorCorrectPolynomial(ecCount);
    const rawPoly = new Poly(dc, rsPoly.getLength() - 1);
    const modPoly = rawPoly.mod(rsPoly);

    const ec = new Array(rsPoly.getLength() - 1).fill(0);
    for (let i = 0; i < ec.length; i += 1) {
      const modIndex = i + modPoly.getLength() - ec.length;
      ec[i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
    }
    ecData.push(ec);
  });

  const totalCodeCount = rsBlocks.reduce((s, b) => s + b.totalCount, 0);
  const data = new Array(totalCodeCount).fill(0);
  let index = 0;

  for (let i = 0; i < maxDcCount; i += 1) {
    for (let r = 0; r < rsBlocks.length; r += 1) {
      if (i < dcData[r].length) data[index++] = dcData[r][i];
    }
  }
  for (let i = 0; i < maxEcCount; i += 1) {
    for (let r = 0; r < rsBlocks.length; r += 1) {
      if (i < ecData[r].length) data[index++] = ecData[r][i];
    }
  }
  return data;
}

function buildDataBuffer(version, level, bytes) {
  const buffer = new BitBuffer();
  buffer.put(4, 4); // 字节模式
  buffer.put(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((b) => buffer.put(b, 8));

  const rsBlocks = buildRSBlocks(version, level);
  const totalDataCount = rsBlocks.reduce((s, b) => s + b.dataCount, 0);
  if (buffer.length > totalDataCount * 8) {
    throw new Error('内容超出当前版本容量');
  }

  if (buffer.length + 4 <= totalDataCount * 8) buffer.put(0, 4);
  while (buffer.length % 8 !== 0) buffer.putBit(false);
  while (true) {
    if (buffer.length >= totalDataCount * 8) break;
    buffer.put(0xec, 8);
    if (buffer.length >= totalDataCount * 8) break;
    buffer.put(0x11, 8);
  }
  return createBytes(buffer, rsBlocks);
}

/* ------------------------------------------------------------------ *
 * 模块矩阵
 * ------------------------------------------------------------------ */
function createMatrix(version) {
  const size = version * 4 + 17;
  const modules = [];
  for (let r = 0; r < size; r += 1) {
    modules.push(new Array(size).fill(null));
  }
  return modules;
}

function setupPositionProbe(modules, row, col) {
  const size = modules.length;
  for (let r = -1; r <= 7; r += 1) {
    if (row + r < 0 || row + r >= size) continue;
    for (let c = -1; c <= 7; c += 1) {
      if (col + c < 0 || col + c >= size) continue;
      const on =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      modules[row + r][col + c] = on;
    }
  }
}

function setupPositionAdjust(modules, version) {
  const pos = ALIGN_POS[version];
  const size = modules.length;
  for (let i = 0; i < pos.length; i += 1) {
    for (let j = 0; j < pos.length; j += 1) {
      const row = pos[i];
      const col = pos[j];
      if (modules[row][col] !== null) continue;
      for (let r = -2; r <= 2; r += 1) {
        for (let c = -2; c <= 2; c += 1) {
          modules[row + r][col + c] =
            r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
        }
      }
    }
  }
  // 上面已用 null 判断跳过定位图形区域，这里避免空指针
  return size;
}

function setupTimingPattern(modules) {
  const size = modules.length;
  for (let i = 8; i < size - 8; i += 1) {
    if (modules[i][6] === null) modules[i][6] = i % 2 === 0;
    if (modules[6][i] === null) modules[6][i] = i % 2 === 0;
  }
}

function setupTypeInfo(modules, level, maskPattern) {
  const size = modules.length;
  const data = (EC_BITS[level] << 3) | maskPattern;
  const bits = bchTypeInfo(data);

  for (let i = 0; i < 15; i += 1) {
    const mod = ((bits >> i) & 1) === 1;
    if (i < 6) modules[i][8] = mod;
    else if (i < 8) modules[i + 1][8] = mod;
    else modules[size - 15 + i][8] = mod;
  }
  for (let i = 0; i < 15; i += 1) {
    const mod = ((bits >> i) & 1) === 1;
    if (i < 8) modules[8][size - i - 1] = mod;
    else if (i < 9) modules[8][15 - i - 1 + 1] = mod;
    else modules[8][15 - i - 1] = mod;
  }
  modules[size - 8][8] = true; // 固定暗模块
}

function setupTypeNumber(modules, version) {
  if (version < 7) return;
  const size = modules.length;
  const bits = bchVersion(version);
  for (let i = 0; i < 18; i += 1) {
    const mod = ((bits >> i) & 1) === 1;
    modules[Math.floor(i / 3)][(i % 3) + size - 8 - 3] = mod;
    modules[(i % 3) + size - 8 - 3][Math.floor(i / 3)] = mod;
  }
}

function mapData(modules, data, maskPattern) {
  const size = modules.length;
  let inc = -1;
  let row = size - 1;
  let bitIndex = 7;
  let byteIndex = 0;

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    while (true) {
      for (let c = 0; c < 2; c += 1) {
        if (modules[row][col - c] === null) {
          let dark = false;
          if (byteIndex < data.length) dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
          if (mask(maskPattern, row, col - c)) dark = !dark;
          modules[row][col - c] = dark;
          bitIndex -= 1;
          if (bitIndex === -1) {
            byteIndex += 1;
            bitIndex = 7;
          }
        }
      }
      row += inc;
      if (row < 0 || size <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
  }
}

function mask(pattern, i, j) {
  switch (pattern) {
    case 0: return (i + j) % 2 === 0;
    case 1: return i % 2 === 0;
    case 2: return j % 3 === 0;
    case 3: return (i + j) % 3 === 0;
    case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
    case 5: return ((i * j) % 2) + ((i * j) % 3) === 0;
    case 6: return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
    case 7: return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
    default: return false;
  }
}

/* ------------------------------------------------------------------ *
 * 掩码择优（严格按 ISO/IEC 18004 的四条惩罚规则评分）
 * ------------------------------------------------------------------ */
function lostPoint(modules) {
  const size = modules.length;
  let lost = 0;

  // 规则 1：同色连续 5 个及以上，惩罚 3 + (长度 - 5)
  const scoreLine = (getter) => {
    let score = 0;
    for (let i = 0; i < size; i += 1) {
      let runColor = getter(i, 0);
      let runLength = 1;
      for (let j = 1; j < size; j += 1) {
        const color = getter(i, j);
        if (color === runColor) {
          runLength += 1;
        } else {
          if (runLength >= 5) score += 3 + (runLength - 5);
          runColor = color;
          runLength = 1;
        }
      }
      if (runLength >= 5) score += 3 + (runLength - 5);
    }
    return score;
  };

  lost += scoreLine((row, col) => modules[row][col]);
  lost += scoreLine((col, row) => modules[row][col]);

  // 规则 2：2x2 同色块，每处惩罚 3
  for (let row = 0; row < size - 1; row += 1) {
    for (let col = 0; col < size - 1; col += 1) {
      const c = modules[row][col];
      if (c === modules[row][col + 1] && c === modules[row + 1][col] && c === modules[row + 1][col + 1]) {
        lost += 3;
      }
    }
  }

  // 规则 3：出现 1011101 且一侧有 4 个空白的定位图形相似序列，惩罚 40
  const PATTERN_A = [true, false, true, true, true, false, true, false, false, false, false];
  const PATTERN_B = [false, false, false, false, true, false, true, true, true, false, true];

  const matchAt = (getter, i, j, pattern) => {
    for (let k = 0; k < pattern.length; k += 1) {
      if (getter(i, j + k) !== pattern[k]) return false;
    }
    return true;
  };

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j <= size - 11; j += 1) {
      if (matchAt((r, c) => modules[r][c], i, j, PATTERN_A)) lost += 40;
      if (matchAt((r, c) => modules[r][c], i, j, PATTERN_B)) lost += 40;
      if (matchAt((r, c) => modules[c][r], i, j, PATTERN_A)) lost += 40;
      if (matchAt((r, c) => modules[c][r], i, j, PATTERN_B)) lost += 40;
    }
  }

  // 规则 4：暗模块比例偏离 50%，每 5% 惩罚 10
  let darkCount = 0;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (modules[row][col]) darkCount += 1;
    }
  }
  const total = size * size;
  const deviation = Math.abs((darkCount * 100) / total - 50);
  lost += Math.floor(deviation / 5) * 10;

  return lost;
}

/* ------------------------------------------------------------------ *
 * 对外入口
 * ------------------------------------------------------------------ */
function buildMatrix(version, level, data, maskPattern) {
  const modules = createMatrix(version);

  // 定位图形（左上 / 右上 / 左下）
  setupPositionProbe(modules, 0, 0);
  setupPositionProbe(modules, modules.length - 7, 0);
  setupPositionProbe(modules, 0, modules.length - 7);
  setupPositionAdjust(modules, version);
  setupTimingPattern(modules);
  setupTypeInfo(modules, level, maskPattern);
  setupTypeNumber(modules, version);
  mapData(modules, data, maskPattern);

  return modules;
}

/**
 * 生成二维码矩阵
 * @param {string} text 内容
 * @param {{ level?: 'L'|'M'|'Q'|'H', version?: number }} options
 * @returns {{ size: number, modules: boolean[][], version: number, level: string }}
 */
export function encodeQR(text, options = {}) {
  const level = (options.level || 'M').toUpperCase();
  if (!(level in EC_LEVEL)) throw new Error(`不支持的纠错等级：${level}`);

  const bytes = utf8Bytes(String(text ?? ''));
  let version = Number(options.version) || 0;

  if (!version) {
    version = 1;
    while (version <= EC_MAX_VERSION) {
      const blocks = buildRSBlocks(version, level);
      const capacity = blocks.reduce((s, b) => s + b.dataCount, 0) * 8;
      const needed = 4 + (version < 10 ? 8 : 16) + bytes.length * 8;
      if (needed <= capacity) break;
      version += 1;
    }
  }
  if (version > EC_MAX_VERSION) {
    throw new Error(`内容过长，最多支持 ${EC_MAX_VERSION} 版本`);
  }

  const data = buildDataBuffer(version, level, bytes);

  // 自检：码字总数必须与该版本标准容量一致
  if (TOTAL_CODEWORDS[version] !== undefined && data.length !== TOTAL_CODEWORDS[version]) {
    throw new Error(`码字数量异常：${data.length} != ${TOTAL_CODEWORDS[version]}`);
  }

  let best = null;
  let bestScore = Infinity;
  let bestPattern = 0;
  for (let p = 0; p < 8; p += 1) {
    const modules = buildMatrix(version, level, data, p);
    const score = lostPoint(modules);
    if (score < bestScore) {
      bestScore = score;
      best = modules;
      bestPattern = p;
    }
  }

  return { size: version * 4 + 17, modules: best, version, level, maskPattern: bestPattern };
}

/** 把矩阵转成 SVG path，减少 DOM 节点数量 */
export function matrixToPath(modules, margin = 0) {
  const size = modules.length;
  const parts = [];
  for (let r = 0; r < size; r += 1) {
    let start = -1;
    for (let c = 0; c <= size; c += 1) {
      const dark = c < size && modules[r][c];
      if (dark && start === -1) start = c;
      if (!dark && start !== -1) {
        parts.push(`M${start + margin} ${r + margin}h${c - start}v1h${start - c}z`);
        start = -1;
      }
    }
  }
  return parts.join('');
}
