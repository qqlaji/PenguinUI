<template>
  <div class="color-demo">
    <div class="color-demo__row">
      <t-color-picker v-model="color" @change="onChange" />
      <span class="color-demo__chip" :style="{ background: color }"></span>
      <code class="color-demo__code">{{ color || '未选择' }}</code>
    </div>
    <p class="color-demo__tip">点击左侧色块展开取色面板，可在面板中拖动取色、输入 HEX 或点选预设颜色。</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const color = ref('#0e80eb');
const onChange = (val) => {
  console.log('color change:', val);
};
</script>

<style lang="scss" scoped>
.color-demo__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.color-demo__chip {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.color-demo__code {
  padding: 4px 10px;
  border-radius: 7px;
  background: var(--pui-bg-soft, #f4f6fa);
  font-size: 13px;
  color: var(--pui-text-2, #4a5866);
}
.color-demo__tip {
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #8b97a8);
}
</style>
