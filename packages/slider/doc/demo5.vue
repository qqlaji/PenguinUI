<template>
  <div class="sl-demo5">
    <t-slider v-model="v" :marks="marks" :step="10" />
    <p class="sl-demo5__val">当前等级：<b>{{ v }}</b></p>

    <div class="sl-demo5__row">
      <t-slider v-model="v2" vertical :height="180" :marks="vmarks" :step="25" />
      <t-slider v-model="v3" vertical :height="180" range :marks="vmarks" :step="25" />
      <span class="sl-demo5__hint">竖向 + 刻度 / 竖向范围</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(40)
const v2 = ref(50)
const v3 = ref([25, 75])
const marks = { 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }
const vmarks = { 0: '低', 50: '中', 100: '高' }
</script>

<style scoped>
.sl-demo5 { display: flex; flex-direction: column; gap: 26px; padding: 6px 4px; }
.sl-demo5__val { margin: 0; color: var(--pui-text-sub); font-size: 13px; }
.sl-demo5__val b { color: var(--pui-brand); }
.sl-demo5__row { display: flex; gap: 64px; align-items: flex-start; padding: 8px 0 8px 8px; }
.sl-demo5__hint { align-self: center; color: var(--pui-text-muted); font-size: 12px; }
</style>
