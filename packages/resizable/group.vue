<template>
  <div
    ref="groupRef"
    class="pui-resizable-group"
    :class="[`pui-resizable-group--${direction}`, { 'is-resizing': dragging }]"
    :style="groupStyle"
  >
    <template v-for="(panel, i) in panels" :key="panel.id">
      <div
        class="pui-resizable-group__panel"
        :style="panelStyle(panel)"
        :data-panel="panel.id"
      >
        <slot :name="`panel-${i}`" :panel="panel" :index="i">
          <slot :name="panel.id" :panel="panel" :index="i">
            <!-- 双栏便捷插槽：#start / #end（等价于 #panel-0 / #panel-1） -->
            <slot
              v-if="panels.length === 2 && i === 0"
              name="start"
              :panel="panel"
              :index="i"
            />
            <slot
              v-else-if="panels.length === 2 && i === 1"
              name="end"
              :panel="panel"
              :index="i"
            />
            <template v-else>{{ panel.id }}</template>
          </slot>
        </slot>
      </div>

      <!-- 相邻面板之间的分隔条 -->
      <div
        v-if="i < panels.length - 1"
        class="pui-resizable-group__divider"
        :class="{ 'is-dragging': draggingIndex === i, 'is-disabled': disabled }"
        role="separator"
        :aria-orientation="isHorizontal ? 'vertical' : 'horizontal'"
        :aria-valuenow="Math.round(percentOf(i))"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :tabindex="disabled ? -1 : 0"
        @pointerdown.prevent="onDividerDown($event, i)"
        @keydown="onDividerKeydown($event, i)"
      >
        <span class="pui-resizable-group__grip" aria-hidden="true"></span>
      </div>
    </template>
  </div>
</template>

<script>
export default { name: 'tResizableGroup' };
</script>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';

/**
 * 组合伸缩：一行（或一列）里多个面板，拖动分隔条时，
 * 分隔条两侧的面板尺寸此消彼长，总尺寸保持不变。
 *
 * 用法：
 *   <t-resizable-group direction="horizontal" :default-sizes="[1, 2, 1]">
 *     <template #panel-0>左侧</template>
 *     <template #panel-1>中间</template>
 *     <template #panel-2>右侧</template>
 *   </t-resizable-group>
 */
const props = defineProps({
  /** 排列方向 */
  direction: { type: String, default: 'horizontal' }, // horizontal | vertical
  /** 面板占比，个数决定面板数量 */
  defaultSizes: { type: Array, default: () => [1, 1] },
  /** 每块最小像素尺寸 */
  minSize: { type: Number, default: 80 },
  /** 单个面板最大像素尺寸 */
  maxSize: { type: Number, default: Infinity },
  /** 整体固定宽度（水平）或高度（垂直），不传则 100% */
  size: { type: [Number, String], default: undefined },
  /** 分隔条粗细（px） */
  dividerSize: { type: Number, default: 8 },
  /** 禁用拖拽 */
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:defaultSizes', 'resize', 'resize-end']);

const groupRef = ref(null);
const dragging = ref(false);
const draggingIndex = ref(-1);

/** 当前占比数组，长度即面板数 */
const panels = computed(() =>
  props.defaultSizes.map((size, i) => ({ id: `p${i}`, size, index: i }))
);

const isHorizontal = computed(() => props.direction !== 'vertical');

const toCss = (v) => {
  if (v === undefined || v === null || v === '') return '100%';
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const groupStyle = computed(() =>
  isHorizontal.value ? { height: '100%', width: toCss(props.size) } : { width: '100%', height: toCss(props.size) }
);

/** 面板用 flex 比例 */
/** 第 index 块面板占总宽度的百分比，用于 aria-valuenow 与外部展示 */
const percentOf = (index) => {
  const sizes = panels.value.map((p) => p.size);
  const total = sizes.reduce((s, v) => s + v, 0) || 1;
  return ((sizes[index] || 0) / total) * 100;
};

const panelStyle = (panel) => {
  const style = {
    flexGrow: String(panel.size),
    flexBasis: '0%',
    flexShrink: '0'
  };
  if (isHorizontal.value) {
    style.minWidth = `${props.minSize}px`;
    if (props.maxSize !== Infinity) style.maxWidth = `${props.maxSize}px`;
  } else {
    style.minHeight = `${props.minSize}px`;
    if (props.maxSize !== Infinity) style.maxHeight = `${props.maxSize}px`;
  }
  return style;
};

/* ---------------- 拖拽分隔条 ---------------- */
let dragState = null;

function onDividerDown(e, index) {
  if (props.disabled) return;
  const el = groupRef.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const totalPx = isHorizontal.value ? rect.width : rect.height;
  // 扣掉所有分隔条占据的空间，剩下的才是可用于面板的长度
  const dividerTotal = props.dividerSize * Math.max(0, panels.value.length - 1);
  const usable = totalPx - dividerTotal;
  if (usable <= 0) return;

  /*
   * 把「拖拽开始时」的所有基准值一次性固化：
   *  - totalRatio: 全部面板占比之和
   *  - leftRatio / rightRatio: 被拖的两块各自占比
   *  - leftPx: 左侧面板的实际像素宽
   * 之后每帧都用这组常量重算，不要读 panels.value —— v-model 回传可能滞后，
   * 连续 move 时基准会漂移，表现为"越拖越紧、很快就拖不动"。
   */
  const sizes = panels.value.map((p) => p.size);
  const totalRatio = sizes.reduce((s, v) => s + v, 0);
  const leftRatio = sizes[index] || 0;
  const rightRatio = sizes[index + 1] || 0;

  dragState = {
    start: isHorizontal.value ? e.clientX : e.clientY,
    index,
    usable,
    totalRatio,
    pairRatio: leftRatio + rightRatio,
    leftPx: (leftRatio / totalRatio) * usable
  };

  dragging.value = true;
  draggingIndex.value = index;

  if (e.currentTarget.setPointerCapture) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  }

  window.addEventListener('pointermove', onDividerMove);
  window.addEventListener('pointerup', onDividerUp);
  window.addEventListener('pointercancel', onDividerUp);
}

function onDividerMove(e) {
  if (!dragState) return;
  const { usable, index, totalRatio, pairRatio, leftPx } = dragState;
  const cur = isHorizontal.value ? e.clientX : e.clientY;
  const delta = cur - dragState.start;

  // 1px 对应多少占比（基于拖拽开始时的固定基准）
  const ratioPerPx = totalRatio / usable;

  // 两侧面板合计占用的像素宽度
  const pairPx = (pairRatio / totalRatio) * usable;

  const minPx = props.minSize;
  // 右侧至少要留 minSize，所以左侧最多到 pairPx - minSize
  const hardMax = pairPx - props.minSize;
  const maxPx = Math.min(props.maxSize, hardMax);

  let newLeftPx = leftPx + delta;
  // 上下界顺序兜底：pairPx 太窄时 hardMax < minPx，此时锁在 minPx
  const lo = Math.min(minPx, Math.max(hardMax, 0));
  const hi = Math.max(lo, maxPx);
  newLeftPx = Math.min(Math.max(newLeftPx, lo), hi);

  const nextLeftRatio = newLeftPx * ratioPerPx;
  const nextRightRatio = pairRatio - nextLeftRatio;

  if (nextLeftRatio <= 0 || nextRightRatio <= 0) return;

  const next = panels.value.map((p) => p.size);
  next[index] = nextLeftRatio;
  next[index + 1] = nextRightRatio;

  emit('update:defaultSizes', next);
  emit('resize', { sizes: next, index });
}

/**
 * 键盘调整：方向键每次移动 step（px），Home/End 推到两端。
 * 无障碍与精细调整都需要，纯鼠标拖拽无法做到 1px 精度。
 */
function onDividerKeydown(e, index) {
  if (props.disabled) return;

  const horizontal = isHorizontal.value;
  const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
  const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';

  let deltaPx = 0;
  const step = e.shiftKey ? 32 : 8;

  if (e.key === prevKey) deltaPx = -step;
  else if (e.key === nextKey) deltaPx = step;
  else if (e.key === 'Home') deltaPx = -1e6;
  else if (e.key === 'End') deltaPx = 1e6;
  else return;

  e.preventDefault();

  const el = groupRef.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const totalPx = horizontal ? rect.width : rect.height;
  const dividerTotal = props.dividerSize * Math.max(0, panels.value.length - 1);
  const usable = totalPx - dividerTotal;
  if (usable <= 0) return;

  const sizes = panels.value.map((p) => p.size);
  const totalRatio = sizes.reduce((s, v) => s + v, 0);
  const leftRatio = sizes[index] || 0;
  const rightRatio = sizes[index + 1] || 0;
  const pairRatio = leftRatio + rightRatio;
  const pairPx = (pairRatio / totalRatio) * usable;

  let newLeftPx = (leftRatio / totalRatio) * usable + deltaPx;
  const minPx = props.minSize;
  const hardMax = pairPx - props.minSize;
  const lo = Math.min(minPx, Math.max(hardMax, 0));
  const hi = Math.max(lo, Math.min(props.maxSize, hardMax));
  newLeftPx = Math.min(Math.max(newLeftPx, lo), hi);

  const ratioPerPx = totalRatio / usable;
  const nextLeftRatio = newLeftPx * ratioPerPx;
  const nextRightRatio = pairRatio - nextLeftRatio;
  if (nextLeftRatio <= 0 || nextRightRatio <= 0) return;

  const next = sizes.slice();
  next[index] = nextLeftRatio;
  next[index + 1] = nextRightRatio;

  emit('update:defaultSizes', next);
  emit('resize', { sizes: next, index });
  emit('resize-end', { sizes: next, index });
}

function onDividerUp() {
  if (!dragState) return;
  const index = dragState.index;
  dragState = null;
  dragging.value = false;
  draggingIndex.value = -1;

  window.removeEventListener('pointermove', onDividerMove);
  window.removeEventListener('pointerup', onDividerUp);
  window.removeEventListener('pointercancel', onDividerUp);

  emit('resize-end', { sizes: panels.value.map((p) => p.size), index });
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onDividerMove);
  window.removeEventListener('pointerup', onDividerUp);
  window.removeEventListener('pointercancel', onDividerUp);
});
</script>

<style scoped lang="scss">
.pui-resizable-group {
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;

  &--vertical {
    flex-direction: column;
  }

  &__panel {
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    min-width: 0;
  }

  &__divider {
    flex: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
    user-select: none;
    background: var(--pui-bg-soft, #f0f3f8);
    transition: background-color 0.15s ease;
    z-index: 1;

    &:hover,
    &.is-dragging {
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.16));
    }
  }

  /* 水平排列时分隔条是竖条 */
  &--horizontal &__divider {
    width: 8px;
    cursor: ew-resize;

    .pui-resizable-group__grip {
      width: 2px;
      height: 18px;
    }
  }

  &--vertical &__divider {
    height: 8px;
    cursor: ns-resize;

    .pui-resizable-group__grip {
      width: 18px;
      height: 2px;
    }
  }

  &__grip {
    border-radius: 2px;
    background: var(--pui-border-strong, #c9d3e0);
    pointer-events: none;
    transition: background-color 0.15s ease;
  }

  &__divider:hover &__grip,
  &__divider.is-dragging &__grip {
    background: var(--pui-brand, #0e80eb);
  }

  &.is-resizing {
    user-select: none;

    .pui-resizable-group__panel {
      pointer-events: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-resizable-group__divider,
  .pui-resizable-group__grip {
    transition: none;
  }
}
</style>
