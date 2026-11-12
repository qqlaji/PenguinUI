<template>
  <div class="demo-stack">
    <div class="demo-item"><span class="demo-label">基础评分</span><t-rate v-model="score" /> <b>{{ score }} 分</b></div>
    <div class="demo-item"><span class="demo-label">允许半星</span><t-rate v-model="half" allowHalf /> <b>{{ half }} 分</b></div>
    <div class="demo-item"><span class="demo-label">辅助文案</span><t-rate v-model="textScore" showText /></div>
    <div class="demo-item"><span class="demo-label">只读 / 禁用</span><t-rate :modelValue="3.5" allowHalf readonly /> <t-rate :modelValue="4" disabled /></div>
    <div class="demo-item"><span class="demo-label">自定义</span><t-rate v-model="custom" :count="7" :size="20" color="#9b5cff" voidColor="#e8ddff" /><t-button size="small" @click="custom = 0">重置</t-button></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const score = ref(3)
const half = ref(3.5)
const textScore = ref(4)
const custom = ref(5)
</script>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 16px; }
.demo-item { display: flex; align-items: center; gap: 14px; }
.demo-label { width: 90px; flex: none; color: #8b96a6; font-size: 13px; }
.demo-item b { color: #0e80eb; font-size: 13px; }
</style>
