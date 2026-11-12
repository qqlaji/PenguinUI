<template>
  <div class="stat-row">
    <t-statistic title="销售额" :value="1268450" prefix="¥" :precision="2" />
    <t-statistic title="活跃用户" :value="86420" suffix="人" />
    <t-statistic title="转化率" :value="32.6" :precision="1" suffix="%" />
    <t-statistic title="订单数" :value="12890" />
  </div>
</template>

<style scoped>
.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 48px;
}
</style>
