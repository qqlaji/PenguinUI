<!-- html -->
<template>
  <t-switch v-model="switchVal" @change="switchChange"></t-switch>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const switchVal = ref(false);
const switchChange = (e) => {
  console.log(e);
};
</script>