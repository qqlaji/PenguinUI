<template>
  <div
    class="pui-image"
    :class="{ 'is-round': round, 'is-loading': loading, 'is-error': hasError }"
    :style="rootStyle"
  >
    <img
      v-if="!hasError"
      ref="imgRef"
      class="pui-image__inner"
      :src="src"
      :alt="alt"
      :style="innerStyle"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="onLoad"
      @error="onError"
    />

    <div v-else class="pui-image__error">
      <slot name="error">
        <i class="t-icon-picture"></i>
        <span>加载失败</span>
      </slot>
    </div>

    <div v-if="loading && !hasError" class="pui-image__loading">
      <i class="t-icon-loading"></i>
    </div>

    <div
      v-if="preview && !hasError"
      class="pui-image__mask"
      @click="openViewer"
    >
      <slot name="mask">
        <i class="t-icon-search"></i>
        <span>预览</span>
      </slot>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="pui-image-fade">
      <div
        v-if="viewerVisible"
        class="pui-image-viewer"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        aria-label="图片预览"
        @click.self="onMaskClick"
      >
        <div class="pui-image-viewer__mask"></div>

        <img
          class="pui-image-viewer__img"
          :class="{ 'is-dragging': dragging }"
          :src="currentSrc"
          :alt="alt"
          :style="imgTransform"
          @click.stop
          @pointerdown="onDragStart"
          @wheel.prevent="onWheel"
        />

        <button type="button" class="pui-image-viewer__close" aria-label="关闭" @click="closeViewer">
          <i class="t-icon-close"></i>
        </button>

        <button
          v-if="srcList.length > 1"
          type="button"
          class="pui-image-viewer__switch pui-image-viewer__switch--prev"
          aria-label="上一张"
          @click.stop="switchTo(-1)"
        >
          <i class="t-icon-arrow-left-filling"></i>
        </button>
        <button
          v-if="srcList.length > 1"
          type="button"
          class="pui-image-viewer__switch pui-image-viewer__switch--next"
          aria-label="下一张"
          @click.stop="switchTo(1)"
        >
          <i class="t-icon-arrow-right-filling"></i>
        </button>

        <div class="pui-image-viewer__toolbar" @click.stop>
          <button type="button" aria-label="缩小" @click="zoomBy(-0.25)">
            <i class="t-icon-zoom-out"></i>
          </button>
          <span class="pui-image-viewer__scale">{{ Math.round(scale * 100) }}%</span>
          <button type="button" aria-label="放大" @click="zoomBy(0.25)">
            <i class="t-icon-zoom-in"></i>
          </button>
          <span class="pui-image-viewer__divider"></span>
          <button type="button" aria-label="左转" @click="rotateBy(-90)">
            <i class="t-icon-refresh"></i>
          </button>
          <button type="button" aria-label="右转" @click="rotateBy(90)">
            <i class="t-icon-refresh pui-icon-flip"></i>
          </button>
          <span class="pui-image-viewer__divider"></span>
          <button type="button" aria-label="重置" @click="reset">
            <i class="t-icon-fullscreen-shrink"></i>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default { name: 'tImage' };
</script>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: [String, Number], default: '' },
  height: { type: [String, Number], default: '' },
  /** 填充方式，同 object-fit */
  fit: { type: String, default: 'fill' },
  /** 圆形 */
  round: { type: Boolean, default: false },
  /** 圆角，传入后覆盖默认圆角 */
  radius: { type: [String, Number], default: '' },
  /** 懒加载 */
  lazy: { type: Boolean, default: false },
  /** 是否开启点击预览 */
  preview: { type: Boolean, default: true },
  /** 预览图列表，为空时使用 src */
  previewSrcList: { type: Array, default: () => [] },
  /** 预览起始索引 */
  initialIndex: { type: Number, default: 0 },
  zIndex: { type: Number, default: 3000 },
  /** 点击遮罩关闭 */
  closeOnClickMask: { type: Boolean, default: true }
});

const emit = defineEmits(['load', 'error', 'viewer-open', 'viewer-close', 'switch']);

/* ---------- 基础状态 ---------- */
const loading = ref(true);
const hasError = ref(false);
const imgRef = ref(null);

watch(
  () => props.src,
  () => {
    loading.value = true;
    hasError.value = false;
  }
);

function onLoad(e) {
  loading.value = false;
  hasError.value = false;
  emit('load', e);
}

function onError(e) {
  loading.value = false;
  hasError.value = true;
  emit('error', e);
}

const size = (v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
};

const rootStyle = computed(() => ({
  width: size(props.width),
  height: size(props.height),
  borderRadius: props.radius !== '' ? size(props.radius) : undefined
}));

const innerStyle = computed(() => ({ objectFit: props.fit }));

/* ---------- 预览 ---------- */
const viewerVisible = ref(false);
const scale = ref(1);
const rotate = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);
const dragging = ref(false);
const activeIndex = ref(0);

const srcList = computed(() => {
  if (props.previewSrcList && props.previewSrcList.length) return props.previewSrcList;
  return props.src ? [props.src] : [];
});

const currentSrc = computed(() => srcList.value[activeIndex.value] || props.src);

const imgTransform = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value}) rotate(${rotate.value}deg)`
}));

function reset() {
  scale.value = 1;
  rotate.value = 0;
  offsetX.value = 0;
  offsetY.value = 0;
}

function openViewer() {
  if (!props.src) return;
  const idx = srcList.value.indexOf(props.src);
  activeIndex.value = idx >= 0 ? idx : Math.min(props.initialIndex, srcList.value.length - 1);
  viewerVisible.value = true;
  reset();
  document.addEventListener('keydown', onKeydown);
  emit('viewer-open', activeIndex.value);
}

function closeViewer() {
  viewerVisible.value = false;
  dragging.value = false;
  document.removeEventListener('keydown', onKeydown);
  emit('viewer-close', activeIndex.value);
}

function onMaskClick() {
  if (props.closeOnClickMask) closeViewer();
}

function switchTo(delta) {
  if (srcList.value.length < 2) return;
  const len = srcList.value.length;
  activeIndex.value = ((activeIndex.value + delta) % len + len) % len;
  reset();
  emit('switch', activeIndex.value);
}

function zoomBy(delta) {
  scale.value = Math.min(4, Math.max(0.25, Number((scale.value + delta).toFixed(2))));
}

function rotateBy(delta) {
  rotate.value += delta;
}

/* 滚轮缩放 */
function onWheel(e) {
  zoomBy(e.deltaY > 0 ? -0.15 : 0.15);
}

/* 拖拽平移 */
let dragStart = null;
function onDragStart(e) {
  if (scale.value <= 1) return;
  dragging.value = true;
  dragStart = { x: e.clientX - offsetX.value, y: e.clientY - offsetY.value };
  e.target.setPointerCapture?.(e.pointerId);
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);
}
function onDragMove(e) {
  if (!dragStart) return;
  offsetX.value = e.clientX - dragStart.x;
  offsetY.value = e.clientY - dragStart.y;
}
function onDragEnd() {
  dragging.value = false;
  dragStart = null;
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
}

function onKeydown(e) {
  if (!viewerVisible.value) return;
  if (e.key === 'Escape') closeViewer();
  else if (e.key === 'ArrowLeft') switchTo(-1);
  else if (e.key === 'ArrowRight') switchTo(1);
  else if (e.key === '+' || e.key === '=') zoomBy(0.25);
  else if (e.key === '-') zoomBy(-0.25);
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', onDragEnd);
});

defineExpose({ open: openViewer, close: closeViewer, reset });
</script>

<style scoped lang="scss">
.pui-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 10px;
  background: var(--pui-bg-soft, #f2f5fa);
  line-height: 0;

  &.is-round {
    border-radius: 50%;
    .pui-image__inner { border-radius: 50%; }
  }

  &__inner {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    height: 100%;
    min-height: 88px;
    color: var(--pui-text-4, #a8b0bd);
    font-size: 12px;
    line-height: 1.4;
    i { font-size: 20px; }
  }

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pui-text-4, #a8b0bd);
    font-size: 20px;
    background: var(--pui-bg-soft, #f2f5fa);
    animation: pui-image-spin 1.2s linear infinite;
  }

  &__mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.22s ease;
    i { font-size: 18px; }

    &:hover,
    .pui-image:hover & {
      opacity: 1;
    }
  }
}

@keyframes pui-image-spin {
  to { transform: rotate(360deg); }
}

/* ---------- 预览层 ---------- */
.pui-image-viewer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(2px);
  }

  &__img {
    position: relative;
    max-width: 86vw;
    max-height: 82vh;
    user-select: none;
    transition: transform 0.22s ease;
    cursor: default;
    &.is-dragging {
      transition: none;
      cursor: grabbing;
    }
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 24px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s ease;
    &:hover { background: rgba(255, 255, 255, 0.28); }
  }

  &__switch {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s ease;
    &:hover { background: rgba(255, 255, 255, 0.3); }
    &--prev { left: 24px; }
    &--next { right: 24px; }
  }

  &__toolbar {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(20, 22, 26, 0.72);
    color: #fff;
    backdrop-filter: blur(6px);

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s ease;
      &:hover { background: rgba(255, 255, 255, 0.18); }
    }
  }

  &__scale {
    min-width: 44px;
    text-align: center;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  &__divider {
    width: 1px;
    height: 16px;
    margin: 0 2px;
    background: rgba(255, 255, 255, 0.24);
  }
}

.pui-icon-flip {
  transform: scaleX(-1);
}

.pui-image-fade-enter-active,
.pui-image-fade-leave-active {
  transition: opacity 0.22s ease;
}
.pui-image-fade-enter-from,
.pui-image-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pui-image__loading { animation: none; }
  .pui-image-viewer__img,
  .pui-image-fade-enter-active,
  .pui-image-fade-leave-active { transition: none; }
}
</style>
