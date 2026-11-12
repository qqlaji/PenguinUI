<template>
  <teleport to="body">
    <transition name="pui-iv-fade">
      <div
        v-if="modelValue"
        class="pui-image-viewer"
        :style="{ zIndex: Number(zIndex) }"
        role="dialog"
        aria-modal="true"
        aria-label="图片查看器"
        tabindex="-1"
        @wheel.prevent="onWheel"
        @keydown="onKeydown"
        ref="rootRef"
      >
        <!-- 顶部工具栏 -->
        <div class="pui-image-viewer__toolbar" @click.stop>
          <span class="pui-image-viewer__counter">{{ current + 1 }} / {{ list.length }}</span>
          <div class="pui-image-viewer__actions">
            <button type="button" class="pui-image-viewer__btn" title="缩小" @click="zoomBy(-0.25)">
              <i class="iconfont t-icon-minus" aria-hidden="true"></i>
            </button>
            <span class="pui-image-viewer__scale">{{ Math.round(scale * 100) }}%</span>
            <button type="button" class="pui-image-viewer__btn" title="放大" @click="zoomBy(0.25)">
              <i class="iconfont t-icon-add" aria-hidden="true"></i>
            </button>
            <button type="button" class="pui-image-viewer__btn" title="重置" @click="reset">
              <i class="iconfont t-icon-refresh" aria-hidden="true"></i>
            </button>
            <button type="button" class="pui-image-viewer__btn" title="向左旋转" @click="rotateBy(-90)">
              <i class="iconfont t-icon-back" aria-hidden="true"></i>
            </button>
            <button v-if="downloadable" type="button" class="pui-image-viewer__btn" title="下载" @click="download">
              <i class="iconfont t-icon-download" aria-hidden="true"></i>
            </button>
            <button type="button" class="pui-image-viewer__btn pui-image-viewer__btn--close" title="关闭" @click="close">
              <i class="iconfont t-icon-close" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- 图片区 -->
        <div class="pui-image-viewer__stage" @click.self="onMaskClick">
          <img
            v-if="currentSrc"
            ref="imgRef"
            class="pui-image-viewer__img"
            :src="currentSrc"
            :alt="currentAlt"
            :style="imgStyle"
            :class="{ 'is-dragging': dragging }"
            draggable="false"
            @mousedown.prevent="startDrag"
            @load="onLoad"
            @error="onError"
          />

          <div v-else class="pui-image-viewer__error">图片加载失败</div>
        </div>

        <!-- 左右切换 -->
        <button
          v-if="list.length > 1"
          type="button"
          class="pui-image-viewer__nav pui-image-viewer__nav--prev"
          title="上一张"
          @click.stop="prev"
        >
          <i class="iconfont t-icon-arrow-left-bold" aria-hidden="true"></i>
        </button>
        <button
          v-if="list.length > 1"
          type="button"
          class="pui-image-viewer__nav pui-image-viewer__nav--next"
          title="下一张"
          @click.stop="next"
        >
          <i class="iconfont t-icon-arrow-right-bold" aria-hidden="true"></i>
        </button>

        <!-- 缩略图条 -->
        <div v-if="list.length > 1 && showThumbnails" class="pui-image-viewer__thumbs" @click.stop>
          <button
            v-for="(item, i) in list"
            :key="i"
            type="button"
            class="pui-image-viewer__thumb"
            :class="{ 'is-active': i === current }"
            @click="goTo(i)"
          >
            <img :src="item.src" alt="" />
          </button>
        </div>

        <div v-if="caption" class="pui-image-viewer__caption">{{ caption }}</div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'tImageViewer'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 是否显示（v-model） */
  modelValue: { type: Boolean, default: false },
  /** 图片列表：字符串数组或 [{ src, alt, caption }] */
  images: { type: Array, default: () => [] },
  /** 当前索引（v-model:current） */
  current: { type: Number, default: 0 },
  /** 缩放步长 */
  step: { type: Number, default: 0.25 },
  /** 最小缩放 */
  minScale: { type: Number, default: 0.25 },
  /** 最大缩放 */
  maxScale: { type: Number, default: 5 },
  /** 点击遮罩关闭 */
  maskClosable: { type: Boolean, default: true },
  /** 显示缩略图条 */
  showThumbnails: { type: Boolean, default: true },
  /** 显示下载按钮 */
  downloadable: { type: Boolean, default: false },
  /** 标题 */
  caption: { type: String, default: '' },
  zIndex: { type: [Number, String], default: 2600 }
});

const emit = defineEmits(['update:modelValue', 'update:current', 'change', 'close']);

const rootRef = ref(null);
const imgRef = ref(null);

const scale = ref(1);
const rotate = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);
const dragging = ref(false);
const natural = ref({ w: 0, h: 0 });

/* ---------------- 列表规范化 ---------------- */
const list = computed(() =>
  (props.images || []).map((item) => {
    if (item !== null && typeof item === 'object') {
      return { src: item.src || '', alt: item.alt || '', caption: item.caption || '' };
    }
    return { src: String(item), alt: '', caption: '' };
  })
);

const safeIndex = computed(() => Math.min(Math.max(0, props.current), Math.max(0, list.value.length - 1)));
const currentItem = computed(() => list.value[safeIndex.value] || null);
const currentSrc = computed(() => (currentItem.value ? currentItem.value.src : ''));
const currentAlt = computed(() => (currentItem.value ? currentItem.value.alt : ''));

const imgStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value}) rotate(${rotate.value}deg)`,
  transition: dragging.value ? 'none' : 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: dragging.value ? 'grabbing' : 'grab'
}));

/* ---------------- 基础操作 ---------------- */
function setScale(next) {
  scale.value = Math.min(props.maxScale, Math.max(props.minScale, Number(next.toFixed(3))));
  // 缩回 1 倍以内时把位移归零，避免图片跑出视野
  if (scale.value <= 1) {
    offsetX.value = 0;
    offsetY.value = 0;
  }
}

function zoomBy(delta) {
  setScale(scale.value + delta);
}

function onWheel(e) {
  const delta = e.deltaY > 0 ? -props.step : props.step;
  setScale(scale.value + delta);
}

function rotateBy(deg) {
  rotate.value += deg;
}

function reset() {
  scale.value = 1;
  rotate.value = 0;
  offsetX.value = 0;
  offsetY.value = 0;
}

function goTo(index) {
  if (index < 0 || index >= list.value.length) return;
  if (index === safeIndex.value) return;
  emit('update:current', index);
  emit('change', index);
  reset();
}

function prev() {
  goTo(safeIndex.value <= 0 ? list.value.length - 1 : safeIndex.value - 1);
}

function next() {
  goTo(safeIndex.value >= list.value.length - 1 ? 0 : safeIndex.value + 1);
}

function onMaskClick() {
  if (props.maskClosable) close();
}

function close() {
  emit('update:modelValue', false);
  emit('close', safeIndex.value);
}

/* ---------------- 拖拽 ---------------- */
let dragStart = null;

function startDrag(e) {
  if (scale.value <= 1) return;
  dragStart = { x: e.clientX, y: e.clientY, ox: offsetX.value, oy: offsetY.value };
  dragging.value = true;
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', endDrag);
}

function onDragMove(e) {
  if (!dragStart) return;
  offsetX.value = dragStart.ox + (e.clientX - dragStart.x);
  offsetY.value = dragStart.oy + (e.clientY - dragStart.y);
}

function endDrag() {
  dragStart = null;
  dragging.value = false;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', endDrag);
}

/* ---------------- 键盘 ---------------- */
function onKeydown(e) {
  switch (e.key) {
    case 'Escape':
      e.preventDefault();
      close();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      prev();
      break;
    case 'ArrowRight':
      e.preventDefault();
      next();
      break;
    case '+':
    case '=':
      e.preventDefault();
      zoomBy(props.step);
      break;
    case '-':
      e.preventDefault();
      zoomBy(-props.step);
      break;
    case '0':
      e.preventDefault();
      reset();
      break;
    default:
      break;
  }
}

/* ---------------- 图片加载 ---------------- */
function onLoad(e) {
  natural.value = { w: e.target.naturalWidth, h: e.target.naturalHeight };
}

function onError() {
  natural.value = { w: 0, h: 0 };
}

function download() {
  const src = currentSrc.value;
  if (!src) return;
  const a = document.createElement('a');
  a.href = src;
  a.download = (currentItem.value && currentItem.value.alt) || 'image';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ---------------- 生命周期 ---------------- */
function bindBody() {
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKeydown);
}

function unbindBody() {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
  endDrag();
}

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      reset();
      bindBody();
      await nextTick();
      if (rootRef.value) rootRef.value.focus();
    } else {
      unbindBody();
    }
  },
  { immediate: true }
);

onBeforeUnmount(unbindBody);

defineExpose({ zoomBy, rotateBy, reset, prev, next, goTo, close });
</script>

<style scoped lang="scss">
.pui-image-viewer {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: rgba(12, 18, 28, 0.9);
  backdrop-filter: blur(6px);
  outline: none;
  user-select: none;

  /* ---------- 工具栏 ---------- */
  &__toolbar {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    color: rgba(255, 255, 255, 0.86);
    font-size: 13px;
    z-index: 2;
  }

  &__counter {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
  }

  &__actions {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__scale {
    min-width: 46px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }

  &__btn {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.86);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &--close:hover {
      background: rgba(236, 52, 55, 0.85);
      border-color: transparent;
    }
  }

  /* ---------- 图片区 ---------- */
  &__stage {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
  }

  &__img {
    max-width: 82vw;
    max-height: 74vh;
    object-fit: contain;
    will-change: transform;
    border-radius: 6px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }

  &__error {
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
  }

  /* ---------- 左右切换 ---------- */
  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.86);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover { background: rgba(255, 255, 255, 0.2); }

    &--prev { left: 22px; }
    &--next { right: 22px; }
  }

  /* ---------- 缩略图 ---------- */
  &__thumbs {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px 16px;
    overflow-x: auto;
  }

  &__thumb {
    flex: none;
    width: 52px;
    height: 52px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
    cursor: pointer;
    opacity: 0.55;
    transition: all 0.16s ease;

    img { width: 100%; height: 100%; object-fit: cover; display: block; }

    &:hover { opacity: 0.85; }

    &.is-active {
      opacity: 1;
      border-color: var(--pui-brand, #0e80eb);
    }
  }

  &__caption {
    flex: none;
    padding: 0 18px 16px;
    text-align: center;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.pui-image-viewer-fade-enter-active,
.pui-image-viewer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.pui-image-viewer-fade-enter-from,
.pui-image-viewer-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .pui-image-viewer__img {
    max-width: 94vw;
    max-height: 68vh;
  }
  .pui-image-viewer__nav {
    width: 34px;
    height: 34px;
    &--prev { left: 8px; }
    &--next { right: 8px; }
  }
}
</style>
