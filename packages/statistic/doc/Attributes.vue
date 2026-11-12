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
      { attr: 'value', type: 'number', red: '数值', def: '0' },
      { attr: 'title', type: 'string', red: '标题', def: "''" },
      { attr: 'precision', type: 'number', red: '小数位数', def: '0' },
      { attr: 'separator', type: 'boolean', red: '是否显示千分位分隔符', def: 'true' },
      { attr: 'prefix', type: 'string', red: '前缀（如货币符号）', def: "''" },
      { attr: 'suffix', type: 'string', red: '后缀（如单位）', def: "''" },
      { attr: 'groupSeparator', type: 'string', red: '千分位分隔符', def: "','" },
      { attr: 'decimalSeparator', type: 'string', red: '小数点符号', def: "'.'" },
      { attr: 'valueStyle', type: 'object', red: '数值区域样式', def: '{}' },
      { attr: 'countUp', type: 'boolean', red: '是否开启数字滚动动画', def: 'false' },
      { attr: 'duration', type: 'number', red: '动画时长（毫秒）', def: '1200' },
      { attr: 'formatter', type: 'function', red: '自定义格式化 (value) => string', def: 'null' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
