<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
  // 文案位置：仅水平分割线有效
  position: { type: String, default: 'center' }, // left | center | right
  direction: { type: String, default: 'horizontal' }, // horizontal | vertical
  lineStyle: { type: String, default: 'solid' }, // solid | dashed | dotted | double | groove
  // 自定义线色，不传时跟随主题令牌
  color: { type: String, default: '' },
});

const slots = useSlots();
const hasSlot = computed(() => !!slots.default);
const isVertical = computed(() => props.direction === 'vertical');
const position = computed(() =>
  ['left', 'right'].includes(props.position) ? props.position : 'center'
);
const styleVars = computed(() => ({
  '--divider-style': props.lineStyle,
  '--divider-color': props.color || 'var(--pui-border-strong, #dcdfe6)',
}));
</script>

<script>
export default { name: 'tDivider' };
</script>

<template>
  <div
    v-if="isVertical"
    class="pui-divider is-vertical"
    :style="styleVars"
    role="separator"
    aria-orientation="vertical"
  ></div>
  <div
    v-else
    class="pui-divider is-horizontal"
    :class="`is-${position}`"
    :style="styleVars"
    role="separator"
  >
    <span class="pui-divider__line"></span>
    <span v-if="hasSlot" class="pui-divider__text"><slot /></span>
    <span class="pui-divider__line"></span>
  </div>
</template>

<style scoped>
.pui-divider {
  --divider-color: var(--pui-border-strong, #dcdfe6);
  --divider-style: solid;
  box-sizing: border-box;
}
.is-horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 22px 0;
  gap: 0;
}
.pui-divider__line {
  flex: 1 1 0;
  min-width: 0;
  height: 0;
  border-top: 1px var(--divider-style) var(--divider-color);
}
.pui-divider__text {
  flex: none;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--pui-text-sub, #5b6879);
  white-space: nowrap;
  & i { font-size: 15px; color: var(--pui-text-muted, #8b96a6); }
}
.is-left .pui-divider__line:first-child { flex: 0 0 28px; }
.is-right .pui-divider__line:last-child { flex: 0 0 28px; }
.is-vertical {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 12px;
  vertical-align: middle;
  border-left: 1px var(--divider-style) var(--divider-color);
}
</style>
