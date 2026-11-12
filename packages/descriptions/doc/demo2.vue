<template>
  <t-descriptions title="基础用法（无边框）" :column="3">
    <t-descriptions-item label="用户名">penguin</t-descriptions-item>
    <t-descriptions-item label="手机号">13800000000</t-descriptions-item>
    <t-descriptions-item label="邮箱">penguin@example.com</t-descriptions-item>
    <t-descriptions-item label="所属团队">前端基础架构</t-descriptions-item>
    <t-descriptions-item label="角色">管理员</t-descriptions-item>
    <t-descriptions-item label="创建时间">2024-06-01</t-descriptions-item>
  </t-descriptions>

  <br />

  <t-descriptions
    title="纵向排列"
    direction="vertical"
    :column="4"
    border
  >
    <t-descriptions-item label="订单号">PUI-20261112-0086</t-descriptions-item>
    <t-descriptions-item label="金额">¥ 1,286.00</t-descriptions-item>
    <t-descriptions-item label="状态">已完成</t-descriptions-item>
    <t-descriptions-item label="渠道">小程序</t-descriptions-item>
  </t-descriptions>
</template>

<script setup></script>
