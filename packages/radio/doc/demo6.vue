<!-- html -->
<template>
  <t-space :inline="false">
    <t-radio
      v-model="radioVal"
      :options="radioOptions"
      custotColor="#09b63d"
    ></t-radio>
    <t-radio
      v-model="radioVal"
      :options="radioOptions"
      custotColor="#25B0F8"
    ></t-radio>
  </t-space>
</template>

<!-- js -->
<script setup>
import { reactive, ref } from "vue";
const radioVal = ref("zhongguo");
const state = reactive({
  radioOptions: [
    { label: "中国", value: "zhongguo" },
    { label: "英国", value: "yingguo" },
    { label: "德国", value: "deguo" },
    { label: "法国", value: "faguo" },
  ],
});
const { radioOptions } = state;
</script>