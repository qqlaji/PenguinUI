<template>
  <div class="ntf-demo">
    <t-button @click="openInfo">信息</t-button>
    <t-button type="primary" @click="openSuccess">成功</t-button>
    <t-button type="warning" @click="openWarning">警告</t-button>
    <t-button type="danger" @click="openError">错误</t-button>
  </div>
</template>

<script setup>
import Notification from '../index'
const openInfo = () => Notification.info({ title: '新版本', message: 'penguinui v1.9.0 已发布' })
const openSuccess = () => Notification.success({ title: '提交成功', message: '数据已保存至服务器' })
const openWarning = () => Notification.warning({ title: '注意', message: '当前网络环境不稳定' })
const openError = () => Notification.error({ title: '出错了', message: '请求失败，请稍后重试' })
</script>

<style scoped>
.ntf-demo { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
