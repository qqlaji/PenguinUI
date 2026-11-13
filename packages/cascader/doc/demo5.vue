<template>
  <div class="cs-demo5">
    <t-cascader
      v-model="v"
      :options="lazyOptions"
      :lazy-load="loadData"
      placeholder="点开逐级加载"
      style="width: 260px"
      @load="onLoad"
    />

    <div class="cs-demo5__side">
      <t-typography strong block>异步加载</t-typography>
      <t-typography type="secondary" size="small" block>
        _lazy-load_ 在展开某一级时才请求其子节点，适合省市区、组织架构这类数据量大的场景。
        加载期间该行右侧显示转圈图标，结果会缓存，不会重复请求。
      </t-typography>

      <div class="cs-demo5__log">
        <span class="cs-demo5__log-title">加载日志</span>
        <ul>
          <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
          <li v-if="!logs.length" class="cs-demo5__ph">点开左侧选择器展开一级试试</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 一级数据先给，子级靠 lazyLoad 拉取；isLeaf: false 表示「还有子节点」
const lazyOptions = [
  { value: 'area', label: '华东大区', isLeaf: false },
  { value: 'area2', label: '华南大区', isLeaf: false }
];

const logs = ref([]);

const fakeApi = (parent) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { value: `${parent.value}-1`, label: `${parent.label} · 分部一`, isLeaf: false },
        { value: `${parent.value}-2`, label: `${parent.label} · 分部二`, isLeaf: true }
      ]);
    }, 600);
  });

const loadData = (node) => fakeApi(node);

const onLoad = ({ value, children, error }) => {
  logs.value.unshift(error ? `✗ ${value} 加载失败` : `✓ ${value} 加载了 ${children.length} 项`);
  if (logs.value.length > 5) logs.value.pop();
};

const v = ref([]);
</script>

<style lang="scss" scoped>
.cs-demo5 {
  display: grid;
  grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.cs-demo5__side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.cs-demo5__log {
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
.cs-demo5__log-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.cs-demo5__ph {
  list-style: none;
  margin-left: -16px;
  color: var(--pui-text-muted, #8b96a6);
}
@media (max-width: 720px) {
  .cs-demo5 { grid-template-columns: minmax(0, 1fr); }
}
</style>
