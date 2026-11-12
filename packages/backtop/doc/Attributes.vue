<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive } from "vue";
const state = reactive({
  options: {
    fileds: [
      { field: "attr", title: "参数", align: "center" },
      { field: "type", title: "类型", align: "center" },
      { field: "red", title: "说明", align: "center", width: "350px" },
      { field: "sel", title: "可选值", align: "center" },
      { field: "def", title: "默认值", align: "center" },
    ],
    datas: [
      { attr: "target", type: "String", red: "监听滚动的容器：body / window 或任意 CSS 选择器", sel: "——", def: "body" },
      { attr: "visibilityHeight", type: "Number", red: "滚动超过该距离才显示，设为 0 则始终显示", sel: "——", def: "240" },
      { attr: "right", type: "Number", red: "组件距离右侧的距离（px）", sel: "——", def: "24" },
      { attr: "bottom", type: "Number", red: "组件距离底部的距离（px）", sel: "——", def: "40" },
      { attr: "fixed", type: "Boolean", red: "true 固定到视口；false 相对定位，适合内嵌在演示容器中", sel: "true / false", def: "true" },
      { attr: "customClass", type: "String", red: "自定义组件类名", sel: "——", def: "——" },
    ],
  },
});
const { options } = state;
</script>
