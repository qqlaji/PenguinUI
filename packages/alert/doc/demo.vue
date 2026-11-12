<template>
  <div class="demo-stack">
    <t-alert v-for="t in types" :key="t" :type="t" :title="titleMap[t]"
             :description="`这是一条 ${t} 类型的提示信息。`" showIcon closable />
    <t-alert type="success" effect="dark" title="深色效果"
             description="effect='dark' 让提示更醒目。" showIcon />
    <t-alert type="warning" round center title="居中 + 圆角" showIcon />
    <t-alert v-if="show" type="primary" title="可关闭" closable @close="show = false">
      关闭后可以点下面的按钮重新显示。
    </t-alert>
    <t-button v-if="!show" size="small" @click="show = true">重新显示</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const types = ['info', 'success', 'warning', 'danger', 'primary']
const titleMap = {
  info: '提示', success: '成功', warning: '警告', danger: '错误', primary: '重要'
}
const show = ref(true)
</script>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 12px; }
</style>
