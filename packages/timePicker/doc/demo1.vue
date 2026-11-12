<template>
  <div class="tp-demo">
    <t-time-picker v-model="t" />
    <span class="tp-demo__val">当前：<b>{{ t || '未选择' }}</b></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const t = ref('09:30')
</script>

<style scoped>
.tp-demo { display: flex; align-items: center; gap: 16px; }
.tp-demo__val { color: var(--pui-text-sub); font-size: 13px; }
.tp-demo__val b { color: var(--pui-brand); font-variant-numeric: tabular-nums; }
</style>
