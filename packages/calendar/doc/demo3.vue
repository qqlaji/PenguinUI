<template>
  <div class="cal-demo">
    <t-calendar
      v-model="value"
      size="small"
      :disabled-date="disabledDate"
    />
    <p class="cal-tip">周末不可选，点击禁用日期无响应</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const disabledDate = (date) => date.getDay() === 0 || date.getDay() === 6;
</script>

<style scoped>
.cal-demo {
  max-width: 460px;
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
</style>
