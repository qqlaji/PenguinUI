<template>
  <div class="tree-filter">
    <t-tree
      :options="bigTree"
      filterable
      show-toolbar
      :max-height="300"
      filter-placeholder="试试输入「表格」或「配置」"
      class="tree-filter__tree"
    />

    <div class="tree-filter__side">
      <t-typography strong block>搜索过滤</t-typography>
      <t-typography type="secondary" size="small" block>
        _filterable_ 开启搜索框，命中文字会高亮，未命中的节点连同子树一起隐藏，
        但命中节点的祖先链会自动保留（否则节点无处挂载）。
      </t-typography>
      <t-typography type="secondary" size="small" block>
        搜索时会自动展开命中节点的祖先，省去手动一层层点开。
      </t-typography>
      <t-typography type="secondary" size="small" block>
        _max-height_ 让树体内部滚动，适合侧边栏这类高度受限的场景。
      </t-typography>
    </div>
  </div>
</template>

<script setup>
import { treeData } from './treeData';

// 复制一份并加深层级，让搜索演示更贴近真实目录
const bigTree = [
  ...treeData,
  {
    label: '文档站',
    children: [
      {
        label: '指南',
        children: [{ label: '快速上手' }, { label: '主题配置' }, { label: '国际化配置' }]
      },
      {
        label: '组件',
        children: [
          { label: '表格组件' },
          { label: '树形组件' },
          { label: '表单配置' }
        ]
      }
    ]
  }
];
</script>

<style lang="scss" scoped>
.tree-filter {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.tree-filter__tree {
  padding: 10px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.tree-filter__side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
@media (max-width: 720px) {
  .tree-filter { grid-template-columns: minmax(0, 1fr); }
}
</style>
