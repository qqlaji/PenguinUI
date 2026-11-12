<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '参数', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center', width: '320px' },
      { field: 'sel', title: '可选值', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'value', type: 'Date / Number / String', red: '目标时间', sel: '——', def: '当前时间 + 1 小时' },
      { attr: 'format', type: 'String', red: '显示哪些单位：D 天 H 时 m 分 s 秒', sel: 'DD:HH:mm:ss / HH:mm:ss', def: 'DD:HH:mm:ss' },
      { attr: 'separator', type: 'String', red: '单位间分隔符', sel: '——', def: ':' },
      { attr: 'unitLabel', type: 'Boolean', red: '数字前显示单位文字', sel: 'true / false', def: 'false' },
      { attr: 'pad', type: 'Boolean', red: '数字补零', sel: 'true / false', def: 'true' },
      { attr: 'finishText', type: 'String', red: '结束后的文案', sel: '——', def: "''" },
      { attr: 'fontSize', type: 'Number / String', red: '数字字号', sel: '——', def: "''" },
      { attr: 'color', type: 'String', red: '数字颜色', sel: '——', def: "''" },
      { attr: 'bordered', type: 'Boolean', red: '数字加底板', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
