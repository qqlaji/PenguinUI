<!-- html -->
<template>
  <t-switch v-model="switchVal" closeText="关闭" activeText="开启"></t-switch>
  <t-switch
    v-model="switchVal1"
    closeText="关闭"
    activeText="开启"
    textAlign="right"
  ></t-switch>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const switchVal = ref(true);
const switchVal1 = ref(true);
</script>