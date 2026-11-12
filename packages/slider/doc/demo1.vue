<template>
  <div class="sl-demo">
    <t-slider v-model="v" />
    <p class="sl-demo__val">当前值：<b>{{ v }}</b></p>
    <t-slider v-model="v2" :min="0" :max="10" :step="0.5" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(30)
const v2 = ref(4)
</script>

<style scoped>
.sl-demo { display: flex; flex-direction: column; gap: 22px; padding: 6px 4px; }
.sl-demo__val { margin: 0; color: var(--pui-text-sub); font-size: 13px; }
.sl-demo__val b { color: var(--pui-brand); }
</style>
