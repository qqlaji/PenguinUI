<template>
  <component :is="as" :class="['pui-flex', { 'is-inline': inline }]" :style="flexStyle">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'tFlex'
};
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** 渲染标签 */
  as: { type: String, default: 'div' },
  /** 纵向排列 */
  vertical: { type: Boolean, default: false },
  /** 是否开启换行 */
  wrap: { type: Boolean, default: false },
  /** 主轴对齐 */
  justify: { type: String, default: 'flex-start' }, // flex-start | center | flex-end | space-between | space-around | space-evenly
  /** 交叉轴对齐 */
  align: { type: String, default: 'center' }, // flex-start | center | flex-end | stretch | baseline
  /** 间距，数字按 px 处理，也支持任意 CSS 长度 */
  gap: { type: [Number, String], default: 0 },
  /** 行内 flex */
  inline: { type: Boolean, default: false }
});

const toSize = (v) => (typeof v === 'number' || /^\d+(\.\d+)?$/.test(String(v)) ? `${parseFloat(v)}px` : v);

const flexStyle = computed(() => ({
  display: props.inline ? 'inline-flex' : 'flex',
  flexDirection: props.vertical ? 'column' : 'row',
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  justifyContent: props.justify,
  alignItems: props.align,
  gap: props.gap ? toSize(props.gap) : undefined
}));
</script>

<style lang="scss" scoped>
.pui-flex {
  box-sizing: border-box;
  min-width: 0;
}
</style>
