<template>
  <div class="seg-demo">
    <t-segmented v-model="view" :options="options" />
    <p class="seg-tip">当前视图：<b>{{ view }}</b></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const options = [
  { label: '列表', value: 'list', icon: 't-icon-menu' },
  { label: '卡片', value: 'grid', icon: 't-icon-picture' },
  { label: '统计', value: 'chart', icon: 't-icon-chart-pie' },
  { label: '不可用', value: 'off', icon: 't-icon-close', disabled: true }
];
const view = ref('list');
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
