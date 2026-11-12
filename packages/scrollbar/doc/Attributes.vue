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
      { attr: 'height', type: 'Number / String', red: '滚动区域高度，数字按 px 处理', sel: '——', def: "''" },
      { attr: 'maxHeight', type: 'Number / String', red: '滚动区域最大高度', sel: '——', def: "''" },
      { attr: 'native', type: 'Boolean', red: '使用浏览器原生滚动条', sel: 'true / false', def: 'false' },
      { attr: 'size', type: 'Number', red: '滚动条粗细（px）', sel: '——', def: '6' },
      { attr: 'always', type: 'Boolean', red: '滚动条常显', sel: 'true / false', def: 'false' },
      { attr: 'minSize', type: 'Number', red: '滑块最小长度（px）', sel: '——', def: '24' },
      { attr: 'wrapClass', type: 'String', red: '容器自定义类名', sel: '——', def: "''" },
      { attr: 'wrapStyle', type: 'Object / String', red: '容器自定义样式', sel: '——', def: '{}' },
      { attr: 'viewClass', type: 'String', red: '内容层自定义类名', sel: '——', def: "''" },
      { attr: 'viewStyle', type: 'Object / String', red: '内容层自定义样式', sel: '——', def: '{}' },
      { attr: 'noresize', type: 'Boolean', red: '关闭尺寸变化监听', sel: 'true / false', def: 'false' }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
