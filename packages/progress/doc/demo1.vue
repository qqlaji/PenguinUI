<!-- html -->
<template>
    <t-progress :percent="20"></t-progress>
    <t-progress :percent="40" bgColor="#505050"></t-progress>
    <t-progress :percent="60" currentStatus="OTHER"></t-progress>
    <t-progress :percent="90" currentStatus="FAIL"></t-progress>
    <t-progress :percent="100" currentStatus="SUCCESS"></t-progress>
</template>
<style scoped>
.penguin-progress {
  margin-bottom: 10px;
}
</style>