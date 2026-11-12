<template>
  <t-steps :active="active">
    <t-step title="填写订单" description="确认收货信息" />
    <t-step title="支付价款" description="选择支付方式" />
    <t-step title="等待发货" description="仓库处理中" />
    <t-step title="确认收货" description="交易完成" />
  </t-steps>
  <div class="st-demo__bar">
    <t-button size="small" @click="active = Math.max(0, active - 1)">上一步</t-button>
    <t-button size="small" type="primary" @click="active = Math.min(3, active + 1)">下一步</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(1)
</script>

<style scoped>
.st-demo__bar { margin-top: 18px; display: flex; gap: 10px; }
</style>
