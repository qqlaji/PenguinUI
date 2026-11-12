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
      { attr: 'modelValue', type: 'number | number[]', red: '绑定值（v-model）；range 时为 [start, end]', def: '0' },
      { attr: 'min', type: 'number', red: '最小值', def: '0' },
      { attr: 'max', type: 'number', red: '最大值', def: '100' },
      { attr: 'step', type: 'number', red: '步长', def: '1' },
      { attr: 'range', type: 'boolean', red: '是否开启范围双滑块', def: 'false' },
      { attr: 'marks', type: 'object', red: '刻度标记，形如 { 0: "0°C", 50: "50%" }', def: '—' },
      { attr: 'showInput', type: 'boolean', red: '是否显示输入框联动', def: 'false' },
      { attr: 'showStops', type: 'boolean', red: '是否显示间断点', def: 'false' },
      { attr: 'vertical', type: 'boolean', red: '是否竖向（向上为增大）', def: 'false' },
      { attr: 'height', type: 'number', red: '竖向模式高度(px)', def: '200' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'formatTooltip', type: 'function', red: '自定义提示文案', def: '—' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
