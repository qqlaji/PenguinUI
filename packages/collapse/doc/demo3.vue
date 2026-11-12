<template>
  <t-collapse v-model="active" borderless>
    <t-collapse-item name="custom">
      <template #title>
        <span class="custom-title"><i class="iconfont t-icon-cat-display"></i> 自定义标题插槽</span>
      </template>
      通过 `#title` 插槽可以放入图标、标签或任意结构；`borderless` 去掉外层边框，适合嵌入卡片或侧栏。
    </t-collapse-item>
    <t-collapse-item name="disabled" title="禁用面板" disabled>
      此面板不可展开。
    </t-collapse-item>
  </t-collapse>
</template>

<script setup>
import { ref } from 'vue';
const active = ref(['custom']);
</script>

<style scoped lang="scss">
.custom-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  & i { color: var(--pui-cat-display, #087a52); }
}
</style>
