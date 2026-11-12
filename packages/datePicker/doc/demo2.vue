<template>
  <div class="dp-demo">
    <div class="dp-demo__row">
      <t-date-picker v-model="m" type="month" placeholder="选择月份" />
      <span class="dp-demo__hint">type="month" → {{ m }}</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="y" type="year" placeholder="选择年份" />
      <span class="dp-demo__hint">type="year" → {{ y }}</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="m2" type="month" value-format="YYYY-MM" />
      <span class="dp-demo__hint">点击标题可在 日 / 月 / 年 视图间切换</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const m = ref('2026-11-01')
const y = ref('2026-01-01')
const m2 = ref('2026-11')
</script>

<style scoped>
.dp-demo { display: flex; flex-direction: column; gap: 16px; padding: 4px; }
.dp-demo__row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.dp-demo__hint { font-size: 12px; color: var(--pui-text-muted); }
</style>
