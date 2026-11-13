<template>
  <div :class="['pui-signature', customClass, { 'is-disabled': disabled, 'is-fluid': isFluidWidth }]" :style="{ width: rootWidthStyle }">
    <div class="pui-signature__hd" v-if="title || showTools">
      <span v-if="title" class="pui-signature__title">{{ title }}</span>
      <div v-if="showTools" class="pui-signature__tools">
        <button
          type="button"
          class="pui-signature__tool"
          :disabled="disabled || !hasInk"
          :title="undoText"
          @click="undo"
        >
          <i class="iconfont t-icon-back" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="pui-signature__tool"
          :disabled="disabled || !hasInk"
          :title="clearText"
          @click="clear"
        >
          <i class="iconfont t-icon-delete" aria-hidden="true"></i>
        </button>
        <slot name="tools"></slot>
      </div>
    </div>

    <div class="pui-signature__canvas-wrap" :style="{ height: toPx(height) }">
      <canvas
        ref="canvasRef"
        class="pui-signature__canvas"
        :style="{ background: bgColor, touchAction: 'none' }"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
        @pointerleave="onUp"
      ></canvas>

      <div v-if="!hasInk && placeholder" class="pui-signature__placeholder" aria-hidden="true">
        {{ placeholder }}
      </div>

      <!-- 基线画在画布内部，不再占用文档流高度，避免挤压下方提示文字 -->
      <div v-if="showBaseline" class="pui-signature__baseline" aria-hidden="true"></div>
    </div>

    <div v-if="$slots.footer || showTools" class="pui-signature__footer">
      <slot name="footer">
        <span class="pui-signature__tip">{{ tip }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tSignature'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** 画布宽度 */
  width: { type: [Number, String], default: 480 },
  /** 画布高度 */
  height: { type: [Number, String], default: 200 },
  /** 画笔颜色 */
  penColor: { type: String, default: '#1c2534' },
  /** 画笔粗细 */
  lineWidth: { type: Number, default: 2.4 },
  /** 画布背景色 */
  bgColor: { type: String, default: 'transparent' },
  /** 标题 */
  title: { type: String, default: '' },
  /** 未签名时的占位提示 */
  placeholder: { type: String, default: '请在此处手写签名' },
  /** 底部提示文案 */
  tip: { type: String, default: '' },
  /** 显示工具栏（撤销 / 清空） */
  showTools: { type: Boolean, default: true },
  /** 显示签名基线 */
  showBaseline: { type: Boolean, default: true },
  /** 导出图片的背景色（默认透明） */
  exportBgColor: { type: String, default: '' },
  undoText: { type: String, default: '撤销' },
  clearText: { type: String, default: '清空' },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['start', 'end', 'change', 'clear', 'undo']);

const canvasRef = ref(null);
const hasInk = ref(false);

/** 每次落笔存一份「笔迹前的快照」，撤销时回放 */
const history = [];
const MAX_HISTORY = 30;

let ctx = null;
let drawing = false;
let dpr = 1;

const toPx = (v) => {
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

/* width / height 解析结果 */
const widthSpec = computed(() => parseLen(props.width, 480));
const heightSpec = computed(() => parseLen(props.height, 200));

/** 是否宽度自适应容器 */
const isFluidWidth = computed(() => widthSpec.value.unit === '%' || widthSpec.value.unit === 'auto');

/** 容器实测宽度（自适应模式下由 ResizeObserver 回填） */
const measuredWidth = ref(0);

/** 最终用于 canvas 的 CSS 宽度 */
const cssW = computed(() => {
  if (!isFluidWidth.value) return widthSpec.value.value;
  if (measuredWidth.value > 0) return measuredWidth.value;
  // 首帧还没测量到之前用 480 兜底，避免 canvas 宽度为 0 导致画不出来
  return 480;
});

const cssH = computed(() => (heightSpec.value.unit === 'px' ? heightSpec.value.value : 200));

/** 根节点宽度：固定像素时锁死，自适应时撑满容器 */
const rootWidthStyle = computed(() => {
  if (isFluidWidth.value) return '100%';
  return `${widthSpec.value.value}px`;
});

/**
 * 解析长度值：数字按 px，百分比 / auto 交给容器测量
 * 返回 { value, unit }，unit 为 'px' | '%' | 'auto'
 */
const parseLen = (v, fallback) => {
  if (v === '' || v === null || v === undefined) return { value: fallback, unit: 'px' };
  if (typeof v === 'number') return { value: v, unit: 'px' };
  const s = String(v).trim();
  if (s === 'auto' || s === '100%') return { value: toNumber(s), unit: s === '100%' ? '%' : 'auto' };
  if (s.endsWith('%')) return { value: parseFloat(s) || 100, unit: '%' };
  const n = parseFloat(s);
  return { value: isNaN(n) ? fallback : n, unit: 'px' };
};

const toNumber = (v) => parseFloat(String(v)) || 100;

/* ---------------- 初始化 ---------------- */
function setupCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const w = Math.max(1, Math.round(cssW.value));
  const h = Math.max(1, Math.round(cssH.value));

  dpr = window.devicePixelRatio || 1;
  // 物理像素 = CSS 像素 × dpr，避免高分屏笔迹发虚
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = props.penColor;
  ctx.lineWidth = props.lineWidth;
}

function getPos(e) {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function snapshot() {
  const canvas = canvasRef.value;
  if (!canvas) return null;
  try {
    return canvas.toDataURL('image/png');
  } catch (err) {
    return null;
  }
}

function pushHistory() {
  const snap = snapshot();
  if (!snap) return;
  history.push(snap);
  if (history.length > MAX_HISTORY) history.shift();
}

/* ---------------- 绘制 ---------------- */
function onDown(e) {
  if (props.disabled) return;
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;

  pushHistory();
  drawing = true;
  // 合成事件或部分浏览器可能没有活跃指针，捕获失败不应中断书写
  try {
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  } catch (err) {
    /* 忽略：非真实指针序列 */
  }

  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  // 单击也要留一个点
  ctx.lineTo(x + 0.01, y + 0.01);
  ctx.stroke();

  hasInk.value = true;
  emit('start', { x, y });
}

function onMove(e) {
  if (!drawing || props.disabled || !ctx) return;
  const { x, y } = getPos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function onUp(e) {
  if (!drawing) return;
  drawing = false;
  const canvas = canvasRef.value;
  if (canvas && e && e.pointerId !== undefined && canvas.releasePointerCapture) {
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch (err) {
      /* 指针可能已释放 */
    }
  }
  emit('end', { dataUrl: toDataURL() });
  emit('change', toDataURL());
}

/* ---------------- 操作 ---------------- */
function clear() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, cssW.value, cssH.value);
  history.length = 0;
  hasInk.value = false;
  emit('clear');
  emit('change', '');
}

function undo() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx || !history.length) return;

  const snap = history.pop();
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, cssW.value, cssH.value);
    ctx.drawImage(img, 0, 0, cssW.value, cssH.value);
    hasInk.value = history.length > 0;
    emit('undo');
    emit('change', hasInk.value ? toDataURL() : '');
  };
  img.src = snap;
}

/** 导出为 dataURL；默认透明底，传 exportBgColor 可铺底色 */
function toDataURL(type = 'image/png', quality = 1, bgColor = props.exportBgColor) {
  const canvas = canvasRef.value;
  if (!canvas) return '';

  if (!bgColor) return canvas.toDataURL(type, quality);

  const tmp = document.createElement('canvas');
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  const tctx = tmp.getContext('2d');
  tctx.fillStyle = bgColor;
  tctx.fillRect(0, 0, tmp.width, tmp.height);
  tctx.drawImage(canvas, 0, 0);
  return tmp.toDataURL(type, quality);
}

/** 直接触发下载 */
function download(filename = 'signature.png') {
  const url = toDataURL();
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** 载入已有图片作为底图 */
function loadImage(src) {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.clearRect(0, 0, cssW.value, cssH.value);
    ctx.drawImage(img, 0, 0, cssW.value, cssH.value);
    hasInk.value = true;
  };
  img.src = src;
}

let ro = null;

/** 记录上一次的渲染尺寸，尺寸没变就不重绘画布，避免滚动时闪烁 */
let lastSize = { w: 0, h: 0 };

function redrawWithSize() {
  const w = Math.round(cssW.value);
  const h = Math.round(cssH.value);
  if (w === lastSize.w && h === lastSize.h) return;

  // 尺寸变化会重置画布，先备份再恢复
  const snap = hasInk.value ? snapshot() : null;
  setupCanvas();
  lastSize = { w, h };

  if (snap) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, w, h);
    img.src = snap;
  }
}

/** 测量容器宽度（自适应模式才有意义） */
function measureWidth() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const wrap = canvas.parentElement;
  if (!wrap) return;

  // 父级宽度已扣掉 padding / border，可直接作为画布宽度
  const w = Math.floor(wrap.clientWidth);
  if (w > 0 && w !== measuredWidth.value) {
    measuredWidth.value = w;
  }
}

onMounted(async () => {
  measureWidth();
  setupCanvas();
  lastSize = { w: Math.round(cssW.value), h: Math.round(cssH.value) };

  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => {
      measureWidth();
      redrawWithSize();
    });
    if (canvasRef.value && canvasRef.value.parentElement) {
      ro.observe(canvasRef.value.parentElement);
    }
  }
});

// 外部直接改 width / height 时同步重建
watch(
  () => [props.width, props.height],
  async () => {
    await nextTick();
    measureWidth();
    redrawWithSize();
  }
);

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});

defineExpose({ clear, undo, toDataURL, download, loadImage, hasInk });
</script>

<style scoped lang="scss">
.pui-signature {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  /* 固定像素时不允许被 flex 容器压缩，否则画布会被裁 */
  flex: none;
  max-width: 100%;

  /* 自适应容器：撑满父级，画布随容器宽度重算 */
  &.is-fluid {
    width: 100%;
    min-width: 0;

    .pui-signature__canvas-wrap {
      width: 100%;
      min-width: 0;
    }
  }

  &__hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--pui-text, #1c2534);
  }

  &__tools {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__tool {
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 8px;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text-muted, #8b96a6);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      color: var(--pui-brand, #0e80eb);
      border-color: var(--pui-brand, #0e80eb);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
  }

  &__canvas-wrap {
    position: relative;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 12px;
    overflow: hidden;
    background: var(--pui-bg-elevated, #fff);
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    /* canvas 是定宽块级元素，容器必须裁掉溢出，否则会撑破父级 */
    max-width: 100%;
    box-sizing: border-box;

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
    }
  }

  &__canvas {
    display: block;
    cursor: crosshair;
  }

  &__placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
    pointer-events: none;
    user-select: none;
  }

  &__baseline {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 22px;
    height: 0;
    border-bottom: 1px dashed var(--pui-border, #e7ecf3);
    pointer-events: none;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    // 提示文字与签名画布之间留出呼吸间距，避免紧贴书写区域
    margin-top: 10px;
    // 画布底部圆角与边框在部分浏览器下会溢出 1px，留一点内边距更稳
    padding: 0 2px;
  }

  &__tip {
    font-size: 12px;
    line-height: 1.6;
    color: var(--pui-text-muted, #8b96a6);
  }

  &.is-disabled &__canvas-wrap {
    background: var(--pui-bg-soft, #f7f9fc);
    cursor: not-allowed;
  }

  &.is-disabled &__canvas {
    cursor: not-allowed;
  }
}
</style>
