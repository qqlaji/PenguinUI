<template>
  <t-collapse v-model="active">
    <t-collapse-item name="a" title="一致性 Consistency">
      与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言与概念。
    </t-collapse-item>
    <t-collapse-item name="b" title="反馈 Feedback">
      通过界面样式和交互动效让用户可以清晰的感知自己的操作，并在必要时提供结果反馈。
    </t-collapse-item>
    <t-collapse-item name="c" title="效率 Efficiency">
      界面简单直白，快速识别关键信息；减少不必要的操作步骤，让决策路径尽量短。
    </t-collapse-item>
  </t-collapse>
</template>

<script setup>
import { ref } from 'vue';
const active = ref(['a']);
</script>
