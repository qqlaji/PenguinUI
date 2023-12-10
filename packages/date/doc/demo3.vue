<!-- html -->
<template>
  <t-space>
    <t-date v-model="dateVal" placeholder="请选择日期"> </t-date>
    <t-date v-model="dateVal" placeholder="请选择日期" size="small"> </t-date>
    <t-date v-model="dateVal" placeholder="请选择日期" size="mini"> </t-date>
  </t-space>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const dateVal = ref("");
</script>