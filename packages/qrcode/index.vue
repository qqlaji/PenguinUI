<template>
  <div
    :class="['pui-qrcode', `pui-qrcode--${type}`, customClass, { 'is-disabled': disabled }]"
    :style="rootStyle"
  >
    <div class="pui-qrcode__canvas" :style="{ padding: toPx(padding), background: bgColor }">
      <svg
        v-if="!error"
        class="pui-qrcode__svg"
        :width="size"
        :height="size"
        :viewBox="`0 0 ${box} ${box}`"
        shape-rendering="crispEdges"
        role="img"
        :aria-label="`二维码：${value}`"
      >
        <path v-if="type !== 'round'" :d="path" :fill="color" />

        <g v-else :fill="color">
          <circle
            v-for="(dot, i) in dots"
            :key="i"
            :cx="dot[0] + 0.5"
            :cy="dot[1] + 0.5"
            :r="0.5"
          />
        </g>

        <rect
          v-if="logo && !logoFailed"
          :x="logoRect.x"
          :y="logoRect.y"
          :width="logoRect.w"
          :height="logoRect.h"
          :rx="logoRect.r"
          :fill="bgColor"
        />
      </svg>

      <div v-else class="pui-qrcode__error">
        <i class="iconfont t-icon-warning-circle" aria-hidden="true"></i>
        <span>{{ error }}</span>
      </div>

      <img
        v-if="logo && !logoFailed && !error"
        class="pui-qrcode__logo-img"
        :src="logo"
        alt=""
        :style="logoImgStyle"
        @error="logoFailed = true"
      />

      <div v-if="status" class="pui-qrcode__status" :class="`is-${status}`">
        <template v-if="status === 'loading'">
          <span class="pui-qrcode__spinner"></span>
          <span>{{ statusText || '生成中...' }}</span>
        </template>
        <template v-else>
          <button type="button" class="pui-qrcode__refresh" @click.stop="refresh">
            <i class="iconfont t-icon-refresh" aria-hidden="true"></i>
            <span>{{ statusText || '已失效，点击刷新' }}</span>
          </button>
        </template>
      </div>
    </div>

    <div v-if="title || $slots.title" class="pui-qrcode__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="description || $slots.description" class="pui-qrcode__desc">
      <slot name="description">{{ description }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tQrcode'
};
</script>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { encodeQR, matrixToPath } from './encoder';

const props = defineProps({
  /** 二维码内容 */
  value: { type: String, default: '' },
  /** 二维码边长（px） */
  size: { type: Number, default: 160 },
  /** 纠错等级，越高越抗污损但容量越小 */
  level: { type: String, default: 'M' }, // L | M | Q | H
  /** 前景色 */
  color: { type: String, default: '#1c2534' },
  /** 背景色 */
  bgColor: { type: String, default: '#ffffff' },
  /** 静默区（px） */
  padding: { type: [Number, String], default: 8 },
  /** 模块形状：rect 方形 / round 圆点 */
  type: { type: String, default: 'rect' }, // rect | round
  /** 中心 logo 图片地址 */
  logo: { type: String, default: '' },
  /** logo 占位比例（相对二维码宽度） */
  logoScale: { type: Number, default: 0.22 },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  /** 状态：loading 生成中 / expired 已失效 */
  status: { type: String, default: '' }, // '' | loading | expired
  statusText: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['refresh', 'error']);

/** 含静默区的模块矩阵 */
const padded = ref([]);
const error = ref('');
const logoFailed = ref(false);

const toPx = (v) => {
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const rootStyle = computed(() => ({
  width: `${props.size}px`
}));

const box = computed(() => padded.value.length || 21);

const path = computed(() => (padded.value.length ? matrixToPath(padded.value, 0) : ''));

/** 圆点形态的暗模块坐标 */
const dots = computed(() => {
  const out = [];
  const src = padded.value;
  for (let r = 0; r < src.length; r += 1) {
    for (let c = 0; c < src.length; c += 1) {
      if (src[r][c]) out.push([c, r]);
    }
  }
  return out;
});

const logoRect = computed(() => {
  const n = box.value;
  const w = n * props.logoScale;
  return { x: (n - w) / 2, y: (n - w) / 2, w, h: w, r: w * 0.16 };
});

const logoImgStyle = computed(() => {
  const inner = props.size - parseFloat(toPx(props.padding)) * 2;
  const w = inner * props.logoScale;
  return { width: `${w}px`, height: `${w}px` };
});

/* ---------------- 编码 ---------------- */
function generate() {
  logoFailed.value = false;
  if (!props.value) {
    padded.value = [];
    error.value = '';
    return;
  }
  try {
    const { modules } = encodeQR(props.value, { level: props.level });
    // 四周补 1 格静默区，模块坐标与 viewBox 对齐
    const n = modules.length + 2;
    const rows = [];
    const blank = new Array(n).fill(false);
    rows.push(blank.slice());
    for (let r = 0; r < modules.length; r += 1) {
      const row = [false];
      for (let c = 0; c < modules.length; c += 1) row.push(!!modules[r][c]);
      row.push(false);
      rows.push(row);
    }
    rows.push(blank.slice());
    padded.value = rows;
    error.value = '';
  } catch (e) {
    padded.value = [];
    error.value = (e && e.message) || '二维码生成失败';
    emit('error', e);
  }
}

const refresh = () => emit('refresh');

watch(
  () => [props.value, props.level],
  generate
);

onMounted(generate);

defineExpose({ refresh, generate });
</script>

<style scoped lang="scss">
.pui-qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;

  &__canvas {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    box-sizing: border-box;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(24, 44, 78, 0.08);
  }

  &__svg {
    display: block;
    border-radius: 4px;
  }

  &__logo-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    object-fit: contain;
    background: #fff;
    pointer-events: none;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    height: 100%;
    min-height: 100px;
    padding: 12px;
    box-sizing: border-box;
    text-align: center;
    font-size: 12px;
    line-height: 1.6;
    color: var(--pui-danger, #ec3437);
    background: var(--pui-bg-soft, #f7f9fc);
  }

  &__status {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.94);
    font-size: 12px;
    color: var(--pui-text-sub, #5b6879);
    border-radius: 12px;

    &.is-loading { color: var(--pui-text-muted, #8b96a6); }
  }

  &__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--pui-border, #e7ecf3);
    border-top-color: var(--pui-brand, #0e80eb);
    border-radius: 50%;
    animation: pui-qrcode-spin 0.8s linear infinite;
  }

  &__refresh {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 8px;
    background: #fff;
    color: var(--pui-brand, #0e80eb);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
    }
  }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--pui-text, #1c2534);
    text-align: center;
  }

  &__desc {
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    text-align: center;
    max-width: 220px;
    line-height: 1.6;
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

@keyframes pui-qrcode-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .pui-qrcode__spinner { animation: none; }
}
</style>
