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
            "attr": "title",
            "type": "string",
            "red": "卡片标题",
            "def": "''"
      },
      {
            "attr": "shadow",
            "type": "string",
            "red": "always / hover / never",
            "def": "'always'"
      },
      {
            "attr": "bordered",
            "type": "boolean",
            "red": "是否显示边框",
            "def": "true"
      },
      {
            "attr": "hoverable",
            "type": "boolean",
            "red": "悬停时是否上浮",
            "def": "false"
      },
      {
            "attr": "bodyStyle",
            "type": "object | string",
            "red": "内容区自定义样式",
            "def": "{}"
      }
]
  }
})
const options = toRef(state, 'options')
</script>
