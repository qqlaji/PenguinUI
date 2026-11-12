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
      { attr: "title", type: "String", red: "标题", sel: "——", def: "——" },
      { attr: "extra", type: "String", red: "操作区文字", sel: "——", def: "——" },
      { attr: "column", type: "Number", red: "每行显示的字段数", sel: "——", def: "3" },
      {
        attr: "direction",
        type: "String",
        red: "排列方向",
        sel: "horizontal / vertical",
        def: "horizontal",
      },
      {
        attr: "border",
        type: "Boolean",
        red: "是否显示边框",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "size",
        type: "String",
        red: "尺寸",
        sel: "small / default / large",
        def: "default",
      },
      {
        attr: "labelWidth",
        type: "String / Number",
        red: "标签宽度（horizontal 生效）",
        sel: "——",
        def: "——",
      },
      {
        attr: "labelAlign",
        type: "String",
        red: "标签对齐",
        sel: "left / center / right",
        def: "left",
      },
      {
        attr: "contentAlign",
        type: "String",
        red: "内容对齐",
        sel: "left / center / right",
        def: "left",
      },
      { attr: "gutter", type: "Number", red: "列间距（无边框时生效）", sel: "——", def: "16" },
    ],
  },
});
const { options } = state;
</script>

<script>
export default { name: 'DescriptionsAttributes' };
</script>

<style lang="scss" scoped>
</style>
