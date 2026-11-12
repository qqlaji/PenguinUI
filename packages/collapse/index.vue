<template>
  <div class="pui-collapse" :class="{ 'is-borderless': borderless }">
    <slot />
  </div>
</template>

<script>
export default { name: 'tCollapse' };
</script>

<script setup>
import { computed, provide } from 'vue';

const props = defineProps({
  // 普通模式用数组，手风琴模式用单个 name
  modelValue: { type: [Array, String, Number], default: () => [] },
  accordion: Boolean,
  borderless: Boolean,
});
const emit = defineEmits(['update:modelValue', 'change']);

const active = computed(() => {
  if (props.accordion) {
    return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
      ? ''
      : String(props.modelValue);
  }
  if (Array.isArray(props.modelValue)) return props.modelValue.map(String);
  return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
    ? []
    : [String(props.modelValue)];
});

const toggle = (name) => {
  const key = String(name);
  let next;
  if (props.accordion) {
    next = active.value === key ? '' : key;
  } else {
    next = active.value.includes(key)
      ? active.value.filter((item) => item !== key)
      : [...active.value, key];
  }
  emit('update:modelValue', next);
  emit('change', next);
};

provide('pui-collapse', {
  active,
  accordion: computed(() => props.accordion),
  toggle,
});
</script>

<style scoped lang="scss">
.pui-collapse {
  width: 100%;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 8px;
  background: var(--pui-bg-elevated, #fff);
  overflow: hidden;
  &.is-borderless { border: 0; background: transparent; }
}
</style>
