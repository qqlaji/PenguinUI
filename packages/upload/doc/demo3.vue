<template>
  <div class="up-demo">
    <t-upload
      ref="upRef"
      v-model="list"
      :http-request="fake"
      :auto-upload="false"
      :limit="3"
      :max-size="2 * 1024 * 1024"
      :multiple="true"
    />
    <div class="up-actions">
      <t-button type="primary" @click="upRef.submit()">开始上传</t-button>
      <t-button @click="upRef.clearFiles()">清空</t-button>
      <span class="up-count">已选 {{ list.length }}/3 · 单文件 ≤ 2MB</span>
    </div>
    <p class="up-tip">手动上传 · 限制 3 个 · 超过 2MB 自动标记失败 · 超出数量触发 exceed</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const list = ref([])
const upRef = ref(null)
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
.up-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}
.up-count {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.up-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
