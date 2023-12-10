<template>
  <div class="penguin-row-default"><slot></slot></div>
</template>
<script>
export default{
  name:"tRow"
}
</script>
<script setup>

</script>

<style lang="scss" scoped>
.penguin-row-default{
  width:100%;
  height:auto;
  box-sizing: border-box;
  overflow: hidden;
}
</style>