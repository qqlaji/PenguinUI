<template>
  <headerBlockVue />
  <router-view></router-view>
  <siteSearchVue />
</template>

<script setup>
import headerBlockVue from "./components/header-block.vue";
import siteSearchVue from "./components/site-search.vue";
</script>
<style lang="scss">
@import "./styles/style.scss";
#app {
  // 用 100% 跟随 html 高度；文档页自身是 calc(100vh - 顶栏)，若这里再用 100vh
  // 两者相加会超出视口 67px，导致整页出现多余的外层滚动条
  min-height: 100%;
}
</style>
