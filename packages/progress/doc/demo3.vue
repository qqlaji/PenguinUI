<!-- html -->
<template>
    <t-progress :percent="20" isShowText roundCorner></t-progress>
    <t-progress :percent="40" :bgColor="custotColorMethod" isShowText roundCorner></t-progress>
    <t-progress :percent="60" bgColor="#e6a23c" isShowText roundCorner></t-progress>
    <t-progress :percent="90" bgColor="#5cb87a" isShowText roundCorner></t-progress>
    <t-progress :percent="100" bgColor="#6f7ad3" isShowText roundCorner></t-progress>
</template>
<!-- js -->
<script setup>
const custotColorMethod = (percent) => {
  if (percent < 70) {
    return '#909399'
  }
  return '#67c23a'
}
</script>
<style scoped>
.penguin-progress {
  margin-bottom: 10px;
}
</style>