<template>
  <t-carousel height="220">
    <t-carousel-item>
      <div class="cl-slide" style="background:linear-gradient(135deg,#0e80eb,#0a68c4)">幻灯片 1</div>
    </t-carousel-item>
    <t-carousel-item>
      <div class="cl-slide" style="background:linear-gradient(135deg,#6d3bd1,#9b5cff)">幻灯片 2</div>
    </t-carousel-item>
    <t-carousel-item>
      <div class="cl-slide" style="background:linear-gradient(135deg,#087a52,#35c76a)">幻灯片 3</div>
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
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 2px;
}
</style>
