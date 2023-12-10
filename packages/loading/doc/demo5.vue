<!-- html -->
<template>
  <t-button @click="openLoading">更多自定义配置项</t-button>
</template>

<!-- js -->
<script setup>
  import Loading from "../index.js"; //此处为本地示例，请使用import { Loading } from "penguin-ui";
  const openLoading = () => {
    Loading.show({
      text:'正在加载penguin-ui...',
      icon:'t-icon-loading3',
      scrollLock:true,
      textColor:'#333',
      bgColor:"rgba(248,253,255,.9)",
      showIcon:true,
    })
    setTimeout(()=>{
      Loading.hide()
    },5000)
  }
</script>