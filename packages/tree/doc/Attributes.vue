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
        type: "Array",
        red: "绑定树形组件的数据,具体见下方 options 配置",
        sel: "——",
        def: "[]",
      },
      {
        attr: "labelFiled",
        type: "String",
        red: "标签字段名，用于匹配不同数据格式（新写法 labelField）",
        sel: "——",
        def: "label",
      },
      {
        attr: "childrenField",
        type: "String",
        red: "子节点字段名",
        sel: "——",
        def: "children",
      },
      {
        attr: "checkable",
        type: "Boolean",
        red: "开启复选框（与 multiple 等价，语义更清晰）",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "multiple",
        type: "Boolean",
        red: "是否可选择（旧版入口，等价于 checkable）",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "modelValue",
        type: "Array",
        red: "已勾选的节点 key（v-model）",
        sel: "——",
        def: "[]",
      },
      {
        attr: "selected",
        type: "Array",
        red: "高亮选中的节点 key（v-model:selected）",
        sel: "——",
        def: "[]",
      },
      {
        attr: "checkStrictly",
        type: "Boolean",
        red: "父子勾选不联动",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "onlyLeafCheckable",
        type: "Boolean",
        red: "只允许勾选叶子节点",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "defaultOpenNodes",
        type: "Array",
        red: "默认展开节点 key（路径写法如 '0-2'）",
        sel: "——",
        def: "[]",
      },
      {
        attr: "defaultSelectNodes",
        type: "Array",
        red: "默认选中节点 key",
        sel: "——",
        def: "[]",
      },
      {
        attr: "filterable",
        type: "Boolean",
        red: "显示搜索框",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "filterPlaceholder",
        type: "String",
        red: "搜索框占位文案",
        sel: "——",
        def: "搜索节点",
      },
      {
        attr: "expandOnFilter",
        type: "Boolean",
        red: "搜索时自动展开命中节点的祖先",
        sel: "true / false",
        def: "true",
      },
      {
        attr: "showToolbar",
        type: "Boolean",
        red: "显示展开全部 / 收起全部工具栏",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "lazy",
        type: "Boolean",
        red: "子节点在首次展开时才加载",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "loadData",
        type: "Function",
        red: "异步加载子节点：(node) => Promise<children[]>",
        sel: "——",
        def: "null",
      },
      {
        attr: "icon",
        type: "String",
        red: "父节点图标类名",
        sel: "——",
        def: "t-icon-file-common-filling",
      },
      {
        attr: "openedIcon",
        type: "String",
        red: "父节点展开后的图标类名",
        sel: "——",
        def: "t-icon-file-common",
      },
      {
        attr: "leafIcon",
        type: "String",
        red: "叶子节点图标类名",
        sel: "——",
        def: "''",
      },
      {
        attr: "indent",
        type: "Number",
        red: "每层缩进宽度（px）",
        sel: "——",
        def: "16",
      },
      {
        attr: "maxHeight",
        type: "Number / String",
        red: "树体最大高度，超出滚动",
        sel: "——",
        def: "''",
      },
      {
        attr: "emptyText",
        type: "String",
        red: "空状态文案",
        sel: "——",
        def: "暂无数据",
      },
      {
        attr: "disabled",
        type: "Boolean",
        red: "禁用整棵树",
        sel: "true / false",
        def: "false",
      },
      {
        attr: "customClass",
        type: "String",
        red: "自定义组件类名",
        sel: "——",
        def: "''",
      },
    ],
  },
});
const { options } = state;
</script>

<style lang="scss" scoped></style>
