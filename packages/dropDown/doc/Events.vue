<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive } from "vue";
const state = reactive({
  options: {
    fileds: [
      { field: "name", title: "事件名", align: "center" },
      { field: "red", title: "说明", align: "center", width: "350px" },
      { field: "attr", title: "回调参数", align: "center" },
      { field: "exm", title: "示例", align: "center", width: "350px" },
    ],
    datas: [
      {
        name: "change",
        red: "点击菜单项时触发",
        attr: "(item, index)",
        exm: '@change="(item, i) => console.log(item, i)"',
      },
      {
        name: "update:modelValue",
        red: "选中值变化（配合 v-model 使用）",
        attr: "(value)",
        exm: 'v-model="current"',
      },
      {
        name: "visible-change",
        red: "浮层展开 / 收起时触发",
        attr: "(visible: boolean)",
        exm: '@visible-change="(v) => console.log(v)"',
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped>
</style>
