<template>
  <div class="dp-demo">
    <div class="dp-demo__row">
      <t-date-picker v-model="d" :disabled-date="disabledDate" placeholder="只能选今天及以后" />
      <span class="dp-demo__hint">今天之前的日期不可选</span>
    </div>
    <div class="dp-demo__row">
      <t-date-picker
        v-model="r"
        range
        value-format="YYYY-MM-DD"
        :disabled-date="disabledWeekend"
      />
      <span class="dp-demo__hint">周末不可选</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const d = ref('')
const r = ref([])

const startOfToday = () => {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
}
const disabledDate = (date) => date.getTime() < startOfToday()
const disabledWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<style scoped>
.dp-demo { display: flex; flex-direction: column; gap: 16px; padding: 4px; }
.dp-demo__row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.dp-demo__hint { font-size: 12px; color: var(--pui-text-muted); }
</style>
