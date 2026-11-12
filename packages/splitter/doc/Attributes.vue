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
      { field: 'red', title: '说明', align: 'center', width: '350px' },
      { field: 'sel', title: '可选值', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'v-model', type: 'Number', red: '起始面板占比（0-100）', sel: '——', def: '50' },
      { attr: 'direction', type: 'String', red: '分割方向', sel: 'horizontal / vertical', def: 'horizontal' },
      { attr: 'min', type: 'Number', red: '起始面板最小占比', sel: '——', def: '10' },
      { attr: 'max', type: 'Number', red: '起始面板最大占比', sel: '——', def: '90' },
      { attr: 'barSize', type: 'Number', red: '分割条粗细（px）', sel: '——', def: '8' },
      { attr: 'disabled', type: 'Boolean', red: '是否禁用拖动', sel: 'true / false', def: 'false' },
      { attr: 'height', type: 'Number / String', red: '容器高度，vertical 模式常用', sel: '——', def: "''" },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
