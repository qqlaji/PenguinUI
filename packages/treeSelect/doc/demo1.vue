<template>
  <div class="ts-demo">
    <div class="ts-demo__row">
      <t-tree-select v-model="v1" :options="options" placeholder="请选择部门" />
      <span class="ts-demo__hint">{{ v1 }}</span>
    </div>
    <div class="ts-demo__row">
      <t-tree-select v-model="v2" :options="options" multiple placeholder="可多选" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v1 = ref('dev-fe')
const v2 = ref(['dev-fe', 'pm'])
const options = [
  {
    label: '技术中心',
    value: 'tech',
    children: [
      {
        label: '前端组',
        value: 'fe',
        children: [
          { label: '前端一组', value: 'dev-fe' },
          { label: '前端二组', value: 'dev-fe2' },
        ],
      },
      {
        label: '后端组',
        value: 'be',
        children: [
          { label: '服务端', value: 'dev-be' },
          { label: '数据平台', value: 'dev-data' },
        ],
      },
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
