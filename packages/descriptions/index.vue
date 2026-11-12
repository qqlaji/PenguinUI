<template>
  <div
    class="pui-descriptions"
    :class="[
      `pui-descriptions--${size}`,
      `is-${direction}`,
      { 'is-bordered': border }
    ]"
  >
    <div v-if="title || $slots.title || extra || $slots.extra" class="pui-descriptions__header">
      <div class="pui-descriptions__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="extra || $slots.extra" class="pui-descriptions__extra">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>

    <div
      class="pui-descriptions__body"
      :style="gridStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default { name: 'tDescriptions' };
</script>

<script setup>
import { computed, provide } from 'vue';

const props = defineProps({
  /** 每行显示的字段数 */
  column: { type: Number, default: 3 },
  /** 方向：horizontal 标签在左，vertical 标签在上 */
  direction: { type: String, default: 'horizontal' },
  /** 是否带边框 */
  border: { type: Boolean, default: false },
  size: { type: String, default: 'default' },
  /** 标签宽度（horizontal 生效） */
  labelWidth: { type: [String, Number], default: '' },
  /** 标签对齐 */
  labelAlign: { type: String, default: 'left' },
  /** 内容对齐 */
  contentAlign: { type: String, default: 'left' },
  title: String,
  extra: String,
  /** 列间距 */
  gutter: { type: Number, default: 16 }
});

const cols = computed(() => Math.max(1, props.column));

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cols.value * 2}, minmax(0, 1fr))`,
  columnGap: props.border ? '0px' : `${props.gutter}px`
}));

provide('puiDescriptions', {
  get column() { return cols.value; },
  get border() { return props.border; },
  get direction() { return props.direction; },
  get labelWidth() { return props.labelWidth; },
  get labelAlign() { return props.labelAlign; },
  get contentAlign() { return props.contentAlign; }
});
</script>

<style scoped lang="scss">
.pui-descriptions {
  width: 100%;
  font-size: 14px;
  color: var(--pui-text-1, #303133);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--pui-text-1, #1f2329);
  }

  &__extra {
    font-size: 13px;
    color: var(--pui-text-3, #6b7280);
  }

  &__body {
    display: grid;
    row-gap: 12px;
  }

  /* ---------- 带边框 ---------- */
  &.is-bordered {
    .pui-descriptions__body {
      row-gap: 0;
      border-top: 1px solid var(--pui-border, #e5e6eb);
      border-left: 1px solid var(--pui-border, #e5e6eb);
      border-radius: 10px;
      overflow: hidden;
    }
  }

  &--small {
    font-size: 13px;
    .pui-descriptions__title { font-size: 14px; }
  }

  &--large {
    font-size: 15px;
    .pui-descriptions__title { font-size: 16px; }
  }
}
</style>
