<!-- html -->
<template>
    <t-progress :percent="20" roundCorner isAnimation :progressSpeed="5"></t-progress>
    <t-progress :percent="40" currentStatus="SUCCESS" roundCorner isAnimation></t-progress>
    <t-progress :percent="60" currentStatus="OTHER" roundCorner isAnimation :progressSpeed="2"></t-progress>
    <t-progress :percent="90" currentStatus="FAIL" roundCorner isAnimation :progressSpeed="1"></t-progress>
    <t-progress :percent="100" bgColor="#505050" roundCorner isAnimation :progressSpeed="6"></t-progress>
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