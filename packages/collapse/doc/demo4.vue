<!-- html -->
<template>
  <t-space>
    <t-input v-model="value1" leftIcon="t-icon-search"></t-input>
    <t-input v-model="value2" rightIcon="t-icon-calendar"></t-input>
  </t-space>
</template>

<!-- js -->
<script setup>
  import { ref } from "vue";
  const value1 = ref('')
  const value2 = ref('')
</script>