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
        type: "Date / String",
        red: "选中日期（YYYY-MM-DD）",
        sel: "——",
        def: "——",
      },
      {
        attr: "firstDayOfWeek",
        type: "Number",
        red: "每周第一天，0 为周日、1 为周一",
        sel: "0 ~ 6",
        def: "1",
      },
      {
        attr: "showToday",
        type: "Boolean",
        red: "是否显示「今天」按钮",
        sel: "true / false",
        def: "true",
      },
      {
        attr: "disabledDate",
        type: "Function",
        red: "禁用日期，返回 true 表示禁用",
        sel: "(date) => boolean",
        def: "——",
      },
      {
        attr: "size",
        type: "String",
        red: "尺寸",
        sel: "default / small",
        def: "default",
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
