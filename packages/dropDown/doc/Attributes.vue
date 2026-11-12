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
      { attr: "v-model", type: "String / Number", red: "当前选中项的值，用于高亮", sel: "——", def: "——" },
      { attr: "title", type: "String", red: "下拉菜单标题", sel: "——", def: "——" },
      { attr: "size", type: "String", red: "尺寸大小", sel: "default / small / mini", def: "default" },
      { attr: "options", type: "Array", red: "下拉菜单数据配置，具体见下方 options API", sel: "——", def: "[]" },
      { attr: "trigger", type: "String", red: "唤醒方式", sel: "hover / click", def: "hover" },
      { attr: "icon", type: "String", red: "触发器左侧图标类名", sel: "参考图标库", def: "——" },
      { attr: "placement", type: "String", red: "浮层弹出位置", sel: "bottom-start / bottom / bottom-end", def: "bottom-start" },
      { attr: "disabled", type: "Boolean", red: "是否禁用", sel: "true / false", def: "false" },
      { attr: "hideOnClick", type: "Boolean", red: "选中后是否自动收起", sel: "true / false", def: "true" },
      { attr: "maxHeight", type: "Number / String", red: "选项列表最大高度，超出滚动", sel: "——", def: "260" },
      { attr: "customClass", type: "String", red: "自定义下拉菜单类名", sel: "——", def: "——" },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
