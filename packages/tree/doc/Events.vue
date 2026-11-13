<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive } from "vue";
const state = reactive({
  options: {
    fileds: [
      { field: "name", title: "事件名", align: "center" },
      { field: "red", title: "说明", align: "center", width: "300px" },
      { field: "attr", title: "回调参数", align: "center" },
    ],
    datas: [
      {
        name: "update:modelValue",
        red: "勾选集合变化（v-model）",
        attr: "keys: string[]",
      },
      {
        name: "update:selected",
        red: "高亮选中集合变化（v-model:selected）",
        attr: "keys: string[]",
      },
      {
        name: "nodeClick",
        red: "节点点击；旧版在勾选时回传勾选的节点数组",
        attr: "data | nodes[]",
      },
      {
        name: "selectClick",
        red: "节点被选中 / 勾选（兼容旧版）",
        attr: "data: object",
      },
      {
        name: "check",
        red: "勾选变化（推荐）",
        attr: "{ key, checked, keys, nodes }",
      },
      {
        name: "expand",
        red: "展开 / 收起节点",
        attr: "{ key, expanded, node }",
      },
      {
        name: "load",
        red: "异步加载完成",
        attr: "{ key, children } | { key, error }",
      },
      {
        name: "filter",
        red: "搜索关键字变化",
        attr: "keyword: string",
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
