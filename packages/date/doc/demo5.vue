<!-- html -->
<template>
  <t-date v-model="dateVal" placeholder="请选择日期" type="month"> </t-date>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const dateVal = ref("");
</script>