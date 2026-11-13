<template>
  <div class="cs-demo4">
    <t-cascader
      v-model="v"
      :options="categoryOptions"
      filterable
      filter-placeholder="输入「开发」或「规范」试试"
      placeholder="搜索并选择分类"
      style="width: 260px"
    />

    <div class="cs-demo4__side">
      <t-typography strong block>搜索过滤</t-typography>
      <t-typography type="secondary" size="small" block>
        _filterable_ 在面板顶部加搜索框，输入后把所有层级里命中的节点**平铺**成多条完整路径，
        避免用户一层层点开去找。
      </t-typography>
      <t-typography type="secondary" size="small" block>
        支持 ↑ ↓ 切换、Enter 选中；命中文字会高亮。禁用节点不会出现在结果里。
      </t-typography>
      <t-typography type="secondary" size="small" block>
        选中值：<code>{{ v.join(' / ') || '—' }}</code>
      </t-typography>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { categoryOptions } from './data';

const v = ref([]);
</script>

<style lang="scss" scoped>
.cs-demo4 {
  display: grid;
  grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.cs-demo4__side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
@media (max-width: 720px) {
  .cs-demo4 { grid-template-columns: minmax(0, 1fr); }
}
</style>
