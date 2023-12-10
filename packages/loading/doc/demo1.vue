<!-- html -->
<template>
  <t-button @click="openLoading">开始加载</t-button>
</template>

<!-- js -->
<script setup>
import Loading from "../index.js"; //此处为本地示例，请使用import { Loading } from "penguin-ui";
const openLoading = () => {
  Loading.show();
  setTimeout(() => {
    Loading.hide();
  }, 5000);
};
</script>