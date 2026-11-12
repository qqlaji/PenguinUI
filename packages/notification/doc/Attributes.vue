<template>
  <t-table :options="options"></t-table>
</template>

<script setup>
import { reactive, toRef } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '参数', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'title', type: 'string', red: '通知标题', def: "''" },
      { attr: 'message', type: 'string', red: '通知正文', def: "''" },
      { attr: 'type', type: 'string', red: '类型：info/success/warning/error', def: "'info'" },
      { attr: 'duration', type: 'number', red: '自动关闭延时(ms)，0 表示不自动关闭', def: '4500' },
      { attr: 'closable', type: 'boolean', red: '是否显示关闭按钮', def: 'true' },
      { attr: 'showIcon', type: 'boolean', red: '是否显示左侧图标', def: 'true' },
      { attr: 'onClose', type: 'function', red: '关闭时回调', def: '—' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
