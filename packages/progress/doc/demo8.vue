<!-- html -->
<template>
<div class="penguin-style">
    <t-progress
      :percent="20"
      progressType="circle"
      :circleSize="120"
      isShowText
      roundCorner
    >
     <t-button type="primary" size="mini" leftIcon="t-icon-prompt" round></t-button>
    </t-progress>
    <t-progress
      :percent="40"
      bgColor="#505050"
      progressType="circle"
      :circleSize="120"
      isShowText
      roundCorner
    >progress</t-progress>
    <t-progress
      :percent="100"
      currentStatus="SUCCESS"
      progressType="circle"
      :circleSize="120"
      :circleHeight="10"
      isShowText
    >
    FULL
    </t-progress>
</div>
</template>
<style scoped>
.penguin-style{
  display: flex;
  flex-wrap: wrap;
}
.penguin-progress {
  margin-bottom: 10px;
  margin-right: 10px;
}
.penguin-button-round {
  border-radius: 50%;
}
.penguin-button-mini {
  padding: 4px;
}
</style>