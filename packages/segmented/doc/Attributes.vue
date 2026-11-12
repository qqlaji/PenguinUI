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
        attr: "v-model",
        type: "String / Number",
        red: "当前选中值",
        sel: "——",
        def: "——",
      },
      {
        attr: "options",
        type: "Array",
        red: "选项列表，元素可为字符串/数字或 { label, value, icon, disabled }",
        sel: "——",
        def: "[]",
      },
      {
        attr: "size",
        type: "String",
        red: "尺寸",
        sel: "small / default / large",
        def: "default",
      },
      {
        attr: "block",
        type: "Boolean",
        red: "是否撑满父级宽度",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "disabled",
        type: "Boolean",
        red: "是否整体禁用",
        sel: "true / false",
        def: "false",
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
