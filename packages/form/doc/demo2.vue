<template>
  <t-form :model="form" label-position="top" inline>
    <t-form-item label="关键字" prop="kw">
      <t-input v-model="form.kw" placeholder="搜索内容" />
    </t-form-item>
    <t-form-item label="状态" prop="status">
      <t-select v-model="form.status" :options="opts" placeholder="全部" />
    </t-form-item>
    <t-form-item label=" ">
      <t-button type="primary">查询</t-button>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { reactive } from 'vue'
const form = reactive({ kw: '', status: '' })
const opts = [
  { label: '已发布', value: '1' },
  { label: '草稿', value: '0' }
]
</script>

<style scoped></style>
