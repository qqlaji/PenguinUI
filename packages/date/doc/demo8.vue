<!-- html -->
<template>
  <t-space>
    <t-date
      v-model="dateVal"
      placeholder="请选择日期"
      customActiveColor="#09b63d"
    >
    </t-date>

    <t-date
      v-model="dateVal"
      placeholder="请选择日期"
      customActiveColor="#f57b29"
    >
    </t-date>
  </t-space>
</template>

<!-- js -->
<script setup>
import { ref } from "vue";
const dateVal = ref("");
</script>