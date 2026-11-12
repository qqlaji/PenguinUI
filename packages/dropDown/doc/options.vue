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
      { attr: "label", type: "String", red: "菜单名称", sel: "——", def: "——" },
      { attr: "value", type: "String / Number", red: "菜单值，用于 v-model 匹配高亮", sel: "——", def: "——" },
      { attr: "icon", type: "String", red: "菜单图标类名（可省略 iconfont 前缀）", sel: "参考图标库", def: "——" },
      { attr: "disabled", type: "Boolean", red: "是否禁用该项", sel: "true / false", def: "false" },
      { attr: "danger", type: "Boolean", red: "是否标记为危险操作（红色）", sel: "true / false", def: "false" },
      { attr: "divided", type: "Boolean", red: "在该项之前插入一条分隔线", sel: "true / false", def: "false" },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
