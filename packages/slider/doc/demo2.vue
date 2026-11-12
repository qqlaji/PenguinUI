<template>
  <div class="sl-demo2">
    <t-slider v-model="v" show-input />
    <t-slider v-model="v2" :show-stops="true" :step="10" />
    <t-slider v-model="v3" disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(40)
const v2 = ref(60)
const v3 = ref(20)
</script>

<style scoped>
.sl-demo2 { display: flex; flex-direction: column; gap: 22px; padding: 6px 4px; }
</style>
