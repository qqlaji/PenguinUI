<template>
  <div class="tree-demo">
    <t-tree :options="treeData" :default-open-nodes="['0']" show-toolbar class="tree-demo__tree" />

    <div class="tree-demo__side">
      <t-typography strong block>基础用法</t-typography>
      <t-typography type="secondary" size="small" block>
        点击行可展开 / 收起并高亮当前节点，_default-open-nodes_ 按路径 key 展开指定节点。
      </t-typography>
      <t-typography type="secondary" size="small" block>
        提示：节点 key 默认由路径生成（如 <code>0-2-1</code>），也可在数据里自带 <code>key</code> 字段覆盖。
      </t-typography>
    </div>
  </div>
</template>

<script setup>
import { treeData } from './treeData';
</script>

<style lang="scss" scoped>
.tree-demo {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.tree-demo__tree {
  padding: 10px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.tree-demo__side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@media (max-width: 720px) {
  .tree-demo { grid-template-columns: minmax(0, 1fr); }
}
</style>
