<template>
  <div class="bc-demo">
    <t-breadcrumb>
      <t-breadcrumb-item>首页</t-breadcrumb-item>
      <t-breadcrumb-item>组件</t-breadcrumb-item>
      <t-breadcrumb-item>导航</t-breadcrumb-item>
      <t-breadcrumb-item>Breadcrumb 面包屑</t-breadcrumb-item>
    </t-breadcrumb>

    <t-breadcrumb separator="·">
      <t-breadcrumb-item>工作台</t-breadcrumb-item>
      <t-breadcrumb-item>项目列表</t-breadcrumb-item>
      <t-breadcrumb-item>企鹅 UI</t-breadcrumb-item>
    </t-breadcrumb>

    <t-breadcrumb separator-icon="t-icon-arrow-right">
      <t-breadcrumb-item>首页</t-breadcrumb-item>
      <t-breadcrumb-item>文档</t-breadcrumb-item>
      <t-breadcrumb-item>图标分隔</t-breadcrumb-item>
    </t-breadcrumb>
  </div>
</template>

<script setup></script>

<style scoped>
.bc-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px;
}
</style>
