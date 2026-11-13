<template>
  <div class="vp-demo2">
    <div class="vp-demo2__row">
      <div class="vp-demo2__col">
        <span class="vp-demo2__label">21:9 超宽</span>
        <t-video-player
          :src="src"
          :poster="poster"
          aspect-ratio="21 / 9"
          :controls-timeout="0"
          @play="push('play')"
          @pause="push('pause')"
          @fullscreen-change="(v) => push(`fullscreen: ${v}`)"
          @rate-change="(v) => push(`rate: ${v}x`)"
        />
      </div>

      <div class="vp-demo2__col">
        <span class="vp-demo2__label">1:1 方形 · 关闭画中画</span>
        <t-video-player :src="src" :poster="poster" aspect-ratio="1 / 1" :pip="false" :rates="[]" />
      </div>
    </div>

    <div class="vp-demo2__log">
      <span class="vp-demo2__log-title">事件日志</span>
      <ul>
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="!logs.length" class="vp-demo2__ph">操作左侧播放器试试</li>
      </ul>
    </div>

    <t-typography type="secondary" size="small" block>
      <code>aspect-ratio</code> 控制播放器比例；<code>controls-timeout="0"</code>
      让控制栏常驻不自动隐藏；<code>:pip="false"</code> 隐藏画中画按钮。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const src = 'https://www.w3schools.com/html/mov_bbb.mp4';
const poster =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
      <rect width="640" height="360" fill="#1b2735"/>
      <circle cx="320" cy="180" r="36" fill="rgba(255,255,255,0.16)"/>
    </svg>`
  );

const logs = ref([]);
const push = (text) => {
  logs.value.unshift(`${new Date().toLocaleTimeString('zh-CN', { hour12: false })} ${text}`);
  if (logs.value.length > 5) logs.value.pop();
};
</script>

<style lang="scss" scoped>
.vp-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.vp-demo2__row {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.vp-demo2__col {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.vp-demo2__label {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.vp-demo2__log {
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
.vp-demo2__log-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.vp-demo2__ph {
  list-style: none;
  margin-left: -16px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
