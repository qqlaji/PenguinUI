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
      { attr: 'links', type: 'array', red: '锚点项 [{ title, href }]', def: '[]' },
      { attr: 'container', type: 'string', red: '滚动容器选择器，留空自动向上查找', def: "''" },
      { attr: 'offsetTop', type: 'number', red: '滚动定位偏移(px)，用于避开固定头部', def: '80' },
      { attr: 'bounds', type: 'number', red: '判定激活的额外容差(px)', def: '5' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
