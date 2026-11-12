<template>
  <div :class="['pui-list', `pui-list--${size}`, customClass, { 'is-bordered': bordered, 'is-split': split }]">
    <div v-if="header || $slots.header" class="pui-list__header">
      <slot name="header">{{ header }}</slot>
    </div>

    <div v-if="loading" class="pui-list__loading">
      <span class="pui-list__spinner"></span>
      <span class="pui-list__loading-text">{{ loadingText }}</span>
    </div>

    <ul v-else-if="data && data.length" class="pui-list__body">
      <li v-for="(item, index) in data" :key="index" class="pui-list__item">
        <slot name="item" :item="item" :index="index">
          <span class="pui-list__item-text">{{ item }}</span>
        </slot>
      </li>
    </ul>

    <div v-else class="pui-list__empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>

    <div v-if="footer || $slots.footer" class="pui-list__footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tList'
};
</script>

<script setup>
defineProps({
  /** 列表数据 */
  data: { type: Array, default: () => [] },
  /** 是否显示边框 */
  bordered: { type: Boolean, default: false },
  /** 是否显示分隔线 */
  split: { type: Boolean, default: true },
  size: { type: String, default: 'default' }, // default | small | large
  /** 头部文字（也可用 header 插槽） */
  header: { type: String, default: '' },
  /** 底部文字（也可用 footer 插槽） */
  footer: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '加载中...' },
  emptyText: { type: String, default: '暂无数据' },
  customClass: { type: String, default: '' }
});
</script>

<style lang="scss" scoped>
.pui-list {
  box-sizing: border-box;
  background: var(--pui-bg-elevated, #fff);
  border-radius: 12px;
  overflow: hidden;

  &.is-bordered {
    border: 1px solid var(--pui-border, #e3e9f2);
  }
}

.pui-list__header,
.pui-list__footer {
  padding: 12px 16px;
  font-size: 13px;
  color: var(--pui-text-3, #6b7a8d);
  background: var(--pui-bg-soft, #f7f9fc);
}
.pui-list__header {
  border-bottom: 1px solid var(--pui-border, #eef2f7);
  font-weight: 600;
  color: var(--pui-text-1, #1f2d3d);
}
.pui-list__footer {
  border-top: 1px solid var(--pui-border, #eef2f7);
}

.pui-list__body {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pui-list__item {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--pui-text-1, #1f2d3d);
  transition: background 0.15s ease;

  &:hover {
    background: var(--pui-bg-soft, #f7f9fc);
  }
}

.is-split .pui-list__item + .pui-list__item {
  border-top: 1px solid var(--pui-border, #eef2f7);
}

.pui-list__item-text {
  display: block;
  word-break: break-word;
}

.pui-list__empty,
.pui-list__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  font-size: 13px;
  color: var(--pui-text-4, #a8b3c2);
}

.pui-list__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--pui-border, #e3e9f2);
  border-top-color: var(--pui-brand, #0e80eb);
  border-radius: 50%;
  animation: pui-list-spin 0.8s linear infinite;
}

@keyframes pui-list-spin {
  to { transform: rotate(360deg); }
}

/* 尺寸 */
.pui-list--small .pui-list__item { padding: 8px 12px; font-size: 13px; }
.pui-list--large .pui-list__item { padding: 16px 20px; font-size: 15px; }
</style>
