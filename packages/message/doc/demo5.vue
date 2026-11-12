<template>
  <div class="demo-row">
    <t-button type="primary" @click="showClosable">可手动关闭（5 秒）</t-button>
    <t-button @click="showStack">连续弹出 3 条</t-button>
    <t-button type="success" @click="showCustom">自定义位置</t-button>
  </div>
</template>

<script setup>
import Message from '../../index'
const showClosable = () => Message({ type: 'success', text: '可以点 × 提前关闭', duration: 5000, closable: true })
const showStack = () => {
  ['info', 'success', 'warn'].forEach((type, i) => {
    setTimeout(() => Message({ type, text: `第 ${i + 1} 条消息，自动堆叠` }), i * 220)
  })
}
const showCustom = () => Message({ type: 'info', text: '显示在距顶部 160px 处', offset: 160 })
</script>

<style scoped>
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
