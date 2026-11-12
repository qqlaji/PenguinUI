<template>
  <div class="ntf-demo2">
    <t-button @click="stack">连续弹出 3 条</t-button>
    <t-button @click="persist">常驻通知（手动关闭）</t-button>
  </div>
</template>

<script setup>
import Notification from '../index'
const stack = () => {
  Notification({ title: '任务 1', message: '正在初始化…', duration: 3000 })
  Notification({ title: '任务 2', message: '下载依赖中…', duration: 4000 })
  Notification({ title: '任务 3', message: '构建完成', duration: 5000 })
}
const persist = () => {
  const n = Notification({ title: '后台同步', message: '点击右上角关闭按钮手动关闭', duration: 0, closable: true })
  setTimeout(() => n.close(), 8000)
}
</script>

<style scoped>
.ntf-demo2 { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
