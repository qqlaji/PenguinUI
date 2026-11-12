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
      { attr: 'modelValue', type: 'number', red: '绑定值（v-model）', def: '—' },
      { attr: 'min', type: 'number', red: '最小值', def: '-Infinity' },
      { attr: 'max', type: 'number', red: '最大值', def: 'Infinity' },
      { attr: 'step', type: 'number', red: '步进', def: '1' },
      { attr: 'precision', type: 'number', red: '保留小数位数（默认按 step 推断）', def: '—' },
      { attr: 'controls', type: 'boolean', red: '是否显示加减按钮', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'size', type: 'string', red: '尺寸：small / default / large', def: "'default'" },
      { attr: 'placeholder', type: 'string', red: '空值占位文本', def: "'请输入数字'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
