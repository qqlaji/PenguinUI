<template>
  <t-table :options="options"></t-table>
</template>

<script setup>
import { reactive, toRef } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '属性', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      {
            "attr": "loading",
            "type": "boolean",
            "red": "是否处于加载态",
            "def": "true"
      },
      {
            "attr": "rows",
            "type": "number",
            "red": "段落行数",
            "def": "3"
      },
      {
            "attr": "animated",
            "type": "boolean",
            "red": "是否启用流光动画",
            "def": "true"
      },
      {
            "attr": "avatar",
            "type": "boolean",
            "red": "是否显示头像占位",
            "def": "false"
      },
      {
            "attr": "avatarShape",
            "type": "string",
            "red": "circle / square",
            "def": "'circle'"
      },
      {
            "attr": "title",
            "type": "boolean",
            "red": "是否显示标题占位",
            "def": "true"
      },
      {
            "attr": "widths",
            "type": "array",
            "red": "每行宽度，如 [\"100%\",\"60%\"]",
            "def": "[]"
      }
]
  }
})
const options = toRef(state, 'options')
</script>
