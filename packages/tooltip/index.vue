<template>
  <div
    ref="rootRef"
    class="pui-tooltip"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.esc="onEscape"
  >
    <span class="pui-tooltip__trigger"><slot /></span>
    <transition name="pui-tooltip-fade">
      <div
        v-if="isVisible && !disabled && hasContent"
        class="pui-tooltip__popper"
        :class="[
          `is-${direction}`,
          `is-align-${align}`,
          { 'is-light': !dark, 'has-arrow': showArrow },
        ]"
        :style="popperStyle"
        role="tooltip"
        :id="tooltipId"
      >
        <div class="pui-tooltip__body"><slot name="content">{{ content }}</slot></div>
        <span v-if="showArrow" class="pui-tooltip__arrow"></span>
      </div>
    </transition>
  </div>
</template>

<script>
export default { name: 'tTooltip' };
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';

const props = defineProps({
  content: { type: String, default: '' },
  // top / bottom / left / right，可加 -start / -end 后缀
  placement: { type: String, default: 'top' },
  trigger: { type: String, default: 'hover' }, // hover | click | manual | focus
  visible: { type: Boolean, default: false },  // trigger=manual 时配合 v-model:visible
  disabled: { type: Boolean, default: false },
  dark: { type: Boolean, default: true },
  delay: { type: Number, default: 0 },
  maxWidth: { type: [Number, String], default: 280 },
  showArrow: { type: Boolean, default: true },
  offset: { type: Number, default: 10 },
});
const emit = defineEmits(['update:visible', 'show', 'hide']);
const slots = useSlots();
const rootRef = ref(null);
const innerVisible = ref(false);
let timer = null;
const tooltipId = `pui-tooltip-${Math.random().toString(36).slice(2, 9)}`;

const VALID_DIRECTIONS = ['top', 'bottom', 'left', 'right'];
const direction = computed(() => {
  const d = props.placement.split('-')[0];
  return VALID_DIRECTIONS.includes(d) ? d : 'top';
});
const align = computed(() => {
  const a = props.placement.split('-')[1];
  return ['start', 'end'].includes(a) ? a : 'center';
});
const hasContent = computed(
  () => !!props.content || !!slots.content
);
const popperStyle = computed(() => ({
  '--tt-max': typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  '--tt-gap': `${props.offset}px`,
}));

const isVisible = computed(() =>
  props.trigger === 'manual' ? props.visible : innerVisible.value
);
const setVisible = (value) => {
  if (props.trigger === 'manual') emit('update:visible', value);
  else innerVisible.value = value;
  emit(value ? 'show' : 'hide');
};
const schedule = (value) => {
  clearTimeout(timer);
  if (props.delay > 0 && value) timer = setTimeout(() => setVisible(true), props.delay);
  else setVisible(value);
};
const onMouseEnter = () => {
  if (props.trigger === 'hover' && !props.disabled) schedule(true);
};
const onMouseLeave = () => {
  if (props.trigger === 'hover') { clearTimeout(timer); setVisible(false); }
};
const onClick = () => {
  if (props.trigger !== 'click' || props.disabled) return;
  setVisible(!isVisible.value);
};
const onFocusIn = () => {
  if ((props.trigger === 'hover' || props.trigger === 'focus') && !props.disabled) schedule(true);
};
const onFocusOut = (e) => {
  if (props.trigger === 'hover' || props.trigger === 'focus') {
    if (!rootRef.value?.contains(e.relatedTarget)) { clearTimeout(timer); setVisible(false); }
  }
};
const onEscape = () => {
  if (isVisible.value) { clearTimeout(timer); setVisible(false); }
};
const onDocumentClick = (e) => {
  if (props.trigger === 'click' && isVisible.value && rootRef.value && !rootRef.value.contains(e.target)) {
    setVisible(false);
  }
};
onMounted(() => document.addEventListener('click', onDocumentClick));
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  clearTimeout(timer);
});
</script>

<style scoped lang="scss">
.pui-tooltip {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  vertical-align: middle;
}
.pui-tooltip__trigger { display: inline-flex; max-width: 100%; }

.pui-tooltip__popper {
  // 关键修复：不能用默认的 shrink-to-fit（left:50% 会把可用宽度压成触发器的一半，
  // 导致中文一个字一行）。max-content 让气泡按内容自然展开，再由 max-width 约束换行。
  width: max-content;
  max-width: min(var(--tt-max, 280px), calc(100vw - 32px));
  position: absolute;
  z-index: 3000;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--tt-bg, #1e2b3e);
  color: var(--tt-fg, #f4f8ff);
  border: 1px solid var(--tt-border, transparent);
  box-shadow: 0 10px 30px rgba(12, 24, 42, 0.22);
  font-size: 12.5px;
  line-height: 1.65;
  letter-spacing: 0.01em;
  white-space: normal;
  overflow-wrap: anywhere;
  pointer-events: none;
  --tt-bg: #1e2b3e;
  --tt-fg: #f4f8ff;
  --tt-border: #1e2b3e;

  &.is-light {
    --tt-bg: #ffffff;
    --tt-fg: #2b3a4f;
    --tt-border: #dfe6f0;
    box-shadow: 0 10px 30px rgba(24, 44, 78, 0.16);
  }
}
.pui-tooltip__body {
  white-space: normal;
  :deep(a) { color: inherit; text-decoration: underline; }
  :deep(code) { font-family: var(--pui-font-mono, monospace); font-size: 0.92em; }
  :deep(br) { display: block; content: ''; margin-top: 2px; }
}

.pui-tooltip__arrow {
  position: absolute;
  width: 9px;
  height: 9px;
  background: var(--tt-bg);
  border: 1px solid var(--tt-border);
  transform: rotate(45deg);
  box-sizing: border-box;
}

// ---- 方向：与触发器之间的间距由 --tt-gap 控制 ----
.is-top { bottom: calc(100% + var(--tt-gap, 10px)); }
.is-bottom { top: calc(100% + var(--tt-gap, 10px)); }
.is-left { right: calc(100% + var(--tt-gap, 10px)); }
.is-right { left: calc(100% + var(--tt-gap, 10px)); }

// ---- 对齐 ----
.is-top, .is-bottom {
  &.is-align-center { left: 50%; transform: translateX(-50%); }
  &.is-align-start { left: 0; }
  &.is-align-end { left: auto; right: 0; }
}
.is-left, .is-right {
  &.is-align-center { top: 50%; transform: translateY(-50%); }
  &.is-align-start { top: 0; }
  &.is-align-end { top: auto; bottom: 0; }
}

// ---- 箭头定位（旋转方块，只保留朝向外侧的两条边） ----
.is-top .pui-tooltip__arrow {
  bottom: -5px;
  border-left: 0;
  border-top: 0;
}
.is-bottom .pui-tooltip__arrow {
  top: -5px;
  border-right: 0;
  border-bottom: 0;
}
.is-left .pui-tooltip__arrow {
  right: -5px;
  border-left: 0;
  border-bottom: 0;
}
.is-right .pui-tooltip__arrow {
  left: -5px;
  border-right: 0;
  border-top: 0;
}
.is-top, .is-bottom {
  &.is-align-center .pui-tooltip__arrow { left: 50%; margin-left: -4.5px; }
  &.is-align-start .pui-tooltip__arrow { left: 14px; }
  &.is-align-end .pui-tooltip__arrow { right: 14px; }
}
.is-left, .is-right {
  &.is-align-center .pui-tooltip__arrow { top: 50%; margin-top: -4.5px; }
  &.is-align-start .pui-tooltip__arrow { top: 10px; }
  &.is-align-end .pui-tooltip__arrow { bottom: 10px; }
}

// ---- 入场动效：用独立的 scale 属性，避免覆盖居中的 transform ----
.pui-tooltip-fade-enter-active,
.pui-tooltip-fade-leave-active {
  transition: opacity 0.16s ease, scale 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center;
}
.pui-tooltip-fade-enter-from,
.pui-tooltip-fade-leave-to {
  opacity: 0;
  scale: 0.94;
}

@media (prefers-reduced-motion: reduce) {
  .pui-tooltip-fade-enter-active,
  .pui-tooltip-fade-leave-active { transition: none; }
}
</style>
