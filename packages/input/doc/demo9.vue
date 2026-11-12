<template>
  <div class="demo-stack">
    <t-input v-model="text" :maxlength="20" showWordLimit clearable placeholder="最多输入 20 个字符" />
    <t-input v-model="text" prefixIcon="t-icon-user" placeholder="prefixIcon 等价于 leftIcon">
      <template #prefix><span>账号</span></template>
    </t-input>
    <t-input v-model="text" suffixIcon="t-icon-search" placeholder="suffixIcon 等价于 rightIcon">
      <template #suffix><span>.com</span></template>
    </t-input>
    <t-input v-model="text" status="error" placeholder="校验失败状态" />
    <t-input v-model="text" status="success" placeholder="校验通过状态" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 14px; }
</style>
