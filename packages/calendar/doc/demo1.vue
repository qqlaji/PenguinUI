<template>
  <div class="cal-demo">
    <t-calendar v-model="value" />
    <p class="cal-tip">已选择：<b>{{ value || '未选择' }}</b></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const value = ref(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`);
</script>

<style scoped>
.cal-demo {
  max-width: 520px;
  border: 1px solid var(--pui-border, #e5e6eb);
  border-radius: 12px;
  background: var(--pui-bg, #fff);
}
.cal-tip {
  margin: 0;
  padding: 10px 16px;
  border-top: 1px solid var(--pui-border, #eef0f4);
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
.cal-tip b {
  color: var(--pui-primary, #0e80eb);
}
</style>
