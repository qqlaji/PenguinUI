<template>
  <div class="demo-row">
    <t-badge :value="0"><t-button size="small">显示 0</t-button></t-badge>
    <t-badge :value="0" :showZero="false"><t-button size="small">隐藏 0</t-button></t-badge>
    <t-badge dot pulse><t-button size="small">脉冲圆点</t-button></t-badge>
    <t-badge value="NEW" color="#9b5cff"><t-button size="small">自定义颜色</t-button></t-badge>
    <t-badge :value="128" :max="99" type="primary"><t-button size="small">最大值</t-button></t-badge>
  </div>
</template>

<style scoped>
.demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 26px; }
</style>
