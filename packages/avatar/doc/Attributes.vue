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
            "attr": "size",
            "type": "number | string",
            "red": "large / default / small / 像素值",
            "def": "'default'"
      },
      {
            "attr": "shape",
            "type": "string",
            "red": "circle / square",
            "def": "'circle'"
      },
      {
            "attr": "src",
            "type": "string",
            "red": "图片地址",
            "def": "''"
      },
      {
            "attr": "alt",
            "type": "string",
            "red": "图片替代文本，同时作为文字回退",
            "def": "''"
      },
      {
            "attr": "icon",
            "type": "string",
            "red": "图标类名，如 t-icon-user",
            "def": "''"
      },
      {
            "attr": "text",
            "type": "string",
            "red": "文字内容",
            "def": "''"
      },
      {
            "attr": "fit",
            "type": "string",
            "red": "图片 object-fit",
            "def": "'cover'"
      },
      {
            "attr": "bgColor",
            "type": "string",
            "red": "背景色",
            "def": "'#e8f1fd'"
      },
      {
            "attr": "color",
            "type": "string",
            "red": "文字 / 图标颜色",
            "def": "'#0e80eb'"
      },
      {
            "attr": "bordered",
            "type": "boolean",
            "red": "是否显示描边",
            "def": "false"
      }
]
  }
})
const options = toRef(state, 'options')
</script>
