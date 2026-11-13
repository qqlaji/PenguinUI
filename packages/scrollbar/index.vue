<template>
  <!-- 外层只负责定位与裁剪，不参与滚动；滚动只发生在内部 viewport，滑块因而固定不动 -->
  <div
    :class="['pui-scrollbar', wrapClass, { 'is-hover': hovered || always, 'is-dragging': dragging }]"
    :style="mergedWrapStyle"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      ref="wrapRef"
      class="pui-scrollbar__viewport"
      :style="viewportStyle"
      @scroll.passive="onScroll"
    >
      <div ref="viewRef" :class="['pui-scrollbar__view', viewClass]" :style="viewStyle">
        <slot></slot>
      </div>
    </div>

    <template v-if="!native">
      <div
        v-show="yVisible"
        class="pui-scrollbar__bar is-vertical"
        :class="{ 'is-always': always }"
        :style="{ width: `${size}px` }"
        @mousedown.self="jump('y', $event)"
      >
        <div
          class="pui-scrollbar__thumb"
          :style="{ height: `${thumbH}px`, transform: `translateY(${thumbTop}px)` }"
          @mousedown="startDrag('y', $event)"
        ></div>
      </div>

      <div
        v-show="xVisible"
        class="pui-scrollbar__bar is-horizontal"
        :class="{ 'is-always': always }"
        :style="{ height: `${size}px` }"
        @mousedown.self="jump('x', $event)"
      >
        <div
          class="pui-scrollbar__thumb"
          :style="{ width: `${thumbW}px`, transform: `translateX(${thumbLeft}px)` }"
          @mousedown="startDrag('x', $event)"
        ></div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'tScrollbar'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  /** 固定高度，支持数字（px）与任意 CSS 长度 */
  height: { type: [Number, String], default: '' },
  /** 最大高度 */
  maxHeight: { type: [Number, String], default: '' },
  /** 使用浏览器原生滚动条 */
  native: { type: Boolean, default: false },
  /** 滚动条粗细（px） */
  size: { type: Number, default: 6 },
  /** 常显滚动条 */
  always: { type: Boolean, default: false },
  /** 滑块最小长度（px） */
  minSize: { type: Number, default: 24 },
  wrapClass: { type: String, default: '' },
  wrapStyle: { type: [String, Object], default: () => ({}) },
  viewClass: { type: String, default: '' },
  viewStyle: { type: [String, Object], default: () => ({}) },
  /** 关闭尺寸监听 */
  noresize: { type: Boolean, default: false }
});

const emit = defineEmits(['scroll']);

const wrapRef = ref(null);
const viewRef = ref(null);
const hovered = ref(false);
const dragging = ref(false);

const bar = reactive({
  yVisible: false,
  xVisible: false,
  thumbH: 0,
  thumbTop: 0,
  thumbW: 0,
  thumbLeft: 0
});

const yVisible = computed(() => bar.yVisible);
const xVisible = computed(() => bar.xVisible);
const thumbH = computed(() => bar.thumbH);
const thumbTop = computed(() => bar.thumbTop);
const thumbW = computed(() => bar.thumbW);
const thumbLeft = computed(() => bar.thumbLeft);

const toPx = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

// 外层容器的尺寸交给它自己撑开（height / maxHeight 由使用者传入）；
// 内层 viewport 铺满外层，滚动只发生在这里
const mergedWrapStyle = computed(() => {
  const style = { ...(typeof props.wrapStyle === 'object' ? props.wrapStyle : {}) };
  if (props.height !== '') style.height = toPx(props.height);
  if (props.maxHeight !== '') style.maxHeight = toPx(props.maxHeight);
  return style;
});

const viewportStyle = computed(() => ({
  overflowY: 'auto',
  overflowX: 'auto'
}));

/* ---------------- 尺寸与位置计算 ---------------- */
// 轨道上下各留 2px 内缩，与 .is-vertical 的 top/bottom: 2px 对应
const TRACK_INSET = 4;

function update() {
  const el = wrapRef.value;
  if (!el) return;

  const {
    clientHeight, scrollHeight, scrollTop,
    clientWidth, scrollWidth, scrollLeft
  } = el;

  bar.yVisible = scrollHeight - clientHeight > 1;
  bar.xVisible = scrollWidth - clientWidth > 1;

  const trackH = Math.max(0, clientHeight - TRACK_INSET);
  const trackW = Math.max(0, clientWidth - TRACK_INSET);

  const h = bar.yVisible ? Math.max(props.minSize, Math.round(trackH * (clientHeight / scrollHeight))) : 0;
  const w = bar.xVisible ? Math.max(props.minSize, Math.round(trackW * (clientWidth / scrollWidth))) : 0;

  bar.thumbH = Math.min(h, trackH);
  bar.thumbW = Math.min(w, trackW);

  const maxTop = trackH - bar.thumbH;
  const maxScrollY = scrollHeight - clientHeight;
  bar.thumbTop = maxScrollY > 0 ? (scrollTop / maxScrollY) * maxTop : 0;

  const maxLeft = trackW - bar.thumbW;
  const maxScrollX = scrollWidth - clientWidth;
  bar.thumbLeft = maxScrollX > 0 ? (scrollLeft / maxScrollX) * maxLeft : 0;
}

let rafId = null;
function onScroll(e) {
  emit('scroll', e);
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    update();
  });
}

/* ---------------- 拖拽 ---------------- */
let dragState = null;

function startDrag(axis, e) {
  e.preventDefault();
  e.stopPropagation();
  const el = wrapRef.value;
  if (!el) return;

  dragState = {
    axis,
    start: axis === 'y' ? e.clientY : e.clientX,
    scroll: axis === 'y' ? el.scrollTop : el.scrollLeft,
    track: axis === 'y' ? el.clientHeight - TRACK_INSET : el.clientWidth - TRACK_INSET,
    thumb: axis === 'y' ? bar.thumbH : bar.thumbW
  };
  dragging.value = true;
  document.body.style.userSelect = 'none';
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', endDrag);
}

function onDragMove(e) {
  if (!dragState) return;
  const el = wrapRef.value;
  if (!el) return;

  const { axis, start, scroll, track, thumb } = dragState;
  const delta = (axis === 'y' ? e.clientY : e.clientX) - start;
  const maxScroll = axis === 'y' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
  const maxTop = track - thumb;
  const next = maxTop > 0 ? scroll + (delta / maxTop) * maxScroll : 0;

  if (axis === 'y') el.scrollTop = next;
  else el.scrollLeft = next;
}

function endDrag() {
  dragState = null;
  dragging.value = false;
  document.body.style.userSelect = '';
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', endDrag);
}

/* ---------------- 点击轨道跳转 ---------------- */
function jump(axis, e) {
  const el = wrapRef.value;
  if (!el) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const pos = axis === 'y' ? e.clientY - rect.top : e.clientX - rect.left;
  const track = axis === 'y' ? rect.height : rect.width;
  const thumb = axis === 'y' ? bar.thumbH : bar.thumbW;
  const maxTop = track - thumb;
  if (maxTop <= 0) return;

  const ratio = Math.min(1, Math.max(0, (pos - thumb / 2) / maxTop));
  if (axis === 'y') el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  else el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
}

/* ---------------- 监听 ---------------- */
let ro = null;
let mo = null;

function bindObservers() {
  if (props.noresize || typeof ResizeObserver === 'undefined') return;
  ro = new ResizeObserver(() => update());
  if (wrapRef.value) ro.observe(wrapRef.value);
  if (viewRef.value) ro.observe(viewRef.value);
  if (viewRef.value && typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver(() => update());
    mo.observe(viewRef.value, { childList: true, subtree: true, characterData: true });
  }
}

onMounted(async () => {
  await nextTick();
  update();
  bindObservers();
  window.addEventListener('resize', update);
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  if (mo) mo.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener('resize', update);
  endDrag();
});

watch(() => [props.height, props.maxHeight, props.size], async () => {
  await nextTick();
  update();
});

/* ---------------- 对外方法 ---------------- */
function scrollTo(options, y) {
  const el = wrapRef.value;
  if (!el) return;
  if (typeof options === 'object' && options !== null) {
    el.scrollTo(options);
  } else {
    el.scrollTo(options || 0, y || 0);
  }
  update();
}

function setScrollTop(value) {
  if (wrapRef.value) wrapRef.value.scrollTop = value;
  update();
}

function setScrollLeft(value) {
  if (wrapRef.value) wrapRef.value.scrollLeft = value;
  update();
}

defineExpose({ update, scrollTo, setScrollTop, setScrollLeft, wrapRef, viewRef });
</script>

<style scoped lang="scss">
.pui-scrollbar {
  position: relative;
  // 外层不滚动，只做定位参照；滑块是它的直接子元素，因此不会随内容滚走
  overflow: hidden;

  &__viewport {
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  &__view {
    box-sizing: border-box;
  }

  &__bar {
    position: absolute;
    z-index: 3;
    border-radius: 999px;
    opacity: 0;
    transition: opacity 0.2s ease;
    background: transparent;

    &.is-vertical {
      top: 2px;
      right: 2px;
      bottom: 2px;
    }
    &.is-horizontal {
      left: 2px;
      right: 2px;
      bottom: 2px;
    }
    &.is-always {
      opacity: 1;
    }
  }

  &.is-hover &__bar {
    opacity: 1;
  }

  &__thumb {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--pui-scrollbar-thumb, rgba(112, 129, 150, 0.42));
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--pui-scrollbar-thumb-hover, rgba(78, 96, 118, 0.62));
    }
  }

  &.is-dragging {
    user-select: none;
    .pui-scrollbar__thumb { transition: none; }
  }
}
</style>
