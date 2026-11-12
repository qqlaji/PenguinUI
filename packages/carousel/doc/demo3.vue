<template>
  <t-carousel height="160" :interval="2500" indicator="hover">
    <t-carousel-item>
      <div class="cl-card">
        <i class="t-icon-success"></i>
        <span>自动化部署完成</span>
      </div>
    </t-carousel-item>
    <t-carousel-item>
      <div class="cl-card">
        <i class="t-icon-warning"></i>
        <span>检测到性能波动</span>
      </div>
    </t-carousel-item>
    <t-carousel-item>
      <div class="cl-card">
        <i class="t-icon-upload"></i>
        <span>等待人工审核</span>
      </div>
    </t-carousel-item>
  </t-carousel>
</template>

<script setup></script>

<style scoped>
.cl-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text, #1c2534);
  font-size: 16px;
  i { font-size: 30px; color: var(--pui-brand, #0e80eb); }
}
</style>
