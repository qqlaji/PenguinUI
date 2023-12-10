<!-- html -->
<template>
    <t-progress :percent="20" :setPercentText="textMethod" roundCorner></t-progress>
    <t-progress :percent="40" bgColor="#505050" roundCorner>百分之40</t-progress>
    <t-progress :percent="60" currentStatus="OTHER" roundCorner><i class="t-icon-arrow-double-right"></i></t-progress>
    <t-progress :percent="90" :setPercentText="textMethod" currentStatus="FAIL" roundCorner></t-progress>
    <t-progress :percent="100" progressHeight="20" currentStatus="SUCCESS" roundCorner>
      <t-button type="success" size="mini" round>完成</t-button>
    </t-progress>
</template>
<!-- js -->
<script setup>
const textMethod = (percent) => {
  if (percent < 70) {
    return 'ing'
  }
  return 'fail'
}
</script>
<style scoped>
.penguin-progress {
  margin-bottom: 10px;
}
.penguin-button-mini {
  padding: 3px;
  font-size: 12px;
}
</style>