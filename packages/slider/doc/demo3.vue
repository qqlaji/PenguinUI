<template>
  <div class="sl-demo3">
    <t-slider v-model="v" vertical :height="180" />
    <t-slider v-model="v2" vertical :height="180" :min="-20" :max="20" />
    <span class="sl-demo3__hint">竖直滑块（vertical）</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(50)
const v2 = ref(0)
</script>

<style scoped>
.sl-demo3 { display: flex; gap: 48px; align-items: flex-start; padding: 8px 16px; }
.sl-demo3__hint { color: var(--pui-text-muted); font-size: 12px; align-self: center; }
</style>
