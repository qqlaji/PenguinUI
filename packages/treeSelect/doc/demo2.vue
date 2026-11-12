<template>
  <div class="ts-demo">
    <div class="ts-demo__row">
      <t-tree-select
        v-model="v"
        :options="options"
        filterable
        placeholder="搜索部门"
      />
      <span class="ts-demo__hint">输入关键字即可过滤（平铺展示命中项）</span>
    </div>
    <div class="ts-demo__row">
      <t-tree-select v-model="v2" :options="options" disabled placeholder="禁用" />
      <t-tree-select v-model="v3" :options="options" size="small" placeholder="small" />
      <t-tree-select v-model="v4" :options="options" size="large" placeholder="large" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref('')
const v2 = ref('tech')
const v3 = ref('pm')
const v4 = ref('')
const options = [
  {
    label: '技术中心',
    value: 'tech',
    children: [
      { label: '前端组', value: 'fe' },
      { label: '后端组', value: 'be' },
      { label: '测试组（禁用）', value: 'qa', disabled: true },
    ],
  },
  {
    label: '产品设计',
    value: 'design',
    children: [
      { label: '产品经理', value: 'pm' },
      { label: '交互设计', value: 'ux' },
    ],
  },
  { label: '财务部', value: 'finance' },
]
</script>

<style scoped>
.ts-demo { display: flex; flex-direction: column; gap: 16px; padding: 4px; }
.ts-demo__row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ts-demo__hint { font-size: 12px; color: var(--pui-text-muted); }
</style>
