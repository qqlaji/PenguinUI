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
      { attr: 'modelValue', type: 'string', red: '绑定值，格式 HH:mm 或 HH:mm:ss', def: "''" },
      { attr: 'format', type: 'string', red: '格式：HH:mm / HH:mm:ss', def: "'HH:mm'" },
      { attr: 'clearable', type: 'boolean', red: '是否可清空', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'placeholder', type: 'string', red: '占位文本', def: "'选择时间'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
