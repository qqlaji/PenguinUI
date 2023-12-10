<!-- html -->
<template>
  <t-date v-model="dateVal" disabled placeholder="请选择日期"> </t-date>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const dateVal = ref("");
</script>