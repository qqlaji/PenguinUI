<template>
  <div class="tp-demo3">
    <t-time-picker v-model="t" disabled />
    <t-time-picker v-model="t2" :disabled="false" placeholder="可点击" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const t = ref('12:00')
const t2 = ref('')
</script>

<style scoped>
.tp-demo3 { display: flex; gap: 16px; align-items: center; }
</style>
