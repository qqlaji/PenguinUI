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
      { attr: 'modelValue', type: 'string | number | array', red: '绑定值；multiple 时为数组', def: 'null' },
      { attr: 'options', type: 'array', red: '树形数据 [{ label, value, children, disabled }]', def: '[]' },
      { attr: 'multiple', type: 'boolean', red: '是否多选（标签展示）', def: 'false' },
      { attr: 'filterable', type: 'boolean', red: '是否可搜索', def: 'false' },
      { attr: 'clearable', type: 'boolean', red: '是否可清空', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'placeholder', type: 'string', red: '占位文案', def: "'请选择'" },
      { attr: 'size', type: 'string', red: 'small / default / large', def: "'default'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
