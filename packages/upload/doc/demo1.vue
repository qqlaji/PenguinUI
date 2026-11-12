<template>
  <div class="up-demo">
    <t-upload v-model="list1" :http-request="fake" :multiple="true" accept=".jpg,.png,.pdf">
      <template #trigger="{ trigger }">
        <t-button type="primary" @click="trigger"><i class="t-icon-upload"></i> 选择文件</t-button>
      </template>
    </t-upload>
    <p class="up-tip">基础点击上传 · 支持多选 · 模拟进度</p>

    <t-upload
      v-model="list2"
      :http-request="fake"
      drag
      accept="image/*"
      :multiple="true"
      style="margin-top: 18px"
    />
    <p class="up-tip">拖拽上传区域（image/*）</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const list1 = ref([])
const list2 = ref([])

// 演示用：模拟一个带进度回调的上传请求
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
