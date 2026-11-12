<template>
  <div class="stat-row">
    <t-statistic title="总访问量" :value="num" count-up :duration="1500" />
    <t-statistic title="今日新增" :value="day" count-up :duration="1500" suffix="+" />
  </div>
  <div class="stat-actions">
    <t-button size="small" @click="change">刷新数值</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const num = ref(1285600)
const day = ref(320)
const change = () => {
  num.value = Math.round(Math.random() * 2000000)
  day.value = Math.round(Math.random() * 1000)
}
</script>

<style scoped>
.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 48px;
}
.stat-actions {
  margin-top: 14px;
}
</style>
