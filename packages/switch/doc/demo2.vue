<!-- html -->
<template>
  <t-switch v-model="switchVal" disabled></t-switch>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const switchVal = ref(true);
</script>