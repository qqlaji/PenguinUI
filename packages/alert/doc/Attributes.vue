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
            "attr": "type",
            "type": "string",
            "red": "info / success / warning / danger / primary",
            "def": "'info'"
      },
      {
            "attr": "title",
            "type": "string",
            "red": "标题，也可通过 title 插槽自定义",
            "def": "''"
      },
      {
            "attr": "description",
            "type": "string",
            "red": "描述文字，也可通过默认插槽自定义",
            "def": "''"
      },
      {
            "attr": "showIcon",
            "type": "boolean",
            "red": "是否显示类型图标",
            "def": "false"
      },
      {
            "attr": "closable",
            "type": "boolean",
            "red": "是否显示关闭按钮",
            "def": "false"
      },
      {
            "attr": "center",
            "type": "boolean",
            "red": "文字是否居中",
            "def": "false"
      },
      {
            "attr": "effect",
            "type": "string",
            "red": "light / dark",
            "def": "'light'"
      },
      {
            "attr": "round",
            "type": "boolean",
            "red": "是否使用大圆角",
            "def": "false"
      }
]
  }
})
const options = toRef(state, 'options')
</script>
