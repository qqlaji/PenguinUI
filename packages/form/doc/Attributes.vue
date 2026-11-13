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
      { attr: 'model', type: 'object', red: '表单数据对象（v-model 载体）', def: '{}' },
      { attr: 'rules', type: 'object', red: '校验规则，按 prop 键分组', def: '{}' },
      { attr: 'labelWidth', type: 'string | number', red: '表单域标签宽度', def: "''" },
      { attr: 'labelPosition', type: 'string', red: '标签位置：right / left / top', def: "'right'" },
      { attr: 'inline', type: 'boolean', red: '行内表单模式', def: 'false' },
      { attr: 'disabled', type: 'boolean', red: '禁用整个表单', def: 'false' },
      { attr: 'showMessage', type: 'boolean', red: '是否显示校验错误信息', def: 'true' },
      { attr: 'scrollToError', type: 'boolean', red: '校验失败时滚动到第一个错误字段', def: 'false' },
      { attr: 'scrollOffset', type: 'number', red: 'scrollToError 的滚动偏移量（px）', def: '60' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
