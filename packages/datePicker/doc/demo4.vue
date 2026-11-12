<template>
  <div class="dp-demo">
    <div class="dp-demo__row">
      <t-date-picker
        v-model="range"
        range
        value-format="YYYY-MM-DD"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <span class="dp-demo__hint">起止日期</span>
    </div>
    <p class="dp-demo__value">{{ range[0] }} ~ {{ range[1] }}</p>

    <div class="dp-demo__row">
      <t-date-picker
        v-model="dtRange"
        range
        show-time
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </div>
    <p class="dp-demo__value">{{ dtRange[0] }} ~ {{ dtRange[1] }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const range = ref(['2026-11-01', '2026-11-20'])
const dtRange = ref(['2026-11-12 08:00:00', '2026-11-12 20:30:00'])
</script>

<style scoped>
.dp-demo { display: flex; flex-direction: column; gap: 14px; padding: 4px; }
.dp-demo__row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.dp-demo__hint { font-size: 12px; color: var(--pui-text-muted); }
.dp-demo__value { margin: 0; font-size: 13px; color: var(--pui-text-sub); }
</style>
