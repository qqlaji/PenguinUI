<template>
  <section class="pui-collapse-item" :class="{ 'is-open': isOpen, 'is-disabled': disabled }">
    <button
        class="pui-collapse-item__head"
        type="button"
        :disabled="disabled"
        :aria-expanded="isOpen"
        :aria-controls="panelId"
        @click="handleToggle"
    >
      <span class="pui-collapse-item__title"><slot name="title">{{ title }}</slot></span>
      <t-icon class="pui-collapse-item__arrow" name="arrow-right" :size="14" />
    </button>
    <div :id="panelId" class="pui-collapse-item__panel" role="region">
      <div class="pui-collapse-item__inner"><slot /></div>
    </div>
  </section>
</template>

<script>
export default { name: 'tCollapseItem' };
</script>

<script setup>
import { computed, getCurrentInstance, inject } from 'vue';

const props = defineProps({
  name: { type: [String, Number], default: '' },
  title: { type: String, default: '' },
  disabled: Boolean,
});
const instance = getCurrentInstance();
const ctx = inject('pui-collapse', null);
const key = computed(() => props.name === '' ? String(instance?.uid ?? '0') : String(props.name));
const panelId = `pui-collapse-panel-${instance?.uid ?? '0'}`;
const isOpen = computed(() => {
  if (!ctx) return false;
  return ctx.accordion.value
    ? ctx.active.value === key.value
    : ctx.active.value.includes(key.value);
});
const handleToggle = () => {
  if (!props.disabled && ctx) ctx.toggle(key.value);
};
</script>

<style scoped lang="scss">
.pui-collapse-item {
  border-top: 1px solid var(--pui-border, #e7ecf3);
  &:first-child { border-top: 0; }
  &__head {
    width: 100%;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border: 0;
    background: transparent;
    color: var(--pui-text, #1c2534);
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    &:hover:not(:disabled) { background: var(--pui-bg-soft, #f7f9fc); }
    &:focus-visible { outline: 2px solid var(--pui-brand, #0e80eb); outline-offset: -2px; }
    &:disabled { color: var(--pui-text-muted, #8b96a6); cursor: not-allowed; }
  }
  &__title { flex: 1; min-width: 0; }
  &__arrow {
    flex: none;
    color: var(--pui-text-muted, #8b96a6);
    transition: transform 0.24s var(--pui-ease, ease);
  }
  &.is-open &__arrow { transform: rotate(90deg); color: var(--pui-brand, #0e80eb); }
  &__panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.28s var(--pui-ease, ease);
  }
  &.is-open &__panel { grid-template-rows: 1fr; }
  &__inner {
    overflow: hidden;
    padding: 0 16px;
    color: var(--pui-text-sub, #5b6879);
    font-size: 13.5px;
    line-height: 1.8;
  }
  &.is-open &__inner { padding-bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .pui-collapse-item__panel, .pui-collapse-item__arrow { transition: none; }
}
</style>
