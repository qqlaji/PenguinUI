<template>
  <div class="st-demo2">
    <t-steps :active="2" direction="vertical">
      <t-step title="提交申请" description="2026-11-01 10:20" />
      <t-step title="初审通过" description="2026-11-02 14:08" />
      <t-step title="复审中" description="等待风控" />
      <t-step title="放款" description="待处理" />
    </t-steps>
  </div>
</template>

<script setup></script>

<style scoped>
.st-demo2 { padding: 4px 8px; }
</style>
