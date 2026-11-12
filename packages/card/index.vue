<template>
  <div class="pui-card" :class="classes">
    <div v-if="$slots.header || title || $slots.extra" class="pui-card__header">
      <div class="pui-card__header-main">
        <slot name="header"><span class="pui-card__title">{{ title }}</span></slot>
      </div>
      <div v-if="$slots.extra" class="pui-card__extra"><slot name="extra" /></div>
    </div>
    <div class="pui-card__body" :style="bodyStyle"><slot /></div>
    <div v-if="$slots.footer" class="pui-card__footer"><slot name="footer" /></div>
  </div>
</template>

<script>
export default { name: 'tCard' };
</script>

<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  shadow: { type: String, default: 'always' },   // always | hover | never
  bordered: { type: Boolean, default: true },
  bodyStyle: { type: [Object, String], default: () => ({}) },
  hoverable: { type: Boolean, default: false },
});
const $slots = useSlots();
const classes = computed(() => [
  `pui-card--shadow-${props.shadow}`,
  {
    'pui-card--bordered': props.bordered,
    'pui-card--hoverable': props.hoverable,
  },
]);
</script>

<style scoped lang="scss">
.pui-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  background: #fff;
  color: #3c4658;
  font-size: 14px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.pui-card--bordered { border: 1px solid #e7ecf3; }
.pui-card--shadow-always { box-shadow: 0 4px 18px rgba(24, 44, 78, 0.07); }
.pui-card--shadow-hover { box-shadow: none; &:hover { box-shadow: 0 10px 28px rgba(24, 44, 78, 0.14); } }
.pui-card--shadow-never { box-shadow: none; }
.pui-card--hoverable:hover { transform: translateY(-3px); border-color: #0e80eb; }
.pui-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f7;
}
.pui-card__header-main { min-width: 0; flex: 1; }
.pui-card__title { font-size: 16px; font-weight: 650; color: #1c2534; }
.pui-card__extra { flex: none; color: #8b96a6; }
.pui-card__body { flex: 1; padding: 20px; line-height: 1.8; color: #5b6879; }
.pui-card__footer { padding: 14px 20px; border-top: 1px solid #eef2f7; }
</style>
