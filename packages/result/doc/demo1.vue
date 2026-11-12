<template>
  <div class="res-grid">
    <t-result status="success" title="操作成功" sub-title="订单已提交" />
    <t-result status="warning" title="需要注意" sub-title="部分配置尚未保存" />
    <t-result status="info" title="处理中" sub-title="数据正在同步" />
    <t-result status="error" title="操作失败" sub-title="请稍后重试" />
  </div>
</template>

<style scoped>
.res-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.res-grid :deep(.pui-result) {
  padding: 28px 12px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
}
@media (max-width: 640px) {
  .res-grid {
    grid-template-columns: 1fr;
  }
}
</style>
