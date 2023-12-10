<!-- html -->
<template>
  <t-select
    v-model="selVal"
    placeholder="可搜索"
    :options="selOptions"
    searchable
  ></t-select>
</template>

<!-- js -->
<script setup>
import { reactive, ref } from "vue";
const selVal = ref("");
const state = reactive({
  selOptions: [
    { label: "中国", value: "1" },
    { label: "Node", value: "Node" },
    { label: "CSS", value: "CSS" },
    { label: "javascript", value: "javascript" },
    { label: "penguin-ui", value: "penguin-ui" },
    { label: "penguin-vi", value: "penguin-vi" },
    { label: "Npm", value: "Npm" },
    { label: "HTML", value: "HTML", disabled: true },
    { label: "java", value: "java" },
    { label: "XML", value: "XML" },
    { label: "penguin-ci", value: "penguin-ci" },
  ],
});
const { selOptions } = state;
</script>