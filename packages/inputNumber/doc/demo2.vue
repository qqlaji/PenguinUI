<template>
  <div class="in-demo">
    <t-input-number v-model="v" :min="-5" :max="5" size="small" />
    <t-input-number v-model="v" size="default" />
    <t-input-number v-model="v" size="large" />
    <span class="in-demo__val">当前值：<b>{{ v }}</b></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v = ref(0)
</script>

<style scoped>
.in-demo { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.in-demo__val { color: var(--pui-text-sub); font-size: 13px; }
.in-demo__val b { color: var(--pui-brand); }
</style>
