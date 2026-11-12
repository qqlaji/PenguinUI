<template>
  <div class="cs-demo">
    <t-cascader v-model="v" :options="options" />
    <span class="cs-demo__val">选中路径：<b>{{ v.join(' / ') || '—' }}</b></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref([])
const options = [
  {
    value: 'zj', label: '浙江', children: [
      { value: 'hz', label: '杭州', children: [{ value: 'xh', label: '西湖区' }, { value: 'bs', label: '滨江区' }] },
      { value: 'wz', label: '温州', children: [{ value: 'lu', label: '鹿城区' }] }
    ]
  },
  {
    value: 'fj', label: '福建', children: [
      { value: 'xm', label: '厦门' }, { value: 'fz', label: '福州' }
    ]
  }
]
</script>

<style scoped>
.cs-demo { display: flex; align-items: center; gap: 16px; }
.cs-demo__val { color: var(--pui-text-sub); font-size: 13px; }
.cs-demo__val b { color: var(--pui-brand); }
</style>
