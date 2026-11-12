<template>
  <div class="dp-demo">
    <div class="dp-demo__row">
      <t-date-picker v-model="dt" show-time value-format="YYYY-MM-DD HH:mm:ss" />
      <span class="dp-demo__hint">日期 + 时分秒</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker v-model="dt2" type="datetime" format="YYYY-MM-DD HH:mm" />
      <span class="dp-demo__hint">只展示到分钟（format 控制）</span>
    </div>
    <p class="dp-demo__value">绑定值：{{ dt }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const dt = ref('2026-11-12 14:30:00')
const dt2 = ref('2026-11-12 09:15:00')
</script>

<style scoped>
.dp-demo { display: flex; flex-direction: column; gap: 16px; padding: 4px; }
.dp-demo__row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.dp-demo__hint { font-size: 12px; color: var(--pui-text-muted); }
.dp-demo__value { margin: 0; font-size: 13px; color: var(--pui-text-sub); }
</style>
