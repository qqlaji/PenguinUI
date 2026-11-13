<template>
  <div class="cp-demo3">
    <div class="cp-demo3__row">
      <div class="cp-demo3__item">
        <span class="cp-demo3__label">透明度取色器</span>
        <t-color-picker v-model="color" show-alpha />
        <code class="cp-demo3__val">{{ color || '—' }}</code>
      </div>

      <div class="cp-demo3__item">
        <span class="cp-demo3__label">带透明预设色板</span>
        <t-color-picker v-model="color2" show-alpha :predefine="predefine" />
        <code class="cp-demo3__val">{{ color2 || '—' }}</code>
      </div>
    </div>

    <!-- 叠在图片上验证透明度是否真实生效 -->
    <div class="cp-demo3__preview" :style="{ background: color || 'transparent' }">
      <span>这个色块叠在渐变背景之上，能直接看出透明度</span>
    </div>

    <t-typography type="secondary" size="small" block>
      开启 <code>show-alpha</code> 后：色板与预览块显示<b>棋盘格</b>底纹；
      透明度既可用滑条拖，也可以在右侧输入框直接填百分比；
      HEX 输入支持 8 位格式 <code>#RRGGBBAA</code>。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const color = ref('rgba(14, 128, 235, 0.45)');
const color2 = ref('rgba(236, 52, 55, 0.3)');

/** 预设里可以混入带透明度的色值 */
const predefine = [
  'rgba(14, 128, 235, 0.9)',
  'rgba(14, 128, 235, 0.6)',
  'rgba(14, 128, 235, 0.3)',
  'rgba(19, 160, 101, 0.8)',
  'rgba(250, 140, 22, 0.7)',
  'rgba(236, 52, 55, 0.5)',
  'rgba(114, 46, 209, 0.4)',
  'rgba(47, 53, 66, 0.25)'
];
</script>

<style lang="scss" scoped>
.cp-demo3 {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 620px;
}
.cp-demo3__row {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}
.cp-demo3__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cp-demo3__label {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.cp-demo3__val {
  font-size: 11.5px;
  color: var(--pui-text-sub, #5b6879);
  font-family: var(--pui-font-mono, Consolas, monospace);
}
.cp-demo3__preview {
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid var(--pui-border, #e7ecf3);
  background-image: linear-gradient(120deg, #ffe8e8, #e6f0ff 40%, #e6fff2 70%, #fff6e0);
  font-size: 12px;
  color: var(--pui-text-sub, #5b6879);
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
</style>
