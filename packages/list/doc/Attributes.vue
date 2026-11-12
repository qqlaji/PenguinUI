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
      { attr: 'data', type: 'Array', red: '列表数据', sel: '——', def: '[]' },
      { attr: 'bordered', type: 'Boolean', red: '是否显示外边框', sel: 'true / false', def: 'false' },
      { attr: 'split', type: 'Boolean', red: '是否显示条目分隔线', sel: 'true / false', def: 'true' },
      { attr: 'size', type: 'String', red: '尺寸', sel: 'small / default / large', def: 'default' },
      { attr: 'header', type: 'String', red: '头部文字（也可用 header 插槽）', sel: '——', def: "''" },
      { attr: 'footer', type: 'String', red: '底部文字（也可用 footer 插槽）', sel: '——', def: "''" },
      { attr: 'loading', type: 'Boolean', red: '加载态', sel: 'true / false', def: 'false' },
      { attr: 'loadingText', type: 'String', red: '加载中文案', sel: '——', def: '加载中...' },
      { attr: 'emptyText', type: 'String', red: '空数据文案', sel: '——', def: '暂无数据' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
