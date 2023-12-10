<!-- html -->
<template>
  <t-switch v-model="switchVal" :showTipsText="true"></t-switch>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const switchVal = ref(false);
</script>