<template>
  <div class="tree-lazy">
    <t-tree
      :options="lazyTree"
      lazy
      :load-data="loadData"
      checkable
      show-toolbar
      class="tree-lazy__tree"
      @load="onLoad"
    />

    <div class="tree-lazy__side">
      <t-typography strong block>异步加载</t-typography>
      <t-typography type="secondary" size="small" block>
        _lazy_ + _load-data_ 让子节点在首次展开时才拉取，适合目录很深的场景。
        <code>loadData(node)</code> 返回 Promise&lt;children[]&gt;，加载期间箭头显示转圈。
      </t-typography>
      <t-typography type="secondary" size="small" block>
        加载结果会缓存，再次展开不会重复请求。
      </t-typography>
      <div class="tree-lazy__log">
        <span class="tree-lazy__log-title">加载日志</span>
        <ul>
          <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
          <li v-if="!logs.length" class="tree-lazy__ph">展开左侧带箭头的节点试试</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// isLeaf: false 表示「还有子节点未加载」，展开时才请求
const lazyTree = [
  {
    label: '组织架构',
    isLeaf: false,
    children: [
      { label: '研发中心', isLeaf: false },
      { label: '设计中心', isLeaf: false }
    ]
  },
  {
    label: '权限组',
    isLeaf: false,
    children: [{ label: '管理员', isLeaf: false }]
  }
];

const logs = ref([]);

const loadData = (node) => {
  // 模拟接口延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: `${node.label} · 子项 A`, isLeaf: true },
        { label: `${node.label} · 子项 B`, isLeaf: true },
        { label: `${node.label} · 子项 C`, isLeaf: true }
      ]);
    }, 620);
  });
};

const onLoad = ({ key, children, error }) => {
  logs.value.unshift(
    error ? `✗ ${key} 加载失败` : `✓ ${key} 加载了 ${children.length} 个子节点`
  );
  if (logs.value.length > 5) logs.value.pop();
};
</script>

<style lang="scss" scoped>
.tree-lazy {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.tree-lazy__tree {
  padding: 10px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.tree-lazy__side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.tree-lazy__log {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
  border: 1px solid var(--pui-border, #e7ecf3);

  ul {
    margin: 6px 0 0;
    padding-left: 16px;
    font-size: 12px;
    line-height: 1.9;
    color: var(--pui-text-sub, #5b6879);
  }
}
.tree-lazy__log-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.tree-lazy__ph {
  list-style: none;
  margin-left: -16px;
  color: var(--pui-text-muted, #8b96a6);
}
@media (max-width: 720px) {
  .tree-lazy { grid-template-columns: minmax(0, 1fr); }
}
</style>
