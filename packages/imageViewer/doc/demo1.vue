<template>
  <div class="iv-demo">
    <div class="iv-demo__grid">
      <button
        v-for="(img, i) in images"
        :key="i"
        type="button"
        class="iv-demo__thumb"
        @click="open(i)"
      >
        <img :src="img.src" :alt="img.alt" />
        <span class="iv-demo__mask">
          <i class="iconfont t-icon-search" aria-hidden="true"></i>
        </span>
      </button>
    </div>

    <p class="iv-demo__tip">
      点击任意图片打开查看器，支持滚轮缩放、拖拽平移、← → 切换、Esc 关闭、0 重置。
    </p>

    <t-image-viewer
      v-model="visible"
      v-model:current="current"
      :images="images"
      :caption="currentCaption"
      downloadable
      @change="onChange"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { demoImages } from './images';

const images = demoImages;
const visible = ref(false);
const current = ref(0);

const currentCaption = computed(() => {
  const item = images[current.value];
  return item ? item.caption : '';
});

const open = (i) => {
  current.value = i;
  visible.value = true;
};

const onChange = (i) => {
  current.value = i;
};
</script>

<style lang="scss" scoped>
.iv-demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-width: 660px;
}
.iv-demo__thumb {
  position: relative;
  padding: 0;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  overflow: hidden;
  background: none;
  cursor: zoom-in;
  aspect-ratio: 800 / 520;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover img { transform: scale(1.04); }
  &:hover .iv-demo__mask { opacity: 1; }
}
.iv-demo__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 18, 28, 0.42);
  color: #fff;
  font-size: 18px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.iv-demo__tip {
  margin: 12px 2px 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
