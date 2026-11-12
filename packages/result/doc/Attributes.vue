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
      { attr: 'status', type: 'string', red: '状态：success / error / warning / info / 403 / 404 / 500', def: "'info'" },
      { attr: 'title', type: 'string', red: '标题', def: "''" },
      { attr: 'subTitle', type: 'string', red: '副标题（描述）', def: "''" },
      { attr: 'icon', type: 'string', red: '自定义图标类名，覆盖内置图标', def: "''" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
