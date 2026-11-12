<template>
  <div class="cb-demo2">
    <t-code-block :code="vueCode" lang="vue" title="Vue 单文件组件" theme="dark" />

    <t-code-block
      :code="cssCode"
      lang="css"
      title="浅色主题 + 关闭行号"
      theme="light"
      :line-numbers="false"
    />

    <t-code-block
      :code="longCode"
      lang="js"
      title="超长代码折叠"
      collapsible
      :collapse-height="180"
    />
  </div>
</template>

<script setup>
const vueCode = [
  '<template>',
  '  <div class="card" :class="{ \'is-active\': active }">',
  '    <!-- 卡片标题 -->',
  '    <h3 class="card__title">{{ title }}</h3>',
  '    <t-button type="primary" @click="onClick">查看详情</t-button>',
  '  </div>',
  '</template>',
  '',
  '<scr' + 'ipt setup>',
  "import { ref } from 'vue'",
  'const active = ref(false)',
  'const props = defineProps({ title: String })',
  '</scr' + 'ipt>'
].join('\n');

const cssCode = `.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e7ecf3;
  background: #fff;
}

.card.is-active {
  border-color: #0e80eb;
  box-shadow: 0 0 0 3px rgba(14, 128, 235, 0.12);
}`;

const longCode = `// 一段较长的代码，用于演示折叠
const config = {
  size: 'default',
  primaryColor: '#0e80eb',
  radius: 10,
  theme: 'light'
}

function createProvider(cfg) {
  const merged = { ...config, ...cfg }
  return merged
}

function validate(input) {
  if (!input) return false
  if (input.length < 2) return false
  return true
}

function submit(form) {
  if (!validate(form.name)) {
    return { ok: false, reason: '名称过短' }
  }
  return { ok: true, data: createProvider(form) }
}

export { createProvider, validate, submit }`;
</script>

<style lang="scss" scoped>
.cb-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 720px;
}
</style>
