<template>
  <!-- 纵向：标签在上、内容在下，合成一个网格单元 -->
  <div
    v-if="isVertical"
    class="pui-descriptions-item pui-descriptions-item--vertical"
    :style="{ gridColumn: `span ${spanColsFull}` }"
  >
    <div class="pui-descriptions-item__label" :style="{ textAlign: labelAlign }">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="pui-descriptions-item__content" :style="{ textAlign: contentAlign }">
      <slot />
    </div>
  </div>

  <!-- 横向：标签单元格 + 内容单元格，天然对齐 -->
  <template v-else>
    <div class="pui-descriptions-item__label" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="pui-descriptions-item__content" :style="contentStyle">
      <slot />
    </div>
  </template>
</template>

<script>
export default { name: 'tDescriptionsItem' };
</script>

<script setup>
import { computed, inject } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  /** 占据的字段列数 */
  span: { type: Number, default: 1 }
});

const ctx = inject('puiDescriptions', null);

const column = computed(() => (ctx ? ctx.column : 1));
const isVertical = computed(() => (ctx ? ctx.direction === 'vertical' : false));
const isBordered = computed(() => (ctx ? ctx.border : false));

const realSpan = computed(() => Math.max(1, Math.min(props.span || 1, column.value)));
const spanCols = computed(() => realSpan.value * 2 - 1);
const spanColsFull = computed(() => realSpan.value * 2);

const labelAlign = computed(() => (ctx ? ctx.labelAlign : 'left'));
const contentAlign = computed(() => (ctx ? ctx.contentAlign : 'left'));

const labelStyle = computed(() => {
  const style = { textAlign: labelAlign.value, justifyContent: justify(labelAlign.value) };
  if (ctx && ctx.labelWidth) {
    const w = ctx.labelWidth;
    if (typeof w === 'number') style.width = `${w}px`;
    else {
      const s = String(w).trim();
      style.width = /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
    }
    style.flex = 'none';
  }
  return style;
});

const contentStyle = computed(() => ({
  gridColumn: `span ${spanCols.value}`,
  textAlign: contentAlign.value,
  justifyContent: justify(contentAlign.value)
}));

function justify(v) {
  if (v === 'center') return 'center';
  if (v === 'right') return 'flex-end';
  return 'flex-start';
}

/** 供父级在带边框模式下交替行底色时使用 */
defineExpose({ isBordered });
</script>

<style lang="scss">
.pui-descriptions-item__label,
.pui-descriptions-item__content {
  display: flex;
  align-items: flex-start;
  min-width: 0;
  padding: 8px 0;
  font-size: inherit;
  line-height: 1.6;
  word-break: break-word;
}

.pui-descriptions-item__label {
  color: var(--pui-text-3, #6b7280);
  padding-right: 12px;
}

.pui-descriptions-item__content {
  color: var(--pui-text-1, #303133);
  font-weight: 500;
}

.pui-descriptions-item--vertical {
  min-width: 0;
  padding: 8px 0;

  .pui-descriptions-item__label {
    padding: 0 0 2px;
    font-size: 13px;
    color: var(--pui-text-3, #6b7280);
  }
  .pui-descriptions-item__content {
    padding: 0;
  }
}

/* ---------- 带边框 ---------- */
.pui-descriptions.is-bordered {
  .pui-descriptions-item__label,
  .pui-descriptions-item__content {
    padding: 10px 14px;
    align-items: center;
    border-right: 1px solid var(--pui-border, #e5e6eb);
    border-bottom: 1px solid var(--pui-border, #e5e6eb);
  }

  .pui-descriptions-item__label {
    background: var(--pui-bg-soft, #f7f9fc);
    color: var(--pui-text-2, #505050);
    font-weight: 500;
  }

  .pui-descriptions-item--vertical {
    padding: 0;
    border-right: 1px solid var(--pui-border, #e5e6eb);
    border-bottom: 1px solid var(--pui-border, #e5e6eb);

    .pui-descriptions-item__label,
    .pui-descriptions-item__content {
      border: none;
      padding: 0;
    }
    .pui-descriptions-item__label {
      padding: 10px 14px 2px;
      background: transparent;
    }
    .pui-descriptions-item__content {
      padding: 2px 14px 10px;
    }
  }
}
</style>

