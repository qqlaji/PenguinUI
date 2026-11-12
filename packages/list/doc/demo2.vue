<template>
  <div class="list-demos">
    <t-space>
      <t-button size="small" @click="loading = !loading">切换 loading</t-button>
      <t-button size="small" @click="data = data.length ? [] : demoData">切换空数据</t-button>
    </t-space>

    <t-list :data="data" :loading="loading" bordered size="small">
      <template #item="{ item }">{{ item }}</template>
    </t-list>

    <t-list :data="[]" bordered>
      <template #empty>
        <div class="list-empty">
          <i class="t-icon-box"></i>
          <span>这里什么都没有</span>
        </div>
      </template>
    </t-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const demoData = ['组件文档', '交互示例', 'API 参数表'];
const data = ref([...demoData]);
const loading = ref(false);
</script>

<style lang="scss" scoped>
.list-demos {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--pui-text-4, #a8b3c2);
  i { font-size: 26px; }
  span { font-size: 13px; }
}
</style>
