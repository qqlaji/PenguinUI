<template>
  <div
    ref="rootRef"
    class="pui-drag-move"
    :class="[{ 'is-dragging': dragging, 'is-disabled': disabled }]"
    :style="rootStyle"
    @pointerdown="onPointerDown"
  >
    <!-- 拖拽触发区域：默认整个组件，也可以只让指定元素触发 -->
    <div
      v-if="triggerSelector"
      ref="handleRef"
      class="pui-drag-move__handle"
    >
      <slot name="handle">
        <span class="pui-drag-move__default-handle" aria-hidden="true">
          <i class="iconfont t-icon-menu" />
        </span>
      </slot>
    </div>

    <div class="pui-drag-move__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default { name: 'tDragMove' };
</script>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 受控位置：距离容器左侧 / 顶部的像素值 */
  x: { type: Number, default: undefined },
  y: { type: Number, default: undefined },
  /** 初始位置（非受控时使用） */
  defaultX: { type: Number, default: 0 },
  defaultY: { type: Number, default: 0 },
  /**
   * 拖拽范围：
   *  - 'parent'（默认）：限制在最近的定位父元素内
   *  - 'viewport'：限制在可视区域内
   *  - CSS 选择器：限制在该元素内
   *  - 函数：返回 { left, top, right, bottom }
   */
  bounds: { type: [String, Function], default: 'parent' },
  /** 仅允许这些区域触发拖拽（默认整块可拖） */
  trigger: { type: String, default: '' },
  /** 网格吸附（px） */
  grid: { type: Number, default: 1 },
  /** 拖拽开始时是否阻止默认行为（文本选中） */
  preventSelect: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  /** 拖拽时是否提升层级 */
  raiseOnDrag: { type: Boolean, default: true },
  /** 自定义类名 */
  customClass: { type: String, default: '' }
});

const emit = defineEmits([
  'update:x',
  'update:y',
  'drag-start',
  'drag',
  'drag-end',
  'click'
]);

const rootRef = ref(null);
const handleRef = ref(null);
const dragging = ref(false);

const innerX = ref(props.x ?? props.defaultX);
const innerY = ref(props.y ?? props.defaultY);

/** 是否使用 handle 区域触发 */
const triggerSelector = computed(() => !!props.trigger);

const currentX = computed(() => (props.x !== undefined ? props.x : innerX.value));
const currentY = computed(() => (props.y !== undefined ? props.y : innerY.value));

const rootStyle = computed(() => ({
  transform: `translate3d(${currentX.value}px, ${currentY.value}px, 0)`,
  // 拖拽中提升层级，避免被其它元素盖住
  zIndex: dragging.value && props.raiseOnDrag ? '10' : undefined
}));

/* ---------------- 边界计算 ---------------- */
function resolveBounds() {
  const el = rootRef.value;
  if (!el) return null;

  const selfRect = el.getBoundingClientRect();

  const b = props.bounds;

  if (typeof b === 'function') {
    const r = b();
    return {
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      selfW: selfRect.width,
      selfH: selfRect.height
    };
  }

  if (b === 'viewport') {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      selfW: selfRect.width,
      selfH: selfRect.height
    };
  }

  // 'parent' 或 CSS 选择器
  let container = null;
  if (b === 'parent') {
    container = el.parentElement;
  } else if (typeof b === 'string' && b) {
    container = document.querySelector(b);
  }

  if (!container) {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      selfW: selfRect.width,
      selfH: selfRect.height
    };
  }

  const r = container.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    selfW: selfRect.width,
    selfH: selfRect.height
  };
}

function snap(v) {
  if (!props.grid || props.grid <= 1) return Math.round(v);
  return Math.round(v / props.grid) * props.grid;
}

/* ---------------- 拖拽逻辑 ---------------- */
let dragState = null;

function onPointerDown(e) {
  if (props.disabled) return;

  // 只点了左键
  if (e.button !== 0 && e.pointerType === 'mouse') return;

  // 配置了 trigger 时，只有点击触发区域才能拖动
  if (props.trigger) {
    const handle = handleRef.value;
    if (!handle || !handle.contains(e.target)) return;
  }

  // 允许内部可交互元素（输入框、按钮）阻止拖拽
  const interactive = e.target.closest(
    'input, textarea, select, button, a, [contenteditable="true"], [data-drag-ignore]'
  );
  if (interactive && rootRef.value && interactive !== rootRef.value) {
    // 未配置 trigger 时，交互元素上不启动拖拽
    if (!props.trigger) return;
  }

  const bounds = resolveBounds();
  if (!bounds) return;

  /*
   * 在拖拽开始「一次性」量出元素的静态位置（去掉 transform 后的位置）。
   * 之前是在 pointermove 里用 `rect.left - currentX.value` 反推，
   * 但 currentX 依赖父组件回传的 props，同一帧内还是旧值，
   * 导致 staticLeft 算偏、minX/maxX 反向 → x 被夹死（表现为只能纵向拖）。
   */
  const el = rootRef.value;
  const rect = el.getBoundingClientRect();

  dragState = {
    startX: e.clientX,
    startY: e.clientY,
    originX: currentX.value,
    originY: currentY.value,
    bounds,
    // 静态位置的绝对坐标（未受 transform 影响）
    staticLeft: rect.left - currentX.value,
    staticTop: rect.top - currentY.value,
    selfW: el.offsetWidth || rect.width,
    selfH: el.offsetHeight || rect.height
  };

  dragging.value = true;

  if (props.preventSelect) {
    e.preventDefault();
  }

  // 捕获指针
  const target = e.currentTarget;
  if (target && target.setPointerCapture) {
    try {
      target.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  emit('drag-start', { x: currentX.value, y: currentY.value });
}

function onPointerMove(e) {
  if (!dragState) return;

  const { startX, startY, originX, originY, bounds, staticLeft, staticTop, selfW, selfH } = dragState;
  let nextX = originX + (e.clientX - startX);
  let nextY = originY + (e.clientY - startY);

  nextX = snap(nextX);
  nextY = snap(nextY);

  /*
   * 约束：静态位置 + 位移 必须落在 [容器左, 容器右 - 自身宽] 内。
   * staticLeft / staticTop 在 pointerdown 时量好，全程复用，不受回传延迟影响。
   */
  const minX = bounds.left - staticLeft;
  const maxX = bounds.right - selfW - staticLeft;
  const minY = bounds.top - staticTop;
  const maxY = bounds.bottom - selfH - staticTop;

  // 容器比元素还小时 min > max，此时取 min，避免元素被推到容器外
  const loX = Math.min(minX, maxX);
  const hiX = Math.max(minX, maxX);
  const loY = Math.min(minY, maxY);
  const hiY = Math.max(minY, maxY);

  nextX = Math.min(Math.max(nextX, loX), hiX);
  nextY = Math.min(Math.max(nextY, loY), hiY);

  innerX.value = nextX;
  innerY.value = nextY;

  emit('update:x', nextX);
  emit('update:y', nextY);
  emit('drag', { x: nextX, y: nextY });
}

function onPointerUp(e) {
  if (!dragState) return;

  const moved = Math.abs(e.clientX - dragState.startX) > 2 || Math.abs(e.clientY - dragState.startY) > 2;

  dragState = null;
  dragging.value = false;

  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);

  emit('drag-end', { x: innerX.value, y: innerY.value, moved });

  // 没有实际移动时，视为一次点击
  if (!moved) emit('click', e);
}

/* ---------------- 受控同步 ---------------- */
watch(
  () => props.x,
  (v) => {
    if (v !== undefined) innerX.value = v;
  }
);
watch(
  () => props.y,
  (v) => {
    if (v !== undefined) innerY.value = v;
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
});

defineExpose({
  /** 回到初始位置 */
  reset: () => {
    innerX.value = props.defaultX;
    innerY.value = props.defaultY;
    emit('update:x', props.defaultX);
    emit('update:y', props.defaultY);
  },
  /** 移动到指定位置（含边界钳制） */
  moveTo: (x, y) => {
    innerX.value = x;
    innerY.value = y;
    emit('update:x', x);
    emit('update:y', y);
  },
  getPosition: () => ({ x: innerX.value, y: innerY.value })
});
</script>

<style scoped lang="scss">
.pui-drag-move {
  position: relative;
  box-sizing: border-box;
  /*
   * 默认按内容宽度收缩。
   * 之前是普通块级元素，宽度 auto 会撑满父容器 —— 此时元素横向已无余量，
   * 拖右立刻被 maxX 钳回，表现为"只能上下拖，横向拖不动"。
   */
  width: fit-content;
  max-width: 100%;
  /* 用 transform 而不是 top/left，避免触发重排 */
  will-change: transform;
  touch-action: none;
  user-select: none;

  &__content {
    width: 100%;
    height: 100%;
  }

  &__handle {
    cursor: grab;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
  }

  &__default-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    color: var(--pui-text-muted, #8b96a6);
    background: var(--pui-bg-soft, #f0f3f8);

    i { font-size: 12px; }
  }

  &.is-dragging {
    cursor: grabbing;

    .pui-drag-move__handle { cursor: grabbing; }

    // 拖拽中禁用内容区的指针事件，避免误触内部按钮
    .pui-drag-move__content { pointer-events: none; }
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
