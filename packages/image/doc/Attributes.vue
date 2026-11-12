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
      { attr: "src", type: "String", red: "图片地址", sel: "——", def: "——" },
      { attr: "alt", type: "String", red: "替代文本", sel: "——", def: "——" },
      { attr: "width", type: "String / Number", red: "宽度", sel: "——", def: "——" },
      { attr: "height", type: "String / Number", red: "高度", sel: "——", def: "——" },
      {
        attr: "fit",
        type: "String",
        red: "填充方式（object-fit）",
        sel: "fill / contain / cover / none / scale-down",
        def: "fill",
      },
      { attr: "round", type: "Boolean", red: "是否圆形", sel: "true / false", def: "false" },
      { attr: "radius", type: "String / Number", red: "圆角，覆盖默认 10px", sel: "——", def: "——" },
      { attr: "lazy", type: "Boolean", red: "是否懒加载", sel: "true / false", def: "false" },
      { attr: "preview", type: "Boolean", red: "是否开启点击预览", sel: "true / false", def: "true" },
      {
        attr: "previewSrcList",
        type: "Array",
        red: "预览图列表",
        sel: "——",
        def: "[]",
      },
      { attr: "initialIndex", type: "Number", red: "预览起始索引", sel: "——", def: "0" },
      { attr: "zIndex", type: "Number", red: "预览层层级", sel: "——", def: "3000" },
      {
        attr: "closeOnClickMask",
        type: "Boolean",
        red: "点击遮罩是否关闭",
        sel: "true / false",
        def: "true",
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
