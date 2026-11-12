<template>
  <div class="seg-demo">
    <t-segmented v-model="value" :options="options" />
    <p class="seg-tip">当前：<b>{{ value }}</b></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const options = ['日', '周', '月', '年'];
const value = ref('周');
</script>

<style scoped>
.seg-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.seg-tip {
  margin: 0;
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
.seg-tip b {
  color: var(--pui-primary, #0e80eb);
}
</style>
