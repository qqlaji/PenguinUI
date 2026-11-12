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
      { attr: 'height', type: 'number | string', red: '走马灯高度', def: '220' },
      { attr: 'autoplay', type: 'boolean', red: '是否自动切换', def: 'true' },
      { attr: 'interval', type: 'number', red: '自动切换间隔(ms)', def: '3500' },
      { attr: 'arrow', type: 'string', red: '箭头显示：always / hover / never', def: "'hover'" },
      { attr: 'indicator', type: 'string', red: '指示器显示：always / hover / never', def: "'always'" },
      { attr: 'initialIndex', type: 'number', red: '初始页码', def: '0' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
