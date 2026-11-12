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
            "attr": "modelValue",
            "type": "number",
            "red": "当前分值（v-model）",
            "def": "0"
      },
      {
            "attr": "count",
            "type": "number",
            "red": "星星数量",
            "def": "5"
      },
      {
            "attr": "allowHalf",
            "type": "boolean",
            "red": "是否允许半星",
            "def": "false"
      },
      {
            "attr": "readonly",
            "type": "boolean",
            "red": "只读（可展示，不可修改）",
            "def": "false"
      },
      {
            "attr": "disabled",
            "type": "boolean",
            "red": "禁用",
            "def": "false"
      },
      {
            "attr": "size",
            "type": "number | string",
            "red": "图标尺寸",
            "def": "24"
      },
      {
            "attr": "color",
            "type": "string",
            "red": "选中颜色",
            "def": "'#f7ba2a'"
      },
      {
            "attr": "voidColor",
            "type": "string",
            "red": "未选中颜色",
            "def": "'#dce3ec'"
      },
      {
            "attr": "showText",
            "type": "boolean",
            "red": "是否显示辅助文案",
            "def": "false"
      },
      {
            "attr": "texts",
            "type": "array",
            "red": "每一档对应的文案",
            "def": "['极差','失望','一般','满意','惊喜']"
      }
]
  }
})
const options = toRef(state, 'options')
</script>
