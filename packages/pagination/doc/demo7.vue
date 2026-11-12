<!-- html -->
<template>
  <t-pagination
    :total="200"
    :current="5"
    :pageSize="10"
    border
    :activeColors="activeColors"
  ></t-pagination>
</template>

<!-- js -->
<script setup>
import { reactive } from "vue";
const state = reactive({
  activeColors: {
    background: "#ffffff",
    hoverBackground: "#014B88",
    borderColor: "#014B88",
    hoverBorderColor: "#005ba6",
    color: "#014B88",
    hoverColor: "#ffffff",
  },
});
const { activeColors } = state;
</script>
