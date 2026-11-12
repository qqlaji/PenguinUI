<template>
  <div class="in-demo">
    <t-input-number v-model="v1" />
    <t-input-number v-model="v2" :min="1" :max="10" :step="2" />
    <t-input-number v-model="v3" :precision="2" :step="0.1" />
    <t-input-number v-model="v4" disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v1 = ref(3)
const v2 = ref(4)
const v3 = ref(1.2)
const v4 = ref(8)
</script>

<style scoped>
.in-demo { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
</style>
