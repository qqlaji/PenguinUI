<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '参数', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center', width: '320px' },
      { field: 'sel', title: '可选值', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'modelValue', type: 'Boolean', red: '是否显示（v-model）', sel: 'true / false', def: 'false' },
      { attr: 'images', type: 'Array', red: '图片列表：字符串数组或 [{ src, alt, caption }]', sel: '——', def: '[]' },
      { attr: 'current', type: 'Number', red: '当前索引（v-model:current）', sel: '——', def: '0' },
      { attr: 'step', type: 'Number', red: '缩放步长', sel: '——', def: '0.25' },
      { attr: 'minScale', type: 'Number', red: '最小缩放', sel: '——', def: '0.25' },
      { attr: 'maxScale', type: 'Number', red: '最大缩放', sel: '——', def: '5' },
      { attr: 'maskClosable', type: 'Boolean', red: '点击遮罩关闭', sel: 'true / false', def: 'true' },
      { attr: 'showThumbnails', type: 'Boolean', red: '显示缩略图条', sel: 'true / false', def: 'true' },
      { attr: 'downloadable', type: 'Boolean', red: '显示下载按钮', sel: 'true / false', def: 'false' },
      { attr: 'caption', type: 'String', red: '底部标题', sel: '——', def: "''" },
      { attr: 'zIndex', type: 'Number / String', red: '层级', sel: '——', def: '2600' }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
