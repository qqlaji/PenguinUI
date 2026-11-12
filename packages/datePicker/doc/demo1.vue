<template>
  <div class="dp-demo">
    <div class="dp-demo__row">
      <t-date-picker v-model="d1" />
      <span class="dp-demo__hint">基础</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="d2" clearable placeholder="可清空" />
      <span class="dp-demo__hint">点击右侧 × 清空</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="d3" size="small" />
      <t-date-picker v-model="d4" size="large" />
      <span class="dp-demo__hint">small / large</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="d5" disabled />
      <span class="dp-demo__hint">禁用</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="d6" value-format="YYYY/MM/DD" format="YYYY 年 MM 月 DD 日" />
      <span class="dp-demo__hint">自定义格式：{{ d6 }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const d1 = ref('2026-11-12')
const d2 = ref('2026-06-01')
const d3 = ref('')
const d4 = ref('')
const d5 = ref('2026-01-01')
const d6 = ref('2026-11-12')
</script>

<style scoped>
.dp-demo { display: flex; flex-direction: column; gap: 16px; padding: 4px; }
.dp-demo__row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.dp-demo__hint { font-size: 12px; color: var(--pui-text-muted); }
</style>
