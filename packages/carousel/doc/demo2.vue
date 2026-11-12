<template>
  <t-carousel height="200" :autoplay="false" arrow="always" indicator="hover">
    <t-carousel-item>
      <div class="cl-slide" style="background:linear-gradient(135deg,#c85a12,#f57b29)">手动切换</div>
    </t-carousel-item>
    <t-carousel-item>
      <div class="cl-slide" style="background:linear-gradient(135deg,#4d6178,#708198)">箭头常显</div>
    </t-carousel-item>
    <t-carousel-item>
      <div class="cl-slide" style="background:linear-gradient(135deg,#c02a68,#f48ab8)">指示器悬停显示</div>
    </t-carousel-item>
  </t-carousel>
</template>

<script setup></script>

<style scoped>
.cl-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}
</style>
