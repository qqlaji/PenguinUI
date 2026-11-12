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
      { attr: 'offsetTop', type: 'number', red: '距顶部多少像素时固定', def: '0' },
      { attr: 'offsetBottom', type: 'number', red: '距底部多少像素时固定（优先级高于 offsetTop）', def: '0' },
      { attr: 'target', type: 'string', red: '滚动容器选择器，默认监听 window', def: "''" },
      { attr: 'zIndex', type: 'number', red: '固定时的层级', def: '100' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
