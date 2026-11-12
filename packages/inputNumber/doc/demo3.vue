<template>
  <div class="in-demo">
    <t-input-number v-model="v" :controls="false" placeholder="无加减按钮" />
    <t-input-number v-model="oob" :min="0" :max="100" />
    <p class="in-demo__tip">越界时边框变红并自动修正到合法范围；可用 ↑ / ↓ 键微调。</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(12)
const oob = ref(20)
</script>

<style scoped>
.in-demo { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.in-demo__tip { width: 100%; margin: 4px 0 0; color: var(--pui-text-muted); font-size: 12px; }
</style>
