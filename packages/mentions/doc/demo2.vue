<template>
  <div class="mt-demo2">
    <t-mentions
      v-model="topics"
      prefix="#"
      split=" "
      :options="tags"
      :rows="3"
      placeholder="输入 # 选择话题标签"
    >
      <template #option="{ option }">
        <span class="mt-demo2__hash">#</span>
        <span class="mt-demo2__label">{{ option.label }}</span>
        <span class="mt-demo2__count">{{ option.description }}</span>
      </template>
    </t-mentions>

    <t-mentions
      v-model="mention"
      :filterable="false"
      :options="plain"
      :rows="3"
      placeholder="不开启过滤：输入 @ 展示全部候选"
      class="mt-demo2__second"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const topics = ref('#组件库 的文档还在持续补齐');
const mention = ref('');

const tags = [
  { value: '组件库', label: '组件库', description: '128 篇' },
  { value: '设计规范', label: '设计规范', description: '36 篇' },
  { value: 'Vue3', label: 'Vue3', description: '92 篇' },
  { value: '更新日志', label: '更新日志', description: '18 篇' }
];

const plain = ['阿吉', '布朗', '陈曦', '大卫'];
</script>

<style lang="scss" scoped>
.mt-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 520px;
}
.mt-demo2__hash {
  flex: none;
  color: var(--pui-brand, #0e80eb);
  font-weight: 600;
}
.mt-demo2__label {
  flex: 1;
  min-width: 0;
}
.mt-demo2__count {
  flex: none;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
