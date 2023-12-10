<!-- html -->
<template>
<div class="penguin-style">
    <t-progress
      :percent="percent"
      progressType="dashboard"
      :circleSize="120"
      :circleHeight="10"
      currentStatus="SUCCESS"
      isShowText
    >
    </t-progress>
    <t-progress
      :percent="percent"
      progressType="dashboard"
      :circleSize="150"
      :circleHeight="10"
      currentStatus="OTHER"
      isShowText
    >
    </t-progress>
    <t-progress
      :percent="percent"
      progressType="dashboard"
      :circleSize="200"
      :circleHeight="10"
      currentStatus="FAIL"
      isShowText
    >
    </t-progress>
</div>
</template>
<script setup>
  import {ref} from 'vue'
  const percent = ref(0)
  setTimeout(()=>{
    percent.value += 55
  },500)
</script>
<style scoped>
.penguin-style{
  display: flex;
  flex-wrap: wrap;
}
.penguin-progress {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>