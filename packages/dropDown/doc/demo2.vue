<!-- html -->
<template>
  <t-space>
    <t-dropdown title="默认大小" :options="dorpoptions"></t-dropdown>
    <t-dropdown
      title="小一点的"
      :options="dorpoptions"
      size="small"
    ></t-dropdown>
    <t-dropdown
      title="更小点的"
      :options="dorpoptions"
      size="mini"
    ></t-dropdown>
  </t-space>
</template>

<!-- js -->
<script setup>
import { reactive } from "vue";
const state = reactive({
  dorpoptions: [
    { label: "菜单1" },
    { label: "菜单2" },
    { label: "菜单3" },
    { label: "菜单4" },
    { label: "菜单5" },
  ],
});
const dropchange = (item, index) => {
  console.log(item, index);
};
const { dorpoptions } = state;
</script>