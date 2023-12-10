<!-- html -->
<template>
  <t-space>
    <t-date
      v-model="dateVal"
      placeholder="请选择日期"
      format="yyyy年MM月dd日"
    ></t-date>
    <t-date
      v-model="dateVal"
      placeholder="请选择日期"
      format="yyyy/MM/dd"
    ></t-date>
    <t-date
      v-model="dateVal"
      placeholder="请选择日期"
      format="yyyy-MM-dd"
    ></t-date>
  </t-space>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const dateVal = ref("");
</script>