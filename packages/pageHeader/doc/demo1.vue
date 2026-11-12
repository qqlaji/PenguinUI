<template>
  <div class="ph-demo">
    <t-page-header
      title="组件详情"
      sub-title="v1.15.0"
      :breadcrumb="crumbs"
      @back="onBack"
      @crumb-click="onCrumb"
    >
      <template #extra>
        <t-button size="small">取消</t-button>
        <t-button size="small" type="primary">保存</t-button>
      </template>
      <template #tags>
        <t-tag type="success" effect="light" size="small">已启用</t-tag>
        <t-tag effect="light" size="small">常规</t-tag>
      </template>
      <template #content>
        页头把「返回、面包屑、标题、操作区」收拢成一套固定结构，避免每个页面各写一份标题栏。
      </template>
    </t-page-header>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const crumbs = [
  { title: '首页', path: '/penguinui/install' },
  { title: '组件', path: '/penguinui/button' },
  { title: '详情' }
];

const onBack = () => proxy.$message({ text: '触发 back 事件', type: 'info', timeout: 1400 });
const onCrumb = (item) => proxy.$message({ text: `点击面包屑：${item.title}`, type: 'info', timeout: 1400 });
</script>

<style lang="scss" scoped>
.ph-demo {
  max-width: 720px;
}
</style>
