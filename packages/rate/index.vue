<template>
  <div class="pui-rate" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }" @mouseleave="hoverValue = 0">
    <span
        v-for="i in count"
        :key="i"
        class="pui-rate__item"
        :style="itemStyle"
        @mousemove="onMove(i, $event)"
        @click="select(i, $event)"
    >
      <svg class="pui-rate__void" viewBox="0 0 24 24" aria-hidden="true"><path :d="STAR_PATH" /></svg>
      <span class="pui-rate__active" :style="{ width: activeWidth(i), color: color }">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="STAR_PATH" /></svg>
      </span>
    </span>
    <span v-if="showText || $slots.default" class="pui-rate__text">
      <slot>{{ displayText }}</slot>
    </span>
  </div>
</template>

<script>
export default { name: 'tRate' };
</script>

<script setup>
import { computed, ref, useSlots } from 'vue';

const STAR_PATH = 'M12 2.4l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.46l-5.91 3.1 1.13-6.57L2.45 9.34l6.6-.96L12 2.4z';
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  count: { type: Number, default: 5 },
  allowHalf: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: [Number, String], default: 24 },
  color: { type: String, default: '#f7ba2a' },
  voidColor: { type: String, default: '#dce3ec' },
  showText: { type: Boolean, default: false },
  texts: { type: Array, default: () => ['极差', '失望', '一般', '满意', '惊喜'] },
});
const emit = defineEmits(['update:modelValue', 'change']);
const $slots = useSlots();
const hoverValue = ref(0);

const sizeValue = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size);
const itemStyle = computed(() => ({ fontSize: sizeValue.value, color: props.voidColor }));
const displayValue = computed(() => hoverValue.value || props.modelValue);
const activeWidth = (index) => {
  const value = displayValue.value;
  if (value >= index) return '100%';
  if (props.allowHalf && value > index - 1) return `${(value - index + 1) * 100}%`;
  return '0%';
};
const displayText = computed(() => {
  const index = Math.ceil(displayValue.value) - 1;
  return props.texts[Math.min(Math.max(index, 0), props.texts.length - 1)] || `${displayValue.value} 分`;
});
const locked = () => props.disabled || props.readonly;
const valueAt = (index, event) => {
  if (!props.allowHalf) return index;
  const rect = event.currentTarget.getBoundingClientRect();
  const isLeftHalf = event.clientX - rect.left < rect.width / 2;
  return index - (isLeftHalf ? 0.5 : 0);
};
const onMove = (index, event) => {
  if (locked()) return;
  hoverValue.value = valueAt(index, event);
};
const select = (index, event) => {
  if (locked()) return;
  const value = valueAt(index, event);
  hoverValue.value = 0;
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<style scoped lang="scss">
.pui-rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
  &.is-disabled { opacity: 0.55; }
}
.pui-rate__item {
  position: relative;
  display: inline-flex;
  width: 1em;
  height: 1em;
  cursor: pointer;
  transition: transform 0.14s ease;
  &:hover { transform: scale(1.12); }
  svg { width: 1em; height: 1em; display: block; fill: currentColor; }
}
.is-disabled .pui-rate__item, .is-readonly .pui-rate__item { cursor: default; &:hover { transform: none; } }
.pui-rate__void { color: inherit; }
.pui-rate__active {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  svg { width: 1em; height: 1em; max-width: none; fill: currentColor; }
}
.pui-rate__text { margin-left: 8px; font-size: 13px; color: #8b96a6; }
</style>
