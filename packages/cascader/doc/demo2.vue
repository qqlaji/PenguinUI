<template>
  <div class="cs-demo2">
    <t-cascader v-model="v" :options="options" change-on-select placeholder="可选择任意层级" />
    <t-cascader v-model="v2" :options="options" :clearable="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(['zj'])
const v2 = ref([])
const options = [
  {
    value: 'zj', label: '浙江', children: [
      { value: 'hz', label: '杭州' }, { value: 'wz', label: '温州' }
    ]
  },
  { value: 'sh', label: '上海', children: [{ value: 'pd', label: '浦东新区' }] }
]
</script>

<style scoped>
.cs-demo2 { display: flex; gap: 16px; align-items: center; }
</style>
