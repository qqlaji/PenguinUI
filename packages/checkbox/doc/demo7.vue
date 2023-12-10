<!-- html -->
<template>
  <t-space :inline="false">
    <t-checkbox
      v-model="checkboxVal"
      :options="checkOptions"
      custotColor="#09b63d"
    ></t-checkbox>
    <t-checkbox
      v-model="checkboxVal"
      :options="checkOptions"
      custotColor="#25B0F8"
    ></t-checkbox>
  </t-space>
</template>

<!-- js -->
<script setup>
import { reactive, ref } from "vue";
const checkboxVal = ref([]);
const state = reactive({
  checkOptions: [
    { label: "中国", value: "zhongguo" },
    { label: "英国", value: "yingguo" },
    { label: "德国", value: "deguo" },
    { label: "法国", value: "faguo" },
  ],
});
const { checkOptions } = state;
</script>