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
      { attr: 'data', type: 'Array', red: '数据源', sel: '——', def: '[]' },
      { attr: 'itemHeight', type: 'Number', red: '单项高度，传 0 切换为动态测量', sel: '——', def: '40' },
      { attr: 'height', type: 'Number / String', red: '可视区域高度', sel: '——', def: '320' },
      { attr: 'buffer', type: 'Number', red: '上下额外渲染的缓冲条数', sel: '——', def: '4' },
      { attr: 'itemKey', type: 'String', red: '唯一值字段名，缺省用索引', sel: '——', def: "''" },
      { attr: 'emptyText', type: 'String', red: '空状态文案', sel: '——', def: '暂无数据' },
      { attr: 'distance', type: 'Number', red: '触发 load-more 的底部阈值（px）', sel: '——', def: '40' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
