<template>
  <div class="ap-demo2">
    <div class="ap-demo2__row">
      <!-- 卡片模式：带封面 -->
      <t-audio-player
        :src="src"
        variant="card"
        :cover="cover"
        title="深夜电台 · Vol.07"
        subtitle="关于专注力的三个观察"
        :rates="[1, 1.25, 1.5, 2]"
        class="ap-demo2__card"
      />

      <!-- 事件回显 -->
      <div class="ap-demo2__log">
        <span class="ap-demo2__log-title">事件日志</span>
        <ul>
          <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
          <li v-if="!logs.length" class="ap-demo2__ph">播放或拖动进度试试</li>
        </ul>
      </div>
    </div>

    <t-typography type="secondary" size="small" block>
      <code>variant="card"</code> 会展示封面并叠加播放中的波形动画；
      所有交互都会派发事件，便于接入统计或播放进度持久化。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const src = 'https://www.w3schools.com/html/horse.mp3';
// 用一个渐变 SVG 当封面，避免依赖外部图片
const cover =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0e80eb"/>
        <stop offset="100%" stop-color="#722ed1"/>
      </linearGradient></defs>
      <rect width="400" height="200" fill="url(#g)"/>
      <circle cx="320" cy="46" r="70" fill="rgba(255,255,255,0.12)"/>
      <circle cx="80" cy="170" r="90" fill="rgba(255,255,255,0.08)"/>
    </svg>`
  );

const logs = ref([]);

const push = (text) => {
  logs.value.unshift(`${new Date().toLocaleTimeString('zh-CN', { hour12: false })} ${text}`);
  if (logs.value.length > 5) logs.value.pop();
};
</script>

<style lang="scss" scoped>
.ap-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ap-demo2__row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.ap-demo2__card {
  width: 280px;
}
.ap-demo2__log {
  flex: 1;
  min-width: 220px;
  padding: 10px 12px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);

  ul {
    margin: 6px 0 0;
    padding-left: 16px;
    font-size: 11.5px;
    line-height: 1.9;
    color: var(--pui-text-sub, #5b6879);
  }
}
.ap-demo2__log-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.ap-demo2__ph {
  list-style: none;
  margin-left: -16px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
