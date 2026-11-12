<template>
  <div class="img-demo">
    <t-image
      v-for="(p, i) in list"
      :key="i"
      :src="p"
      :preview-src-list="list"
      :initial-index="i"
      width="160"
      height="160"
      fit="cover"
      :radius="12"
    />
  </div>
  <p class="img-tip">多图预览：支持左右切换、键盘 ← → 与 Esc 关闭</p>
</template>

<script setup>
import { picList } from './pics';
const list = picList;
</script>

<style scoped>
.img-demo {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.img-tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
</style>
