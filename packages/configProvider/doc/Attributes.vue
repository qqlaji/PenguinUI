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
      { attr: 'size', type: 'String', red: '组件默认尺寸', sel: 'large / default / small', def: "''" },
      { attr: 'primaryColor', type: 'String', red: '主色，会写入 --pui-brand', sel: '——', def: "''" },
      { attr: 'radius', type: 'Number / String', red: '圆角基准，会写入 --pui-radius', sel: '——', def: "''" },
      { attr: 'theme', type: 'String', red: '主题', sel: 'light / dark', def: "''" },
      { attr: 'emptyText', type: 'String', red: '空状态文案', sel: '——', def: "''" },
      { attr: 'loadingText', type: 'String', red: '加载中文案', sel: '——', def: "''" },
      { attr: 'pageSize', type: 'Number', red: '分页默认每页条数', sel: '——', def: '0' },
      { attr: 'pageSizes', type: 'Array', red: '分页可选条数', sel: '——', def: '[]' },
      { attr: 'dateFormat', type: 'String', red: '日期格式', sel: '——', def: "''" },
      { attr: 'config', type: 'Object', red: '额外配置，浅合并到默认值上', sel: '——', def: '{}' }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
