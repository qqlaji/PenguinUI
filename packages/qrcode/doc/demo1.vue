<template>
  <div class="qr-demo">
    <t-qrcode value="https://gitee.com/blue-sf/penguinui" :size="150" title="扫码查看仓库" />

    <div class="qr-demo__list">
      <div class="qr-demo__item">
        <span class="qr-demo__label">纠错 L</span>
        <t-qrcode value="https://gitee.com/blue-sf/penguinui" level="L" :size="120" :padding="6" />
      </div>
      <div class="qr-demo__item">
        <span class="qr-demo__label">纠错 M（默认）</span>
        <t-qrcode value="https://gitee.com/blue-sf/penguinui" level="M" :size="120" :padding="6" />
      </div>
      <div class="qr-demo__item">
        <span class="qr-demo__label">纠错 Q</span>
        <t-qrcode value="https://gitee.com/blue-sf/penguinui" level="Q" :size="120" :padding="6" />
      </div>
      <div class="qr-demo__item">
        <span class="qr-demo__label">纠错 H</span>
        <t-qrcode value="https://gitee.com/blue-sf/penguinui" level="H" :size="120" :padding="6" />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.qr-demo {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}
.qr-demo__list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.qr-demo__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.qr-demo__label {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
