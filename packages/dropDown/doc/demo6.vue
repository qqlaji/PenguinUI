<!-- html -->
<template>
  <t-space>
    <t-dropdown
      v-model="current"
      title="更多操作"
      trigger="click"
      :options="dorpoptions"
      @change="dropchange"
    ></t-dropdown>

    <t-dropdown title="禁用状态" :options="dorpoptions" disabled></t-dropdown>

    <t-dropdown title="点击唤醒" trigger="click" :options="dorpoptions"></t-dropdown>
  </t-space>
  <p class="dropdown-demo__tip">当前选择：{{ current || "未选择" }}</p>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";

const current = ref("");

const dorpoptions = [
  { label: "查看详情", icon: "t-icon-search", value: "detail" },
  { label: "复制", icon: "t-icon-copy", value: "copy" },
  { label: "重命名", icon: "t-icon-edit", value: "rename" },
  { divided: true },
  { label: "下载", icon: "t-icon-download", value: "download" },
  { label: "暂不可用", icon: "t-icon-refresh", value: "disabled", disabled: true },
  { divided: true },
  { label: "删除", icon: "t-icon-delete", value: "delete", danger: true }
];

const dropchange = (item) => {
  current.value = item.label;
};
</script>

<style lang="scss" scoped>
.dropdown-demo__tip {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #8b97a8);
}
</style>
