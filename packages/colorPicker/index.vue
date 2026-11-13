<template>
  <div
    ref="rootRef"
    :class="['pui-color-picker', `pui-color-picker--${size}`, customClass, { 'is-disabled': disabled }]"
    @click="onTriggerClick"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="pui-color-picker__trigger"
      :disabled="disabled"
      :aria-expanded="visible"
      aria-haspopup="dialog"
    >
      <span class="pui-color-picker__swatch" :style="{ '--swatch-color': previewColor }">
        <span class="pui-color-picker__swatch-fill" :style="{ background: previewColor }"></span>
      </span>
      <span class="pui-color-picker__value">{{ text }}</span>
      <i
        v-if="clearable && modelValue"
        class="iconfont t-icon-close pui-color-picker__clear"
        title="清除"
        @click.stop="clear"
      ></i>
      <i v-else class="iconfont t-icon-arrow-down pui-color-picker__arrow" aria-hidden="true"></i>
    </button>

    <teleport to="body">
      <transition name="pui-cp-fade">
        <div v-if="visible" ref="panelRef" class="pui-color-picker__panel" :style="panelStyle" role="dialog">
          <!-- 饱和度 / 明度面板 -->
          <div
            ref="svRef"
            class="pui-cp-sv"
            :style="{ background: svBackground }"
            @pointerdown="onSvDown"
          >
            <span class="pui-cp-sv__dot" :style="svDotStyle"></span>
          </div>

          <!-- 色相条 -->
          <div ref="hueRef" class="pui-cp-slider pui-cp-hue" @pointerdown="onHueDown">
            <span class="pui-cp-slider__thumb" :style="{ left: `${(hsv.h / 360) * 100}%` }"></span>
          </div>

          <!-- 透明度条 -->
          <div v-if="showAlpha" ref="alphaRef" class="pui-cp-slider pui-cp-alpha" @pointerdown="onAlphaDown">
            <span class="pui-cp-alpha__bar" :style="{ background: alphaBar }"></span>
            <span class="pui-cp-slider__thumb" :style="{ left: `${alpha * 100}%` }"></span>
          </div>

          <!-- 数值区 -->
          <div class="pui-cp-body">
            <span class="pui-cp-preview pui-cp-checker" :style="{ '--color': previewColor }"></span>
            <input
              v-model="hexInput"
              class="pui-cp-hex"
              type="text"
              spellcheck="false"
              :placeholder="hexPlaceholder"
              @keydown.enter.prevent="commitHex"
              @blur="commitHex"
            />
            <!-- 透明度数值可直接输入 -->
            <label v-if="showAlpha" class="pui-cp-alpha-field">
              <input
                v-model.number="alphaInput"
                class="pui-cp-alpha-input"
                type="number"
                min="0"
                max="100"
                step="1"
                aria-label="透明度百分比"
                @keydown.enter.prevent="commitAlpha"
                @blur="commitAlpha"
              />
              <span class="pui-cp-alpha-unit">%</span>
            </label>
          </div>

          <!-- 预设色板 -->
          <div v-if="predefine && predefine.length" class="pui-cp-presets">
            <span
              v-for="c in predefine"
              :key="c"
              class="pui-cp-presets__item pui-cp-checker"
              :class="{ 'is-active': normalize(c) === normalize(modelValue) }"
              :style="{ '--color': c }"
              :title="c"
              @click="pickPreset(c)"
            ></span>
          </div>

          <!-- 底部操作 -->
          <div class="pui-cp-footer">
            <button type="button" class="pui-cp-link" @click="pickPreset(defaultColor)">默认颜色</button>
            <label class="pui-cp-link">
              更多颜色
              <input v-model="nativeColor" type="color" class="pui-cp-native" @input="onNative" />
            </label>
            <button type="button" class="pui-cp-link pui-cp-link--primary" @click="confirm">确定</button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'tColorPicker'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  defaultColor: { type: String, default: '#0e80eb' },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'default' }, // default | small
  clearable: { type: Boolean, default: true },
  showAlpha: { type: Boolean, default: false },
  predefine: {
    type: Array,
    default: () => [
      '#0e80eb', '#1677ff', '#722ed1', '#eb2f96', '#f5222d',
      '#fa8c16', '#faad14', '#52c41a', '#13c2c2', '#2f3542',
      '#8c8c8c', '#ffffff'
    ]
  },
  placement: { type: String, default: 'bottom-start' },
  autoClose: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'visible-change']);

/* ---------------- 颜色换算 ---------------- */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const hexToRgb = (input) => {
  if (!input) return null;
  let s = String(input).trim();
  if (s.startsWith('rgb')) {
    const nums = s.replace(/[^\d.,]/g, '').split(',').map(Number);
    if (nums.length >= 3) return { r: nums[0], g: nums[1], b: nums[2], a: nums[3] ?? 1 };
    return null;
  }
  s = s.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  if (s.length === 8) {
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16),
      a: parseInt(s.slice(6, 8), 16) / 255
    };
  }
  if (s.length !== 6) return null;
  const n = parseInt(s, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
};

const rgbToHex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');

const rgbToHsv = ({ r, g, b }) => {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
};

const hsvToRgb = ({ h, s, v }) => {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rgb = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return { r: (rgb[0] + m) * 255, g: (rgb[1] + m) * 255, b: (rgb[2] + m) * 255 };
};

const normalize = (v) => {
  const rgb = hexToRgb(v);
  return rgb ? rgbToHex(rgb).toLowerCase() : '';
};

/* ---------------- 状态 ---------------- */
const baseColor = computed(() => normalize(props.modelValue) || normalize(props.defaultColor) || '#0e80eb');

const hsv = ref(rgbToHsv(hexToRgb(baseColor.value)));
const alpha = ref(showAlphaInit());
function showAlphaInit() {
  const rgb = hexToRgb(props.modelValue);
  return props.showAlpha && rgb && rgb.a < 1 ? rgb.a : 1;
}

const hexInput = ref(baseColor.value);
watch(baseColor, (c) => {
  if (normalize(hexInput.value) === c) return;
  const rgb = hexToRgb(c);
  if (!rgb) return;
  const next = rgbToHsv(rgb);
  // 灰色（s=0）时保留当前色相，避免拖动明度时色相跳回 0
  hsv.value = { h: next.s === 0 ? hsv.value.h : next.h, s: next.s, v: next.v };
  hexInput.value = c;
});

const currentHex = computed(() => rgbToHex(hsvToRgb(hsv.value)));
const previewColor = computed(() => {
  const { r, g, b } = hsvToRgb(hsv.value);
  if (!props.showAlpha || alpha.value >= 1) return currentHex.value;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha.value.toFixed(2)})`;
});
const text = computed(() => normalize(props.modelValue) || '请选择颜色');

const svBackground = computed(
  () => `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.value.h}, 100%, 50%))`
);
const svDotStyle = computed(() => ({
  left: `${hsv.value.s * 100}%`,
  top: `${(1 - hsv.value.v) * 100}%`,
  background: currentHex.value
}));
const alphaBar = computed(
  () => `linear-gradient(to right, transparent, ${currentHex.value})`
);

/** 透明度百分比输入框的显示值，跟随滑块变化 */
const alphaInput = ref(Math.round(alpha.value * 100));
watch(alpha, (a) => {
  const pct = Math.round(a * 100);
  if (alphaInput.value !== pct) alphaInput.value = pct;
});

/** 输入框占位：开启透明度时提示支持 8 位 hex */
const hexPlaceholder = computed(() => (props.showAlpha ? '#RRGGBBAA' : '#RRGGBB'));

/** 提交透明度输入框：非法值回退到当前值 */
const commitAlpha = () => {
  let pct = Number(alphaInput.value);
  if (!Number.isFinite(pct)) pct = Math.round(alpha.value * 100);
  pct = clamp(pct, 0, 100);
  alphaInput.value = Math.round(pct);
  alpha.value = pct / 100;
  emitValue(props.showAlpha ? previewColor.value : hexInput.value);
};

/* ---------------- 定位 ---------------- */
const rootRef = ref(null);
const panelRef = ref(null);
const svRef = ref(null);
const hueRef = ref(null);
const alphaRef = ref(null);
const visible = ref(false);
const pos = ref({ top: 0, left: 0 });

const panelStyle = computed(() => ({ top: `${pos.value.top}px`, left: `${pos.value.left}px` }));

const updatePosition = () => {
  if (!rootRef.value) return;
  const trigger = rootRef.value.querySelector('.pui-color-picker__trigger');
  if (!trigger) return;
  const r = trigger.getBoundingClientRect();
  const panel = panelRef.value;
  const pw = panel ? panel.offsetWidth : 264;
  const ph = panel ? panel.offsetHeight : 340;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 8;
  const gap = 8;

  let left = r.left;
  if (props.placement === 'bottom') left = r.left + r.width / 2 - pw / 2;
  if (props.placement === 'bottom-end') left = r.right - pw;
  left = Math.max(margin, Math.min(left, vw - pw - margin));

  let top = r.bottom + gap;
  if (top + ph > vh - margin && r.top - gap - ph > margin) top = r.top - gap - ph;

  pos.value = { top, left };
};

/* ---------------- 开合 ---------------- */
const open = async () => {
  if (props.disabled || visible.value) return;
  visible.value = true;
  await nextTick();
  updatePosition();
  bindGlobal();
  emit('visible-change', true);
};
const close = () => {
  if (!visible.value) return;
  visible.value = false;
  unbindGlobal();
  emit('visible-change', false);
};
const toggle = () => (visible.value ? close() : open());

const onTriggerClick = () => {
  if (props.disabled) return;
  toggle();
};

const onDocumentClick = (e) => {
  if (rootRef.value && rootRef.value.contains(e.target)) return;
  if (panelRef.value && panelRef.value.contains(e.target)) return;
  close();
};
const onScroll = () => { if (visible.value) updatePosition(); };
const onResize = () => { if (visible.value) updatePosition(); };
const bindGlobal = () => {
  document.addEventListener('click', onDocumentClick, true);
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);
};
const unbindGlobal = () => {
  document.removeEventListener('click', onDocumentClick, true);
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', onResize);
};
onBeforeUnmount(unbindGlobal);

const onKeydown = (e) => {
  if (e.key === 'Escape' && visible.value) close();
};

/* ---------------- 拖拽取色 ---------------- */
const dragging = ref('');

const applySv = (e) => {
  const el = svRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const s = clamp((e.clientX - r.left) / r.width, 0, 1);
  const v = 1 - clamp((e.clientY - r.top) / r.height, 0, 1);
  hsv.value = { ...hsv.value, s, v };
  syncInput();
};
const applyHue = (e) => {
  const el = hueRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const h = clamp((e.clientX - r.left) / r.width, 0, 1) * 360;
  hsv.value = { ...hsv.value, h: h >= 360 ? 359.9 : h };
  syncInput();
};
const applyAlpha = (e) => {
  const el = alphaRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  alpha.value = clamp((e.clientX - r.left) / r.width, 0, 1);
  syncInput();
};

const onMove = (e) => {
  if (dragging.value === 'sv') applySv(e);
  else if (dragging.value === 'hue') applyHue(e);
  else if (dragging.value === 'alpha') applyAlpha(e);
};
const onUp = () => {
  dragging.value = '';
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
};

const startDrag = (type, e) => {
  if (props.disabled) return;
  dragging.value = type;
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
};

const onSvDown = (e) => { e.preventDefault(); applySv(e); startDrag('sv', e); };
const onHueDown = (e) => { e.preventDefault(); applyHue(e); startDrag('hue', e); };
const onAlphaDown = (e) => { e.preventDefault(); applyAlpha(e); startDrag('alpha', e); };

/* ---------------- 变更提交 ---------------- */
let emitTimer = null;
const syncInput = () => {
  hexInput.value = currentHex.value;
  if (emitTimer) clearTimeout(emitTimer);
  emitTimer = setTimeout(() => emitValue(previewColor.value), 60);
};

const emitValue = (val) => {
  emit('update:modelValue', val);
  emit('change', val);
};

const commitHex = () => {
  const rgb = hexToRgb(hexInput.value);
  if (!rgb) {
    hexInput.value = currentHex.value;
    return;
  }
  const next = rgbToHsv(rgb);
  hsv.value = { h: next.s === 0 ? hsv.value.h : next.h, s: next.s, v: next.v };

  // 支持 #RRGGBBAA：输入里带 alpha 时同步到透明度滑块
  if (props.showAlpha && typeof rgb.a === 'number' && rgb.a >= 0) {
    alpha.value = clamp(rgb.a, 0, 1);
    alphaInput.value = Math.round(alpha.value * 100);
  }

  hexInput.value = rgbToHex(rgb);
  emitValue(props.showAlpha ? previewColor.value : hexInput.value);
};

const pickPreset = (c) => {
  const rgb = hexToRgb(c);
  if (!rgb) return;
  const next = rgbToHsv(rgb);
  hsv.value = next;
  // 预设色本身若带透明度（rgba / hex8），沿用它的 alpha
  alpha.value = props.showAlpha && typeof rgb.a === 'number' ? clamp(rgb.a, 0, 1) : 1;
  alphaInput.value = Math.round(alpha.value * 100);
  hexInput.value = rgbToHex(rgb);
  emitValue(props.showAlpha ? previewColor.value : rgbToHex(rgb));
  if (props.autoClose) close();
};

const nativeColor = ref(baseColor.value);
watch(currentHex, (v) => { nativeColor.value = v; });
const onNative = () => pickPreset(nativeColor.value);

const confirm = () => {
  emitValue(previewColor.value);
  close();
};

const clear = () => {
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
};

watch(
  () => props.modelValue,
  () => {
    if (normalize(hexInput.value) !== baseColor.value) hexInput.value = baseColor.value;
  }
);

defineExpose({ open, close, toggle });
</script>

<style lang="scss" scoped>
.pui-color-picker {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  vertical-align: middle;
}

/* ---------- 触发器 ---------- */
.pui-color-picker__trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-width: 148px;
  padding: 6px 10px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text-1, #1f2d3d);
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover:not(:disabled) { border-color: var(--pui-brand, #0e80eb); }
  &:focus-visible {
    outline: none;
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.16));
  }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
}

.pui-color-picker__swatch {
  position: relative;
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  overflow: hidden;
  /* 透明底棋盘格 */
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.pui-color-picker__swatch-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.pui-color-picker__value {
  flex: 1;
  text-align: left;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: var(--pui-text-2, #4a5866);
}

.pui-color-picker__arrow {
  flex: none;
  font-size: 10px;
  color: var(--pui-text-3, #97a3b4);
}
.pui-color-picker__clear {
  flex: none;
  font-size: 11px;
  color: var(--pui-text-3, #97a3b4);
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease;
  &:hover { color: var(--pui-danger, #ec3437); }
}
.pui-color-picker__trigger:hover .pui-color-picker__clear { opacity: 1; }

.pui-color-picker--small .pui-color-picker__trigger {
  min-width: 120px;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 8px;
}
.pui-color-picker--small .pui-color-picker__swatch { width: 14px; height: 14px; border-radius: 4px; }

/* ---------- 面板 ---------- */
.pui-color-picker__panel {
  position: fixed;
  z-index: 3000;
  width: 264px;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
  box-shadow: 0 18px 44px rgba(12, 24, 44, 0.16), 0 2px 8px rgba(12, 24, 44, 0.06);
  user-select: none;
}

.pui-cp-sv {
  position: relative;
  height: 140px;
  border-radius: 10px;
  cursor: crosshair;
  touch-action: none;
}

.pui-cp-sv__dot {
  position: absolute;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #fff, 0 1px 4px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.pui-cp-slider {
  position: relative;
  height: 12px;
  margin-top: 12px;
  border-radius: 6px;
  cursor: pointer;
  touch-action: none;
}

.pui-cp-hue {
  background: linear-gradient(
    to right,
    #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%
  );
}

.pui-cp-alpha {
  margin-top: 10px;
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
}
.pui-cp-alpha__bar {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.pui-cp-slider__thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.22);
  pointer-events: none;
}

.pui-cp-body {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

/* ---------------------------------------------------------------------------
   棋盘格底色
   ---------------------------------------------------------------------------
   半透明颜色必须叠在棋盘格上才能看出透明度。之前预览块与预设色块都是直接
   铺纯色，rgba(…,0.3) 看起来和实色一样，用户会误以为透明度没生效。
   用两层 linear-gradient 拼出 8px 的格子，再叠一层从 --color 取色的实心层。
   --------------------------------------------------------------------------- */
.pui-cp-checker {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #d9dee7 25%, transparent 25%, transparent 75%, #d9dee7 75%),
    linear-gradient(45deg, #d9dee7 25%, transparent 25%, transparent 75%, #d9dee7 75%);
  background-size: 8px 8px;
  background-position: 0 0, 4px 4px;

  /* 颜色层叠在棋盘格之上 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color, transparent);
    border-radius: inherit;
  }
}

.pui-cp-preview {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

/* 透明度数值输入 */
.pui-cp-alpha-field {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  height: 28px;
  padding: 0 7px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 8px;
  background: var(--pui-bg-soft, #f7f9fc);
  box-sizing: border-box;

  &:focus-within {
    border-color: var(--pui-brand, #0e80eb);
    background: var(--pui-bg-elevated, #fff);
  }
}

.pui-cp-alpha-input {
  width: 30px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 12.5px;
  color: var(--pui-text, #1c2534);
  text-align: right;
  font-variant-numeric: tabular-nums;

  /* 去掉数字输入框的上下箭头 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
  appearance: textfield;
}

.pui-cp-alpha-unit {
  font-size: 11.5px;
  color: var(--pui-text-muted, #8b96a6);
}

.pui-cp-hex {
  flex: 1;
  min-width: 0;
  height: 28px;
  box-sizing: border-box;
  padding: 0 10px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 8px;
  background: var(--pui-bg-soft, #f7f9fc);
  color: var(--pui-text-1, #1f2d3d);
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  outline: none;
  transition: border-color 0.16s ease, background 0.16s ease;

  &:focus {
    border-color: var(--pui-brand, #0e80eb);
    background: var(--pui-bg-elevated, #fff);
  }
}

.pui-cp-alpha-text {
  flex: none;
  font-size: 12px;
  color: var(--pui-text-3, #8b97a8);
  font-variant-numeric: tabular-nums;
}

.pui-cp-presets {
  display: grid;
  /* 列数跟随色块数量，最多 12 列；固定 12 列会在色块较少时留出大量空位 */
  grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
  gap: 5px;
  margin-top: 14px;
  /* 给 hover 放大留出空间，避免被面板边缘裁切 */
  padding: 2px;
}

.pui-cp-presets__item {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 5px;
  cursor: pointer;
  /* 描边用 outline 而不是 inset box-shadow，避免被棋盘格的 ::after 盖住 */
  outline: 1px solid rgba(0, 0, 0, 0.08);
  outline-offset: -1px;
  transition: transform 0.14s ease, box-shadow 0.14s ease;

  &:hover { transform: scale(1.18); }
  &.is-active {
    box-shadow: 0 0 0 2px var(--pui-bg-elevated, #fff), 0 0 0 3.5px var(--pui-brand, #0e80eb);
  }
}

.pui-cp-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--pui-border, #eef2f7);
}

.pui-cp-link {
  position: relative;
  padding: 0;
  border: 0;
  background: none;
  color: var(--pui-text-3, #6b7a8d);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.16s ease;
  overflow: hidden;

  &:hover { color: var(--pui-brand, #0e80eb); }
  &--primary {
    margin-left: auto;
    padding: 5px 12px;
    border-radius: 7px;
    background: var(--pui-brand, #0e80eb);
    color: #fff;
    font-weight: 500;
    &:hover { color: #fff; opacity: 0.9; }
  }
}

.pui-cp-native {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  border: 0;
  padding: 0;
}

/* ---------- 过渡 ---------- */
.pui-cp-fade-enter-active,
.pui-cp-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
  transform-origin: top center;
}
.pui-cp-fade-enter-from,
.pui-cp-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
