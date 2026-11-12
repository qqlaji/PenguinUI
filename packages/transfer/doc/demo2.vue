<template>
  <div class="tf-demo">
    <t-transfer
      :data="data"
      v-model="value"
      filterable
      :titles="['待分配', '已分配']"
    />
    <p class="tf-demo__hint">{{ value.length }} 人已分配</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const value = ref(['zhang', 'li'])
const data = [
  { key: 'wang', label: '王小明 · 前端' },
  { key: 'zhang', label: '张伟 · 后端' },
  { key: 'li', label: '李娜 · 设计' },
  { key: 'zhao', label: '赵强 · 测试' },
  { key: 'sun', label: '孙悦 · 产品' },
  { key: 'zhou', label: '周涛 · 运维' },
]
</script>

<style scoped>
.tf-demo { display: flex; flex-direction: column; gap: 14px; padding: 4px; }
.tf-demo__hint { margin: 0; font-size: 13px; color: var(--pui-text-sub); }
</style>
