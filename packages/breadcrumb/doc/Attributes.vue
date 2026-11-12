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
      { attr: 'separator', type: 'string', red: '分隔符文字', def: "'/'" },
      { attr: 'separatorIcon', type: 'string', red: '分隔符图标类名，设置后优先于 separator', def: '—' },
      { attr: 'space', type: 'number', red: '分隔符左右间距(px)', def: '8' },
      { attr: 'customClass', type: 'string', red: '自定义类名', def: '—' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
