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
  min-height: 100vh;
}
</style>
