<template>
  <div class="tp-demo2">
    <t-time-picker v-model="t" format="HH:mm:ss" />
    <t-time-picker v-model="t2" format="HH:mm:ss" :clearable="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const t = ref('18:45:30')
const t2 = ref('')
</script>

<style scoped>
.tp-demo2 { display: flex; gap: 16px; align-items: center; }
</style>
