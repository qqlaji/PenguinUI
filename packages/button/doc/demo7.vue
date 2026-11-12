<template>
  <div class="demo-stack">
    <div class="demo-row">
      <t-button type="primary" plain>朴素按钮</t-button>
      <t-button type="success" plain>成功</t-button>
      <t-button type="danger" plain>危险</t-button>
      <t-button type="warning" plain>警告</t-button>
    </div>
    <div class="demo-row">
      <t-button type="primary" circle leftIcon="t-icon-add" />
      <t-button circle leftIcon="t-icon-search" />
      <t-button type="danger" circle size="small" leftIcon="t-icon-close" />
      <t-button type="primary" loading>加载中</t-button>
      <t-button type="success" :loading="busy" @click="busy = true">点我进入加载</t-button>
      <t-button size="small" @click="busy = false">重置</t-button>
    </div>
    <t-button type="primary" block>块级按钮（占满整行）</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const busy = ref(false)
</script>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 16px; }
.demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
</style>
