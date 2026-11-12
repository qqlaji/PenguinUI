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
      {
        attr: "options",
        type: "Object",
        red: "表格数据,fileds 和 datas,fileds作为整体约束（具体见下方API），datas作为数据定义",
        sel: "——",
        def: "{fileds:[], datas:[]}",
      },
      {
        attr: "size",
        type: "String",
        red: "表格尺寸大小",
        sel: "default / small / mini",
        def: "default",
      },
      {
        attr: "showHeader",
        type: "Boolean",
        red: "是否显示表头",
        sel: "true / false",
        def: "true",
      },
      {
        attr: "headStyle",
        type: "Object",
        red: "自定义表头样式",
        sel: "——",
        def: "——",
      },
      {
        attr: "rowStyle",
        type: "Object",
        red: "自定义表格内容区域的样式",
        sel: "——",
        def: "——",
      },
      {
        attr: "customClass",
        type: "String",
        red: "自定义表格组件整体的Class类名",
        sel: "——",
        def: "——",
      },
      { attr: "selectable", type: "Boolean", red: "显示行选择列（v1.16 新增）", sel: "true / false", def: "false" },
      { attr: "selectedKeys", type: "Array", red: "已选行的 key（v-model:selectedKeys）", sel: "——", def: "[]" },
      { attr: "rowKeyField", type: "String", red: "行唯一字段名，缺省用索引", sel: "——", def: "''" },
      { attr: "loading", type: "Boolean", red: "加载中，显示遮罩", sel: "true / false", def: "false" },
      { attr: "loadingText", type: "String", red: "加载中文案", sel: "——", def: "加载中..." },
      { attr: "emptyText", type: "String", red: "空状态文案", sel: "——", def: "暂无数据" },
      { attr: "striped", type: "Boolean", red: "斑马纹", sel: "true / false", def: "false" },
      { attr: "fixedHeader", type: "Boolean", red: "固定表头（配合 maxHeight）", sel: "true / false", def: "false" },
      { attr: "maxHeight", type: "Number / String", red: "表体最大高度", sel: "——", def: "''" },
      { attr: "showToolbar", type: "Boolean", red: "显示顶部工具栏（选中统计 + 插槽）", sel: "true / false", def: "false" },
      { attr: "pagination", type: "Boolean", red: "启用内置分页", sel: "true / false", def: "false" },
      { attr: "page", type: "Number", red: "当前页（v-model:page）", sel: "——", def: "1" },
      { attr: "pageSize", type: "Number", red: "每页条数", sel: "——", def: "10" },
      { attr: "clickableRow", type: "Boolean", red: "行可点击（触发 row-click）", sel: "true / false", def: "false" },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>