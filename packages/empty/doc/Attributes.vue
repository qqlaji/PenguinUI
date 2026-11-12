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
            "attr": "description",
            "type": "string",
            "red": "描述文字",
            "def": "'暂无数据'"
      },
      {
            "attr": "imageSize",
            "type": "number",
            "red": "插画宽度（px）",
            "def": "140"
      }
]
  }
})
const options = toRef(state, 'options')
</script>
