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
      { field: 'red', title: '说明', align: 'center', width: '350px' },
      { field: 'sel', title: '可选值', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'as', type: 'String', red: '渲染的标签名', sel: '任意 HTML 标签', def: 'div' },
      { attr: 'vertical', type: 'Boolean', red: '是否纵向排列', sel: 'true / false', def: 'false' },
      { attr: 'wrap', type: 'Boolean', red: '是否允许换行', sel: 'true / false', def: 'false' },
      { attr: 'justify', type: 'String', red: '主轴对齐', sel: 'flex-start / center / flex-end / space-between / space-around / space-evenly', def: 'flex-start' },
      { attr: 'align', type: 'String', red: '交叉轴对齐', sel: 'flex-start / center / flex-end / stretch / baseline', def: 'center' },
      { attr: 'gap', type: 'Number / String', red: '子项间距，数字按 px 处理', sel: '——', def: '0' },
      { attr: 'inline', type: 'Boolean', red: '是否使用 inline-flex', sel: 'true / false', def: 'false' }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
