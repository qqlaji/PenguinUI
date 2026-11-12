<template>
  <div class="img-demo">
    <t-image
      :src="pic1"
      alt="示例图片"
      width="240"
      height="150"
      fit="cover"
      :radius="12"
    />
    <t-image
      :src="pic2"
      alt="示例图片"
      width="240"
      height="150"
      fit="cover"
      :radius="12"
    />
  </div>
  <p class="img-tip">点击图片打开预览，可缩放、旋转、拖拽平移</p>
</template>

<script setup>
import { pic1, pic2 } from './pics';
</script>

<style scoped>
.img-demo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.img-tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
</style>
