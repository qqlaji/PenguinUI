<template>
  <div
    :class="['pui-splitter', `pui-splitter--${direction}`, customClass, { 'is-dragging': dragging }]"
    :style="rootStyle"
    ref="rootRef"
  >
    <div class="pui-splitter__pane" :style="startStyle">
      <slot name="start">
        <slot name="left" />
      </slot>
    </div>

    <div
      class="pui-splitter__bar"
      :class="{ 'is-disabled': disabled }"
      role="separator"
      :aria-orientation="direction === 'horizontal' ? 'vertical' : 'horizontal'"
      :aria-valuenow="Math.round(percent)"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="onDown"
      @keydown="onKeydown"
    >
      <span class="pui-splitter__bar-handle"></span>
    </div>

    <div class="pui-splitter__pane" :style="endStyle">
      <slot name="end">
        <slot name="right" />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tSplitter'
};
</script>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 起始面板占比（0-100） */
  modelValue: { type: Number, default: 50 },
  /** 分割方向：horizontal 左右分栏，vertical 上下分栏 */
  direction: { type: String, default: 'horizontal' },
  /** 起始面板最小占比 */
  min: { type: Number, default: 10 },
  /** 起始面板最大占比 */
  max: { type: Number, default: 90 },
  /** 分割条粗细（px） */
  barSize: { type: Number, default: 8 },
  disabled: { type: Boolean, default: false },
  /** 容器高度，vertical 模式常用 */
  height: { type: [Number, String], default: '' },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'resize-start', 'resize', 'resize-end']);

const rootRef = ref(null);
const dragging = ref(false);
const percent = ref(clamp(props.modelValue));

function clamp(v) {
  return Math.min(props.max, Math.max(props.min, Number(v) || 0));
}

watch(() => props.modelValue, (v) => {
  if (!dragging.value) percent.value = clamp(v);
});
watch(() => [props.min, props.max], () => {
  percent.value = clamp(percent.value);
});

const toSize = (v) => (typeof v === 'number' || /^\d+(\.\d+)?$/.test(String(v)) ? `${parseFloat(v)}px` : v);

const rootStyle = computed(() => ({
  height: props.height ? toSize(props.height) : undefined,
  '--pui-splitter-bar': `${props.barSize}px`
}));

const startStyle = computed(() =>
  props.direction === 'horizontal'
    ? { width: `calc(${percent.value}% - ${props.barSize / 2}px)` }
    : { height: `calc(${percent.value}% - ${props.barSize / 2}px)` }
);
const endStyle = computed(() => ({ flex: 1, minWidth: 0, minHeight: 0 }));

const onMove = (e) => {
  const el = rootRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const ratio =
    props.direction === 'horizontal'
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
  const next = clamp(ratio * 100);
  percent.value = next;
  emit('update:modelValue', Number(next.toFixed(2)));
  emit('resize', Number(next.toFixed(2)));
};

const onUp = () => {
  if (!dragging.value) return;
  dragging.value = false;
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  document.body.style.userSelect = '';
  emit('resize-end', percent.value);
};

const onDown = (e) => {
  if (props.disabled) return;
  e.preventDefault();
  dragging.value = true;
  document.body.style.userSelect = 'none';
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  emit('resize-start');
};

const onKeydown = (e) => {
  if (props.disabled) return;
  const step = e.shiftKey ? 10 : 2;
  const isH = props.direction === 'horizontal';
  if ((isH && e.key === 'ArrowLeft') || (!isH && e.key === 'ArrowUp')) {
    e.preventDefault();
    percent.value = clamp(percent.value - step);
  } else if ((isH && e.key === 'ArrowRight') || (!isH && e.key === 'ArrowDown')) {
    e.preventDefault();
    percent.value = clamp(percent.value + step);
  } else if (e.key === 'Home') {
    e.preventDefault();
    percent.value = props.min;
  } else if (e.key === 'End') {
    e.preventDefault();
    percent.value = props.max;
  } else {
    return;
  }
  emit('update:modelValue', percent.value);
  emit('resize', percent.value);
};

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
});
</script>

<style lang="scss" scoped>
.pui-splitter {
  display: flex;
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--pui-border, #e3e9f2);
  background: var(--pui-bg-elevated, #fff);

  &--vertical {
    flex-direction: column;
  }
}

.pui-splitter__pane {
  overflow: auto;
  min-width: 0;
  min-height: 0;
}

.pui-splitter__bar {
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pui-bg-soft, #f4f6fa);
  transition: background 0.16s ease;
  touch-action: none;
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: transparent;
  }

  &:hover:not(.is-disabled),
  &:focus-visible:not(.is-disabled) {
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.14));
    .pui-splitter__bar-handle {
      background: var(--pui-brand, #0e80eb);
    }
  }
  &.is-disabled { cursor: not-allowed; opacity: 0.6; }
}

.pui-splitter__bar-handle {
  border-radius: 4px;
  background: var(--pui-border-strong, #c9d3e0);
  transition: background 0.16s ease;
  pointer-events: none;
}

.is-dragging .pui-splitter__bar {
  background: var(--pui-brand-soft, rgba(14, 128, 235, 0.18));
  .pui-splitter__bar-handle { background: var(--pui-brand, #0e80eb); }
}

/* 横向：竖条 */
.pui-splitter--horizontal > .pui-splitter__bar {
  width: var(--pui-splitter-bar, 8px);
  cursor: col-resize;
  .pui-splitter__bar-handle {
    width: 3px;
    height: 32px;
  }
  &::after {
    left: -6px;
    right: -6px;
  }
}

/* 纵向：横条 */
.pui-splitter--vertical > .pui-splitter__bar {
  height: var(--pui-splitter-bar, 8px);
  cursor: row-resize;
  .pui-splitter__bar-handle {
    width: 32px;
    height: 3px;
  }
  &::after {
    top: -6px;
    bottom: -6px;
  }
}
</style>
