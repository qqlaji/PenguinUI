<template>
  <div class="tf-demo">
    <t-transfer :data="data" v-model="value" />
    <p class="tf-demo__hint">已选 {{ value.length }} 项：{{ value.join(', ') || '—' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const value = ref(['2'])
const data = Array.from({ length: 8 }, (_, i) => ({
  key: String(i + 1),
  label: `选项 ${i + 1}`,
  disabled: i === 4,
}))
</script>

<style scoped>
.tf-demo { display: flex; flex-direction: column; gap: 14px; padding: 4px; }
.tf-demo__hint { margin: 0; font-size: 13px; color: var(--pui-text-sub); }
</style>
