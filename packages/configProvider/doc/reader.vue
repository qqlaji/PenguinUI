<template>
  <div class="cp-reader">
    <t-typography type="secondary" size="small">
      useConfig() 读到的值：primaryColor = {{ config.primaryColor }}，size = {{ config.size }}，radius = {{ config.radius }}，emptyText = {{ config.emptyText }}
    </t-typography>
  </div>
</template>

<script setup>
import { useConfig } from '../../configProvider/config';

// 必须在 ConfigProvider 的子组件里调用才能拿到注入值
const { config } = useConfig();
</script>

<style lang="scss" scoped>
.cp-reader {
  padding-top: 8px;
  border-top: 1px solid var(--pui-border, #eef2f7);
}
</style>
