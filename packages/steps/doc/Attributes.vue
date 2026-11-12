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
      { attr: 'active', type: 'number', red: '当前激活步骤索引（从 0 开始）', def: '0' },
      { attr: 'direction', type: 'string', red: '排列方向：horizontal / vertical', def: "'horizontal'" },
      { attr: 'alignCenter', type: 'boolean', red: '标题与描述居中', def: 'false' },
      { attr: 'finishStatus', type: 'string', red: '已完成步骤状态（默认 finish）', def: "'finish'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
