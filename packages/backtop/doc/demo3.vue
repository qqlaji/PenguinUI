<!-- html -->
<template>
  <t-backtop target=".penguinuirightView" :bottom="100">
    <span class="backtop">
      <i class="t-icon-direction-up"></i>
    </span>
  </t-backtop>
</template>

<style lang="scss" scoped>
.backtop {
  width: 45px;
  height: 45px;
  display: inline-block;
  border-radius: 50%;
  line-height: 45px;
  text-align: center;
  background: #f57b29;
  i {
    font-size: 20px;
    color: #fff;
  }
}
</style>