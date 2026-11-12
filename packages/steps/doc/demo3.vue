<template>
  <t-steps :active="1" align-center>
    <t-step title="上传" icon="t-icon-upload" />
    <t-step title="解析" icon="t-icon-switch" />
    <t-step title="完成" />
    <t-step title="失败节点" status="error" />
  </t-steps>
</template>

<script setup></script>

<style scoped></style>
