<template>
  <div
    ref="rootRef"
    class="pui-resizable"
    :class="[
      `pui-resizable--${handlesMode}`,
      {
        'is-resizing': resizing,
        'is-disabled': disabled,
        'is-active': active
      }
    ]"
    :style="rootStyle"
  >
    <div class="pui-resizable__content">
      <slot />
    </div>

    <!-- 8 个方向的拖拽手柄 -->
    <template v-if="!disabled">
      <span
        v-for="dir in activeHandles"
        :key="dir"
        :class="['pui-resizable__handle', `pui-resizable__handle--${dir}`]"
        :data-dir="dir"
        @pointerdown.prevent="onPointerDown($event, dir)"
        @dblclick="$emit('handle-dblclick', dir)"
      >
        <slot name="handle" :dir="dir" />
      </span>
    </template>
  </div>
</template>

<script>
export default { name: 'tResizable' };
</script>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 宽度：受控，支持数字（px）或 '50%' */
  width: { type: [Number, String], default: undefined },
  /** 高度：受控，支持数字（px）或 '50%' */
  height: { type: [Number, String], default: undefined },
  /** 最小宽高 */
  minWidth: { type: Number, default: 100 },
  minHeight: { type: Number, default: 60 },
  /** 最大宽高 */
  maxWidth: { type: Number, default: Infinity },
  maxHeight: { type: Number, default: Infinity },
  /** 显示哪些手柄：'all' | 'horizontal' | 'vertical' | 'corner' | 数组 ['right','bottom'] */
  handles: { type: [String, Array], default: 'all' },
  /** 拖拽步长（px），0 表示连续拖动 */
  grid: { type: Number, default: 1 },
  /** 是否锁定宽高比 */
  aspectRatio: { type: Boolean, default: false },
  /** 比例值，默认按初始宽高计算 */
  ratio: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  /** 拖拽时的最小可视尺寸回调 */
  customClass: { type: String, default: '' }
});

const emit = defineEmits([
  'update:width',
  'update:height',
  'resize',
  'resize-start',
  'resize-end',
  'handle-dblclick'
]);

const rootRef = ref(null);
const resizing = ref(false);
const active = ref(false);

/** 内部尺寸（未受控时使用） */
const innerW = ref(props.width ?? 320);
const innerH = ref(props.height ?? 200);

/** 实际生效的宽度：受控则以 props 为准 */
const currentW = computed(() => (props.width !== undefined ? props.width : innerW.value));
const currentH = computed(() => (props.height !== undefined ? props.height : innerH.value));

const toCss = (v) => {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const rootStyle = computed(() => ({
  width: toCss(currentW.value),
  height: toCss(currentH.value)
}));

/* ---------------- 手柄集合 ---------------- */
const ALL_DIRS = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

const activeHandles = computed(() => {
  if (Array.isArray(props.handles)) return props.handles.filter((d) => ALL_DIRS.includes(d));

  switch (props.handles) {
    case 'horizontal':
      return ['left', 'right'];
    case 'vertical':
      return ['top', 'bottom'];
    case 'corner':
      return ['bottom-right'];
    case 'all':
    default:
      return ALL_DIRS;
  }
});

/** 至少有两边时才显示对应的光标方向 */
const handlesMode = computed(() => {
  if (Array.isArray(props.handles)) return 'custom';
  return ['all', 'horizontal', 'vertical', 'corner'].includes(props.handles) ? props.handles : 'all';
});

/* ---------------- 拖拽逻辑 ---------------- */
let startInfo = null;
let lastMoveAt = 0;
let pendingPoint = null;

/** 把内联尺寸换算成像素数值，用于计算 */
function measure() {
  const el = rootRef.value;
  if (!el) return { w: 0, h: 0 };
  const rect = el.getBoundingClientRect();
  return { w: rect.width, h: rect.height };
}

function snap(v) {
  if (!props.grid || props.grid <= 1) return Math.round(v);
  return Math.round(v / props.grid) * props.grid;
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function onPointerDown(e, dir) {
  if (props.disabled) return;

  const { w, h } = measure();
  startInfo = {
    x: e.clientX,
    y: e.clientY,
    w,
    h,
    dir,
    // 父容器可用空间，用于把尺寸钳制在合理范围
    parentW: rootRef.value?.parentElement?.clientWidth ?? Infinity,
    parentH: rootRef.value?.parentElement?.clientHeight ?? Infinity
  };

  resizing.value = true;
  active.value = true;
  lastMoveAt = 0;
  pendingPoint = null;

  // 捕获指针，保证鼠标移出元素后依然能收到事件
  const target = e.currentTarget;
  if (target.setPointerCapture) {
    try {
      target.setPointerCapture(e.pointerId);
    } catch (err) {
      /* 某些环境不支持，忽略 */
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  emit('resize-start', { width: w, height: h, dir });
}

function onPointerMove(e) {
  if (!startInfo) return;

  /*
   * 节流策略：用时间戳而不是 requestAnimationFrame。
   * rAF 在后台标签页 / 无头浏览器里可能被暂停，导致拖拽完全无响应；
   * 时间戳节流在任何环境都稳定，16ms 约等于 60fps 的表现。
   */
  const now = performance.now();
  if (now - lastMoveAt < 16) {
    // 记录最新坐标，保证节流窗口结束后能补上最后一次
    pendingPoint = { x: e.clientX, y: e.clientY };
    return;
  }
  lastMoveAt = now;
  pendingPoint = null;
  apply(e.clientX, e.clientY);
}

/** 同步应用一次位移（不经过节流） */
function applyNow(clientX, clientY) {
  apply(clientX, clientY);
}

function apply(clientX, clientY) {
  const { x, y, w, h, dir, parentW, parentH } = startInfo;
  const dx = clientX - x;
  const dy = clientY - y;

  let nextW = w;
  let nextH = h;

  const hasLeft = dir.includes('left');
  const hasRight = dir.includes('right');
  const hasTop = dir.includes('top');
  const hasBottom = dir.includes('bottom');

  if (hasLeft) nextW = w - dx;
  if (hasRight) nextW = w + dx;
  if (hasTop) nextH = h - dy;
  if (hasBottom) nextH = h + dy;

  /*
   * 最大尺寸 = min(显式 maxWidth, 父容器可用宽度)。
   * 但要保证 maxW 不小于 minWidth，否则 clamp 会把尺寸压到非法区间；
   * 同时用 Math.max(..., w) 兜底，避免父容器较窄时把"当前尺寸"也判为越界导致无法拖动。
   */
  const maxW = Math.max(props.minWidth, Math.min(props.maxWidth, parentW > 0 ? parentW : Infinity));
  const maxH = Math.max(props.minHeight, Math.min(props.maxHeight, parentH > 0 ? parentH : Infinity));

  nextW = clamp(snap(nextW), props.minWidth, maxW);
  nextH = clamp(snap(nextH), props.minHeight, maxH);

  // 锁定宽高比：以变化幅度较大的一边为准
  if (props.aspectRatio) {
    const ratio = props.ratio > 0 ? props.ratio : w / h;
    if (Math.abs(nextW - w) >= Math.abs(nextH - h)) {
      nextH = clamp(snap(nextW / ratio), props.minHeight, maxH);
      nextW = clamp(snap(nextH * ratio), props.minWidth, maxW);
    } else {
      nextW = clamp(snap(nextH * ratio), props.minWidth, maxW);
      nextH = clamp(snap(nextW / ratio), props.minHeight, maxH);
    }
  } else {
    /*
     * 只拖一个轴时，另一维度保持原值。
     * 注意：不能写成 `if (hasRight) nextH = h` —— 像 bottom-right 这种
     * 同时含 right 和 bottom 的角落手柄会让两条分支互相覆盖，
     * 结果两个维度都被重置成原值、怎么拖都不动。
     */
    const onlyHorizontal = (hasLeft || hasRight) && !hasTop && !hasBottom;
    const onlyVertical = (hasTop || hasBottom) && !hasLeft && !hasRight;

    if (onlyHorizontal) nextH = h;
    if (onlyVertical) nextW = w;
  }

  innerW.value = nextW;
  innerH.value = nextH;

  emit('update:width', nextW);
  emit('update:height', nextH);
  emit('resize', { width: nextW, height: nextH, dir });
}

function onPointerUp() {
  if (!startInfo) return;

  // 补上节流窗口内被丢弃的最后一次坐标，避免末段位移丢失
  if (pendingPoint) {
    applyNow(pendingPoint.x, pendingPoint.y);
    pendingPoint = null;
  }

  const { dir, w, h } = startInfo;
  const width = Math.round(innerW.value);
  const height = Math.round(innerH.value);

  startInfo = null;
  resizing.value = false;
  active.value = false;

  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);

  emit('resize-end', { width, height, dir, changed: width !== Math.round(w) || height !== Math.round(h) });
}

/* ---------------- 受控同步 ---------------- */
watch(
  () => props.width,
  (v) => {
    if (v !== undefined) innerW.value = v;
  }
);
watch(
  () => props.height,
  (v) => {
    if (v !== undefined) innerH.value = v;
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
});

defineExpose({
  /** 手动设置尺寸 */
  setSize: (w, h) => {
    if (w !== undefined) {
      innerW.value = w;
      emit('update:width', w);
    }
    if (h !== undefined) {
      innerH.value = h;
      emit('update:height', h);
    }
  },
  getSize: () => ({ width: Math.round(innerW.value), height: Math.round(innerH.value) })
});
</script>

<style scoped lang="scss">
.pui-resizable {
  position: relative;
  box-sizing: border-box;
  max-width: 100%;

  &__content {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }

  /* ---------- 手柄 ---------- */
  &__handle {
    position: absolute;
    z-index: 2;
    touch-action: none;
    user-select: none;

    /* 四边：内置一条不可见的抓取区 */
    &--top,
    &--bottom {
      left: 8px;
      right: 8px;
      height: 8px;
      cursor: ns-resize;
    }
    &--top { top: -4px; }
    &--bottom { bottom: -4px; }

    &--left,
    &--right {
      top: 8px;
      bottom: 8px;
      width: 8px;
      cursor: ew-resize;
    }
    &--left { left: -4px; }
    &--right { right: -4px; }

    /* 四角：视觉上可感知的肘形标记 */
    &--top-left,
    &--top-right,
    &--bottom-left,
    &--bottom-right {
      width: 12px;
      height: 12px;

      &::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        border: 2px solid var(--pui-brand, #0e80eb);
        opacity: 0;
        transition: opacity 0.15s ease;
      }
    }

    &--top-left { top: -3px; left: -3px; cursor: nwse-resize; &::after { left: 0; top: 0; border-right: 0; border-bottom: 0; } }
    &--top-right { top: -3px; right: -3px; cursor: nesw-resize; &::after { right: 0; top: 0; border-left: 0; border-bottom: 0; } }
    &--bottom-left { bottom: -3px; left: -3px; cursor: nesw-resize; &::after { left: 0; bottom: 0; border-right: 0; border-top: 0; } }
    &--bottom-right { bottom: -3px; right: -3px; cursor: nwse-resize; &::after { right: 0; bottom: 0; border-left: 0; border-top: 0; } }
  }

  /* 悬停或拖拽时显示角落标记 */
  &:hover &__handle::after,
  &.is-resizing &__handle::after {
    opacity: 1;
  }

  &.is-resizing {
    // 拖拽时禁用内部文本选中，避免拖出蓝色选区
    user-select: none;

    .pui-resizable__content {
      pointer-events: none;
    }
  }

  &.is-disabled {
    .pui-resizable__handle { display: none; }
  }
}

/* 只显示水平手柄时，隐藏上下两边的光标提示 */
.pui-resizable--horizontal .pui-resizable__handle--top,
.pui-resizable--horizontal .pui-resizable__handle--bottom {
  display: none;
}
.pui-resizable--vertical .pui-resizable__handle--left,
.pui-resizable--vertical .pui-resizable__handle--right {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .pui-resizable__handle::after { transition: none; }
}
</style>
