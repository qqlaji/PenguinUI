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
        attr: "label",
        type: "String",
        red: "默认文本展示字段，可设置 labelFiled / labelField 进行替换",
        sel: "——",
        def: "——",
      },
      {
        attr: "children",
        type: "Array",
        red: "节点子集数据",
        sel: "——",
        def: "——",
      },
      {
        attr: "disabled",
        type: "Boolean",
        red: "是否禁用该节点",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "key",
        type: "String",
        red: "节点唯一标识。不传则按路径自动生成（如 '0-2-1'）",
        sel: "——",
        def: "路径 key",
      },
      {
        attr: "isLeaf",
        type: "Boolean",
        red: "是否叶子节点。异步加载场景写 false 表示「还有子节点未加载」",
        sel: "true / false",
        def: "无 children 时自动判定",
      },
      {
        attr: "*",
        type: "任意",
        red: "其他自定义扩展字段，会通过插槽与事件原样回传",
        sel: "——",
        def: "——",
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>