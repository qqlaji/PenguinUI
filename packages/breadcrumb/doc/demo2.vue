<template>
  <div class="bc-demo2">
    <t-breadcrumb separator-icon="t-icon-arrow-right">
      <t-breadcrumb-item to="/penguinui/home">
        <i class="t-icon-home bc-demo2__home"></i>
        首页
      </t-breadcrumb-item>
      <t-breadcrumb-item to="/penguinui/button">基础组件</t-breadcrumb-item>
      <t-breadcrumb-item to="/penguinui/breadcrumb">导航</t-breadcrumb-item>
      <t-breadcrumb-item>可跳转面包屑</t-breadcrumb-item>
    </t-breadcrumb>

    <t-breadcrumb :space="14">
      <t-breadcrumb-item to="/penguinui/input">表单</t-breadcrumb-item>
      <t-breadcrumb-item to="/penguinui/form">Form 表单</t-breadcrumb-item>
      <t-breadcrumb-item>校验示例</t-breadcrumb-item>
    </t-breadcrumb>
  </div>
</template>

<script setup></script>

<style scoped>
.bc-demo2 {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px;
}
.bc-demo2__home {
  margin-right: 5px;
  font-size: 13px;
  vertical-align: -1px;
}
</style>
