<!-- html -->
<template>
  <t-button @click="openLoading">自定义加载图片</t-button>
</template>

<!-- js -->
<script setup>
  import Loading from "../index.js"; //此处为本地示例，请使用 import { Loading } from "penguinui";
  const openLoading = () => {
    Loading.show({
      text:"正在努力加载中...",
      // 使用本地资源，避免依赖已失效的外部域名
      img: new URL("../../../src/assets/logo.png", import.meta.url).href
    })
    setTimeout(()=>{
      Loading.hide()
    },5000)
  }
</script>