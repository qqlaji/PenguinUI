<template>
  <div class="ac-demo">
    <t-auto-complete
      v-model="value"
      :options="options"
      placeholder="输入关键词，如 penguin"
      clearable
      prefix-icon="t-icon-search"
      @select="onSelect"
    />

    <div class="ac-demo__result">
      当前值：<t-typography code>{{ value || '（空）' }}</t-typography>
      <span v-if="picked" class="ac-demo__picked">已选：{{ picked }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const picked = ref('');

const options = [
  { value: 'penguinui', label: 'PenguinUI', description: '组件库' },
  { value: 'penguin', label: 'Penguin', description: '企鹅' },
  { value: 'vue', label: 'Vue 3', description: '框架' },
  { value: 'vite', label: 'Vite', description: '构建工具' },
  { value: 'typescript', label: 'TypeScript', description: '语言' },
  { value: 'sass', label: 'Sass', description: '预处理器' },
  { value: 'pnpm', label: 'pnpm', description: '包管理器' }
];

const onSelect = (opt) => {
  picked.value = `${opt.label} → ${opt.value}`;
};
</script>

<style lang="scss" scoped>
.ac-demo {
  max-width: 420px;
}
.ac-demo__result {
  margin-top: 12px;
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);
}
.ac-demo__picked {
  margin-left: 12px;
  color: var(--pui-brand, #0e80eb);
}
</style>
