<template>
  <div class="pc-demo">
    <t-popconfirm title="确定删除这条记录？" content="删除后无法恢复。" @confirm="onConfirm" @cancel="onCancel">
      <t-button type="danger" plain>删除</t-button>
    </t-popconfirm>

    <t-popconfirm title="提交审核" confirm-text="提交" @confirm="submitted = true">
      <t-button type="primary">提交审核</t-button>
    </t-popconfirm>

    <span v-if="log" class="pc-demo__log">最近操作：{{ log }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const log = ref('')
const submitted = ref(false)
const onConfirm = () => (log.value = '已删除')
const onCancel = () => (log.value = '已取消')
</script>

<style scoped>
.pc-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.pc-demo__log { color: var(--pui-text-sub); font-size: 13px; }
</style>
