<template>
  <t-descriptions title="订单信息" extra="2026-11-12 更新" :column="3" border>
    <t-descriptions-item label="订单号">PUI-20261112-0086</t-descriptions-item>
    <t-descriptions-item label="下单时间">2026-11-12 09:24:31</t-descriptions-item>
    <t-descriptions-item label="状态">
      <t-tag type="success" size="small">已完成</t-tag>
    </t-descriptions-item>
    <t-descriptions-item label="收货人">张伟</t-descriptions-item>
    <t-descriptions-item label="联系电话">138****6621</t-descriptions-item>
    <t-descriptions-item label="支付方式">微信支付</t-descriptions-item>
    <t-descriptions-item label="收货地址" :span="2">
      广东省深圳市南山区科技园中区科苑路 15 号科兴科学园 B 栋 1201
    </t-descriptions-item>
    <t-descriptions-item label="运费">¥ 12.00</t-descriptions-item>
  </t-descriptions>
</template>

<script setup></script>
