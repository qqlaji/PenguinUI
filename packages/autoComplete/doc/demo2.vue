<template>
  <div class="ac-demo2">
    <t-auto-complete
      v-model="value"
      :options="options"
      :loading="loading"
      :trigger-on-focus="false"
      :filterable="false"
      placeholder="输入 1 个字符触发远程搜索"
      clearable
      prefix-icon="t-icon-search"
      empty-text="没有匹配的用户"
      @search="onSearch"
      @select="onSelect"
    >
      <template #footer>
        <div class="ac-demo2__footer">
          模拟远程搜索 · 共 {{ options.length }} 条结果
        </div>
      </template>
    </t-auto-complete>

    <div class="ac-demo2__result">
      选择结果：
      <t-tag v-if="picked" type="success" effect="light">{{ picked }}</t-tag>
      <t-typography v-else type="secondary">尚未选择</t-typography>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const all = [
  { value: 'blue-sf', label: 'blue-sf', description: '作者', icon: 't-icon-user' },
  { value: 'penguin-team', label: 'penguin-team', description: '团队', icon: 't-icon-user' },
  { value: 'bob', label: 'Bob', description: '前端', icon: 't-icon-user' },
  { value: 'cindy', label: 'Cindy', description: '设计', icon: 't-icon-user' },
  { value: 'david', label: 'David', description: '后端', icon: 't-icon-user' },
  { value: 'penguin-bot', label: 'penguin-bot', description: '机器人', icon: 't-icon-customer-service' }
];

const value = ref('');
const picked = ref('');
const options = ref(all.slice(0, 3));
const loading = ref(false);
let timer = null;

const onSearch = (q) => {
  clearTimeout(timer);
  const keyword = q.trim().toLowerCase();
  if (!keyword) {
    options.value = all.slice(0, 3);
    return;
  }
  loading.value = true;
  timer = setTimeout(() => {
    options.value = all.filter((u) => u.label.toLowerCase().includes(keyword));
    loading.value = false;
  }, 320);
};

const onSelect = (opt) => {
  picked.value = opt.label;
};
</script>

<style lang="scss" scoped>
.ac-demo2 {
  max-width: 420px;
}
.ac-demo2__footer {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.ac-demo2__result {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);
}
</style>
