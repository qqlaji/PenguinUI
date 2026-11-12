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
      { attr: 'modelValue', type: 'array', red: '绑定值（选中节点 value 路径数组）', def: '[]' },
      { attr: 'options', type: 'array', red: '数据源，{ value, label, children } 嵌套结构', def: '[]' },
      { attr: 'changeOnSelect', type: 'boolean', red: '是否允许选择任意层级', def: 'false' },
      { attr: 'clearable', type: 'boolean', red: '是否可清空', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'separator', type: 'string', red: '展示分隔符', def: "' / '" },
      { attr: 'size', type: 'string', red: '尺寸：small / default / large', def: "'default'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
