<!-- html -->
<template>
  <t-dropdown title="下拉菜单" :options="dorpoptions"></t-dropdown>
</template>

<!-- js -->
<script setup>
import { reactive } from "vue";
const state = reactive({
  dorpoptions: [
    { label: "菜单1", icon: "t-icon-file" },
    { label: "菜单2", icon: "t-icon-keyboard-9" },
    { label: "菜单3", icon: "t-icon-link" },
    { label: "菜单4", icon: "t-icon-file" },
  ],
});
const { dorpoptions } = state;
</script>