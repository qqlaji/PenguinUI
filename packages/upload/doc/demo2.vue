<template>
  <div class="up-demo">
    <t-upload
      v-model="list"
      :http-request="fake"
      list-type="picture"
      :multiple="true"
      accept="image/*"
    />
    <p class="up-tip">图片列表 · 自动缩略图 · 点击缩略图预览大图</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([])
function fake({ file, onProgress, onSuccess }) {
  let p = 0
  const timer = setInterval(() => {
    p += Math.random() * 16 + 8
    if (p >= 100) {
      p = 100
      clearInterval(timer)
      setTimeout(() => onSuccess({ code: 0, url: 'https://example.com/' + file.name }), 160)
    } else {
      onProgress(p)
    }
  }, 200)
}
</script>

<style scoped>
.up-demo {
  display: block;
}
.up-tip {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
