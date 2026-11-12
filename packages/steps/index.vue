<template>
  <div
    class="pui-steps"
    :class="[`pui-steps--${direction}`, { 'pui-steps--center': alignCenter }]"
  >
    <div
      v-for="(step, index) in items"
      :key="index"
      class="pui-step"
      :class="[`is-${statusOf(index)}`, { 'pui-step--last': index === items.length - 1 }]"
    >
      <div class="pui-step__head">
        <div class="pui-step__node">
          <i v-if="iconOf(index)" :class="iconOf(index)"></i>
          <span v-else-if="statusOf(index) === 'finish' && !iconOf(index)" class="t-icon-success pui-step__check"></span>
          <span v-else-if="statusOf(index) === 'error' && !iconOf(index)" class="t-icon-error pui-step__check"></span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div v-if="index !== items.length - 1" class="pui-step__line"></div>
      </div>
      <div class="pui-step__main">
        <div class="pui-step__title">{{ step.title }}</div>
        <div v-if="step.description" class="pui-step__desc">{{ step.description }}</div>
        <div v-if="$slots[`step-${index}`]" class="pui-step__extra">
          <slot :name="`step-${index}`"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'tSteps' };
</script>

<script setup>
import { computed, provide, useSlots } from 'vue';
import tStep from './step.vue';

const props = defineProps({
  active: { type: Number, default: 0 },
  direction: { type: String, default: 'horizontal' },
  alignCenter: { type: Boolean, default: false },
  finishStatus: { type: String, default: 'finish' },
});

const $slots = useSlots();
// t-step 通过默认插槽传入，这里收集其 props（title/description/icon/status）
const items = computed(() => {
  const nodes = ($slots.default ? $slots.default() : [])
    .flatMap((n) => (n.type === tStep ? [n] : n.children || []))
    .filter((n) => n && n.type === tStep);
  return nodes.map((n) => ({ ...(n.props || {}) }));
});

provide('puiSteps', props);

const statusOf = (index) => {
  const node = items.value[index];
  if (node && node.status) return node.status;
  if (index < props.active) return props.finishStatus;
  if (index === props.active) return 'process';
  return 'wait';
};
const iconOf = (index) => items.value[index] && items.value[index].icon;
</script>

<style scoped lang="scss">
.pui-steps {
  display: flex;
  width: 100%;

  &--vertical { flex-direction: column; }
  &--center .pui-step__main { text-align: center; }
}

.pui-step {
  flex: 1;
  display: flex;
  gap: 10px;

  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: none;
  }
  &__node {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    background: var(--pui-bg-elevated, #fff);
    border: 2px solid var(--pui-border-strong, #d8e0ea);
    color: var(--pui-text-muted, #8b96a6);
    transition: all 0.2s ease;
  }
  &__line {
    flex: 1;
    width: 2px;
    margin: 4px 0;
    background: var(--pui-border, #e7ecf3);
    min-height: 14px;
  }
  &__main { padding-bottom: 18px; }
  &__title { font-size: 14px; font-weight: 600; color: var(--pui-text, #1c2534); }
  &__desc { margin-top: 3px; font-size: 12px; color: var(--pui-text-muted, #8b96a6); line-height: 1.5; }
  &__extra { margin-top: 8px; }

  // 状态色
  &.is-process .pui-step__node {
    border-color: var(--pui-brand, #0e80eb);
    color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 4px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  }
  &.is-finish .pui-step__node {
    border-color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand, #0e80eb);
    color: #fff;
  }
  &.is-finish .pui-step__line { background: var(--pui-brand, #0e80eb); }
  &.is-finish .pui-step__title { color: var(--pui-text, #1c2534); }
  &.is-error .pui-step__node {
    border-color: var(--pui-danger, #ec3437);
    color: var(--pui-danger, #ec3437);
  }
  &.is-error .pui-step__title { color: var(--pui-danger, #ec3437); }
}

.pui-step__check { font-size: 14px; }

// 竖向布局
.pui-steps--vertical .pui-step {
  flex-direction: row;
  min-height: 64px;
  &__line { width: 2px; align-self: stretch; }
  &__main { padding-bottom: 24px; }
}
.pui-steps--vertical .pui-step--last { flex: none; }

@media (prefers-reduced-motion: reduce) {
  .pui-step__node { transition: none; }
}
</style>
