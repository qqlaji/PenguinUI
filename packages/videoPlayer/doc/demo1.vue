<template>
  <div class="vp-demo1">
    <t-video-player :src="src" :poster="poster" class="vp-demo1__player" />

    <t-typography type="secondary" size="small" block>
      自定义控制栏：播放/暂停、进度拖拽、音量、倍速、画中画、全屏。
      播放中鼠标静止 2.6 秒会自动隐藏控制栏，移动鼠标重新出现。
    </t-typography>

    <t-typography type="secondary" size="small" block>
      快捷键：<code>空格</code> 播放/暂停、<code>F</code> 全屏、<code>M</code> 静音、
      <code>←</code> <code>→</code> 快退/快进 5 秒。双击画面也能全屏。
    </t-typography>
  </div>
</template>

<script setup>
// 公开示例视频（W3C 测试资源）
const src = 'https://www.w3schools.com/html/mov_bbb.mp4';
const poster =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#101923"/>
        <stop offset="100%" stop-color="#0e3a63"/>
      </linearGradient></defs>
      <rect width="640" height="360" fill="url(#g)"/>
      <circle cx="320" cy="180" r="42" fill="rgba(255,255,255,0.14)"/>
      <path d="M306 160l34 20-34 20z" fill="#fff"/>
    </svg>`
  );
</script>

<style lang="scss" scoped>
.vp-demo1 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 640px;
}
.vp-demo1__player {
  width: 100%;
}
</style>
