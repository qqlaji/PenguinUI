<template>
  <div class="cl-demo4">
    <div class="cl-demo4__row">
      <div class="cl-demo4__col">
        <span class="cl-demo4__label">progress · 填充进度（可看过渡剩余时间）</span>
        <t-carousel height="180" indicator-type="progress" :interval="4000">
          <t-carousel-item v-for="(s, i) in slides" :key="i">
            <div class="cl-slide" :style="{ background: s.bg }">{{ s.text }}</div>
          </t-carousel-item>
        </t-carousel>
      </div>

      <div class="cl-demo4__col">
        <span class="cl-demo4__label">line · 短横线</span>
        <t-carousel height="180" indicator-type="line">
          <t-carousel-item v-for="(s, i) in slides" :key="i">
            <div class="cl-slide" :style="{ background: s.bg }">{{ s.text }}</div>
          </t-carousel-item>
        </t-carousel>
      </div>
    </div>

    <div class="cl-demo4__row">
      <div class="cl-demo4__col">
        <span class="cl-demo4__label">number · 数字</span>
        <t-carousel height="180" indicator-type="number">
          <t-carousel-item v-for="(s, i) in slides" :key="i">
            <div class="cl-slide" :style="{ background: s.bg }">{{ s.text }}</div>
          </t-carousel-item>
        </t-carousel>
      </div>

      <div class="cl-demo4__col">
        <span class="cl-demo4__label">progress + 竖向</span>
        <t-carousel
          height="180"
          direction="vertical"
          indicator-type="progress"
          :interval="4000"
        >
          <t-carousel-item v-for="(s, i) in slides" :key="i">
            <div class="cl-slide" :style="{ background: s.bg }">{{ s.text }}</div>
          </t-carousel-item>
        </t-carousel>
      </div>
    </div>

    <t-typography type="secondary" size="small" block>
      <code>indicator-type</code> 支持 <code>dot</code> / <code>line</code> /
      <code>progress</code> / <code>number</code>。进度型指示器的激活项会有一个
      <b>随轮播时间填满</b>的色条，鼠标悬停暂停时进度条也会同步暂停。
    </t-typography>
  </div>
</template>

<script setup>
const slides = [
  { text: '第一屏', bg: 'linear-gradient(135deg,#0e80eb,#0a68c4)' },
  { text: '第二屏', bg: 'linear-gradient(135deg,#6d3bd1,#9b5cff)' },
  { text: '第三屏', bg: 'linear-gradient(135deg,#087a52,#35c76a)' },
  { text: '第四屏', bg: 'linear-gradient(135deg,#d1690a,#f7a531)' }
];
</script>

<style scoped>
.cl-demo4 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cl-demo4__row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.cl-demo4__col {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cl-demo4__label {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.cl-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
}
</style>
