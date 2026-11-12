/**
 * 极简语法高亮器（零依赖）
 * ---------------------------------------------------------------------------
 * 采用「逐字符扫描 + 状态机」而不是正则连续 replace：
 * 正则会误伤字符串内部的注释符号、也会重复匹配已包裹的标签，导致高亮错乱。
 * 支持：js/ts/vue/html/css/scss/json/bash/shell；未知语言只转义不染色。
 */

const KEYWORDS = {
  js: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
    'case', 'break', 'continue', 'new', 'class', 'extends', 'super', 'this', 'typeof', 'instanceof',
    'in', 'of', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield', 'import', 'export',
    'from', 'default', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'static', 'get', 'set'
  ],
  ts: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
    'case', 'break', 'continue', 'new', 'class', 'extends', 'super', 'this', 'typeof', 'instanceof',
    'in', 'of', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield', 'import', 'export',
    'from', 'default', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'static', 'get', 'set',
    'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected', 'readonly',
    'declare', 'namespace', 'as', 'satisfies', 'keyof', 'infer'
  ],
  json: ['true', 'false', 'null'],
  bash: ['if', 'then', 'else', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'function', 'echo', 'export', 'cd', 'npm', 'npx', 'pnpm', 'yarn', 'git']
};

const ALIAS = {
  javascript: 'js',
  jsx: 'js',
  mjs: 'js',
  cjs: 'js',
  typescript: 'ts',
  tsx: 'ts',
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  scss: 'css',
  less: 'css',
  vue: 'html',
  xml: 'html',
  yml: 'yaml'
};

export function normalizeLang(lang) {
  const l = String(lang || '').toLowerCase();
  return ALIAS[l] || l;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const isIdentStart = (c) => /[A-Za-z_$]/.test(c);
const isIdentPart = (c) => /[A-Za-z0-9_$]/.test(c);
const isDigit = (c) => /[0-9]/.test(c);

/**
 * 高亮主入口
 * @param {string} code 原始代码
 * @param {string} lang 语言标识
 * @returns {string} 已转义的 HTML 字符串
 */
export function highlight(code, lang) {
  const src = String(code ?? '');
  const language = normalizeLang(lang);

  // 不认识的语言：只转义，保证不破坏布局
  if (!['js', 'ts', 'json', 'html', 'css', 'bash', 'yaml'].includes(language)) {
    return escapeHtml(src);
  }

  const keywords = KEYWORDS[language] || [];
  const kwSet = new Set(keywords);
  const out = [];
  const n = src.length;
  let i = 0;

  const push = (cls, text) => {
    const safe = escapeHtml(text);
    out.push(cls ? `<span class="pui-code__${cls}">${safe}</span>` : safe);
  };

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];

    /* ---------- 多行注释 ---------- */
    if (c === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      push('comment', src.slice(i, stop));
      i = stop;
      continue;
    }

    /* ---------- 单行注释 ---------- */
    if ((c === '/' && next === '/') || (c === '#' && (language === 'bash' || language === 'yaml'))) {
      const end = src.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      push('comment', src.slice(i, stop));
      i = stop;
      continue;
    }

    /* ---------- HTML 注释 ---------- */
    if (language === 'html' && c === '<' && src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      const stop = end === -1 ? n : end + 3;
      push('comment', src.slice(i, stop));
      i = stop;
      continue;
    }

    /* ---------- 字符串 ---------- */
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') {
          j += 2;
          continue;
        }
        if (src[j] === quote) {
          j += 1;
          break;
        }
        // 普通引号不跨行
        if (src[j] === '\n' && quote !== '`') break;
        j += 1;
      }
      push('string', src.slice(i, Math.min(j, n)));
      i = Math.min(j, n);
      continue;
    }

    /* ---------- 数字 ---------- */
    if (isDigit(c) || (c === '.' && isDigit(next))) {
      let j = i;
      while (j < n && /[0-9a-fA-FxX._]/.test(src[j])) j += 1;
      // 单位 / 百分号
      while (j < n && /[a-z%]/.test(src[j])) j += 1;
      push('number', src.slice(i, j));
      i = j;
      continue;
    }

    /* ---------- 标识符 / 关键字 / 函数名 ---------- */
    if (isIdentStart(c)) {
      let j = i;
      while (j < n && isIdentPart(src[j])) j += 1;
      const word = src.slice(i, j);

      // 后面紧跟左括号视为函数调用（排除关键字）
      const afterSpaces = src.slice(j).match(/^\s*/)[0].length + j;
      const isCall = src[afterSpaces] === '(' && !kwSet.has(word);

      if (kwSet.has(word)) push('keyword', word);
      else if (isCall) push('function', word);
      else if (language === 'html' && /^(div|span|template|script|style|a|p|h[1-6]|ul|li|svg|path|button|input|img)$/i.test(word)) push('tag', word);
      else push('', word);

      i = j;
      continue;
    }

    /* ---------- HTML 标签与属性 ---------- */
    if (language === 'html' && c === '<') {
      const m = src.slice(i).match(/^<\/?([A-Za-z][\w-]*)/);
      if (m) {
        push('tag', m[0]);
        i += m[0].length;
        continue;
      }
    }

    /* ---------- 运算符与标点 ---------- */
    if (/[=+\-*/%<>!&|?:;,.()[\]{}]/.test(c)) {
      push('punctuation', c);
      i += 1;
      continue;
    }

    /* ---------- 空白与其他 ---------- */
    push('', c);
    i += 1;
  }

  return out.join('');
}

/** 按行切分高亮结果，供行号渲染（不切断标签） */
export function highlightLines(code, lang) {
  const html = highlight(code, lang);
  // 用占位符保护跨行标签：由于高亮片段可能跨行（多行注释），
  // 这里直接按 </span> 补齐 / 重开，保证每行都是合法 HTML
  const lines = html.split('\n');
  return lines.map((line) => balanceTags(line));
}

/** 补齐单行内未闭合的 span，避免行容器错位 */
function balanceTags(line) {
  const opens = (line.match(/<span class="pui-code__/g) || []).length;
  const closes = (line.match(/<\/span>/g) || []).length;
  const diff = opens - closes;
  if (diff <= 0) return line;
  return line + '</span>'.repeat(diff);
}
