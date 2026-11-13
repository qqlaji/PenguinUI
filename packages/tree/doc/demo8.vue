<template>
  <div class="tree-check">
    <div class="tree-check__panel">
      <div class="tree-check__bar">
        <t-segmented v-model="mode" :options="modes" size="small" />
        <t-button size="small" @click="checked = []">清空</t-button>
      </div>

      <t-tree
        v-model="checked"
        :options="treeData"
        checkable
        :check-strictly="mode === 'strict'"
        :default-open-nodes="['0', '0-0']"
        show-toolbar
        class="tree-check__tree"
      />
    </div>

    <div class="tree-check__side">
      <t-typography strong block>勾选联动</t-typography>
      <t-typography type="secondary" size="small" block>
        勾选父节点自动选中全部后代；子节点部分选中时父节点显示半选横线。
      </t-typography>

      <div class="tree-check__stat">
        <span>已选 <b>{{ checked.length }}</b> 个节点</span>
      </div>

      <div class="tree-check__keys">
        <t-tag v-for="k in checked" :key="k" size="small" effect="light">{{ k }}</t-tag>
        <span v-if="!checked.length" class="tree-check__ph">点击左侧复选框试试</span>
      </div>

      <t-typography type="secondary" size="small" block>
        切到 <code>checkStrictly</code> 后父子互不影响，适合「部分权限」这类场景。
      </t-typography>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { treeData } from './treeData';

const checked = ref(['0-0-0']);
const mode = ref('link');
const modes = [
  { label: '父子联动', value: 'link' },
  { label: '互不关联', value: 'strict' }
];
</script>

<style lang="scss" scoped>
.tree-check {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.tree-check__panel {
  min-width: 0;
}
.tree-check__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.tree-check__tree {
  padding: 10px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.tree-check__side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.tree-check__stat {
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);

  b {
    color: var(--pui-brand, #0e80eb);
    font-variant-numeric: tabular-nums;
    margin: 0 2px;
  }
}
.tree-check__keys {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 26px;
}
.tree-check__ph {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
@media (max-width: 720px) {
  .tree-check { grid-template-columns: minmax(0, 1fr); }
}
</style>
