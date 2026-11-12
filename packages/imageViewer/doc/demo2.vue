<template>
  <div class="iv-demo2">
    <t-image
      :src="single"
      :width="180"
      :height="118"
      fit="cover"
      :preview="false"
      class="iv-demo2__img"
      @click="openSingle"
    />

    <div class="iv-demo2__side">
      <t-typography type="secondary" size="small" block>
        单图模式：不显示缩略图条与左右切换，适合头像、凭证这类单张预览。
      </t-typography>
      <t-button size="small" @click="openSingle">打开单图预览</t-button>
    </div>

    <t-image-viewer
      v-model="singleVisible"
      :images="[single]"
      :show-thumbnails="false"
      :mask-closable="false"
      caption="点击图片以外区域不会关闭（maskClosable = false）"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { demoImages } from './images';

const single = demoImages[1];
const singleVisible = ref(false);

const openSingle = () => {
  singleVisible.value = true;
};
</script>

<style lang="scss" scoped>
.iv-demo2 {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.iv-demo2__img {
  border-radius: 12px;
  cursor: zoom-in;
  border: 1px solid var(--pui-border, #e7ecf3);
  overflow: hidden;
}
.iv-demo2__side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 340px;
}
</style>
