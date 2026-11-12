<template>
  <div class="card-grid">
    <t-card title="基础卡片">
      一张卡片可以承载一段说明文字、一个列表，或任意 Vue 内容。
    </t-card>
    <t-card shadow="hover" hoverable>
      <template #header><b style="color:#0e80eb">自定义头部</b></template>
      <template #extra><t-tag type="primary" size="small">NEW</t-tag></template>
      悬停时卡片会轻微上浮并显示阴影。
      <template #footer><t-button type="text" size="small">查看详情 →</t-button></template>
    </t-card>
    <t-card shadow="never" :bordered="false" :bodyStyle="{ background: '#f5f8fd', borderRadius: '10px' }">
      <template #header>无阴影卡片</template>
      bodyStyle 可以直接调整内容区样式。
    </t-card>
  </div>
</template>

<style scoped>
.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
</style>
