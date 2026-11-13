<template>
  <div class="ap-demo1">
    <t-audio-player
      :src="src"
      title="晨间播客 · 第 12 期"
      subtitle="聊聊组件库的设计取舍"
      downloadable
      download-name="podcast-ep12.mp3"
    />

    <div class="ap-demo1__switch">
      <t-segmented v-model="variant" :options="variants" size="small" />
      <span class="ap-demo1__tip">切换样式变体</span>
    </div>

    <t-typography type="secondary" size="small" block>
      播放 / 暂停、进度拖拽（含悬浮时间提示）、音量、倍速、循环与下载。
      键盘可用 <code>←</code> <code>→</code> 快退快进 5 秒。
    </t-typography>

    <div class="ap-demo1__preview">
      <t-audio-player :src="src" title="紧凑模式" variant="mini" :show-volume="false" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 公开可访问的示例音频（W3C 测试资源）
const src = 'https://www.w3schools.com/html/horse.mp3';
const variant = ref('default');
const variants = [
  { label: '默认', value: 'default' },
  { label: '紧凑', value: 'mini' }
];
</script>

<style lang="scss" scoped>
.ap-demo1 {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 620px;
}
.ap-demo1__switch {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ap-demo1__tip {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.ap-demo1__preview {
  padding-top: 4px;
}
</style>
