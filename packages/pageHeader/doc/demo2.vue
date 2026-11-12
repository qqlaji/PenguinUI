<template>
  <div class="ph-demo2">
    <t-page-header
      title="轻量模式（ghost）"
      sub-title="不占背景，适合直接贴在页面顶部"
      show-back
      back-text="返回列表"
      ghost
      @back="onBack"
    />

    <t-divider />

    <t-page-header
      title="紧凑模式（compact）"
      sub-title="用于弹窗、抽屉内部"
      compact
      ghost
      :breadcrumb="[{ title: '设置' }, { title: '通知' }]"
    >
      <template #extra>
        <t-switch v-model="enabled" />
      </template>
    </t-page-header>

    <t-divider />

    <t-page-header
      title="带页脚操作区"
      sub-title="footer 插槽通常放提交 / 重置"
      compact
    >
      <template #content>
        表单类页面把主要操作放页脚，可以保证按钮位置在不同内容高度下始终一致。
      </template>
      <template #footer>
        <div class="ph-demo2__footer">
          <t-button size="small">重置</t-button>
          <t-button size="small" type="primary">提交</t-button>
        </div>
      </template>
    </t-page-header>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();
const enabled = ref(true);

const onBack = () => proxy.$message({ text: '返回列表', type: 'info', timeout: 1400 });
</script>

<style lang="scss" scoped>
.ph-demo2 {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 720px;
}
.ph-demo2__footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
