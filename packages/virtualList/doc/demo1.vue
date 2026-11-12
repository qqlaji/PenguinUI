<template>
  <div class="vl-demo">
    <div class="vl-demo__head">
      <t-typography strong>定高模式 · 10000 条</t-typography>
      <t-typography type="secondary" size="small">DOM 中始终只渲染可视区附近的项</t-typography>
    </div>

    <t-virtual-list
      :data="bigData"
      :item-height="36"
      :height="260"
      item-key="id"
      class="vl-demo__list"
      @change="onChange"
    >
      <template #default="{ item, index }">
        <div class="vl-demo__row">
          <span class="vl-demo__idx">{{ index + 1 }}</span>
          <span class="vl-demo__text">{{ item.name }}</span>
          <t-tag size="small" effect="light">{{ item.tag }}</t-tag>
        </div>
      </template>
    </t-virtual-list>

    <div class="vl-demo__foot">
      当前渲染区间：{{ range || '—' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const bigData = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `列表项 ${i + 1} · 虚拟滚动只渲染可视区域`,
  tag: i % 3 === 0 ? '常规' : i % 3 === 1 ? '重要' : '低'
}));

const range = ref('');

const onChange = (indexes) => {
  if (!indexes.length) return;
  range.value = `${indexes[0] + 1} - ${indexes[indexes.length - 1] + 1}`;
};
</script>

<style lang="scss" scoped>
.vl-demo {
  max-width: 560px;
}
.vl-demo__head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;
}
.vl-demo__list {
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.vl-demo__row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 14px;
  box-sizing: border-box;
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);

  &:hover {
    background: var(--pui-bg-soft, #f7f9fc);
  }
}
.vl-demo__idx {
  flex: none;
  width: 46px;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  font-variant-numeric: tabular-nums;
}
.vl-demo__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vl-demo__foot {
  margin-top: 8px;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  font-variant-numeric: tabular-nums;
}
</style>
