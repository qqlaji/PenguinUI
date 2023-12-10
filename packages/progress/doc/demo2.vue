<!-- html -->
<template>
    <t-progress :progressHeight="26" :percent="20" isShowText></t-progress>
    <t-progress :progressHeight="26" :percent="40" bgColor="#505050" isShowText></t-progress>
    <t-progress :progressHeight="26" :percent="60" currentStatus="OTHER" isShowText></t-progress>
    <t-progress :progressHeight="26" :percent="90" currentStatus="FAIL" isShowText></t-progress>
    <t-progress :progressHeight="26" :percent="100" currentStatus="SUCCESS" isShowText></t-progress>
</template>
<style scoped>
.penguin-progress {
  margin-bottom: 10px;
}
</style>