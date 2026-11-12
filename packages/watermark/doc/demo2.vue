<template>
  <div class="wm-demos">
    <t-watermark
      :content="['第一行水印', '第二行水印']"
      :opacity="0.18"
      font-color="#0e80eb"
      :font-size="15"
      font-weight="600"
      :rotate="-15"
      :gap-x="120"
      :gap-y="110"
    >
      <div class="wm-box">多行 + 自定义样式水印</div>
    </t-watermark>

    <t-watermark content="" :image="logo" :width="48" :height="48" :gap-x="90" :gap-y="90" :opacity="0.16">
      <div class="wm-box">图片水印</div>
    </t-watermark>
  </div>
</template>

<script setup>
// 内联 SVG 作为图片水印，避免依赖外部资源
const logo =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2048%2048'%3E%3Crect%20width%3D'48'%20height%3D'48'%20rx%3D'12'%20fill%3D'%230e80eb'%2F%3E%3Ctext%20x%3D'24'%20y%3D'31'%20font-size%3D'20'%20font-family%3D'sans-serif'%20font-weight%3D'700'%20fill%3D'%23fff'%20text-anchor%3D'middle'%3EP%3C%2Ftext%3E%3C%2Fsvg%3E";
</script>

<style lang="scss" scoped>
.wm-demos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.wm-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  border: 1px dashed var(--pui-border-strong, #d8e0ea);
  border-radius: 12px;
  font-size: 13px;
  color: var(--pui-text-3, #8b97a8);
  background: var(--pui-bg-elevated, #fff);
}
</style>
