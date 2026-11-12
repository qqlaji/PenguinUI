<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'name', title: '事件名', align: 'center' },
      { field: 'red', title: '说明', align: 'center', width: '350px' },
      { field: 'attr', title: '回调参数', align: 'center' },
      { field: 'exm', title: '示例', align: 'center', width: '350px' }
    ],
    datas: [
      {
        name: 'update:modelValue',
        red: '双向绑定值变化',
        attr: '(value: string)',
        exm: 'v-model="color"'
      },
      {
        name: 'change',
        red: '颜色改变时触发（拖动取色时节流触发）',
        attr: '(value: string)',
        exm: '@change="(c) => console.log(c)"'
      },
      {
        name: 'clear',
        red: '点击清空按钮时触发',
        attr: '()',
        exm: '@clear="() => (color = \'\')"'
      },
      {
        name: 'visible-change',
        red: '面板展开 / 收起时触发',
        attr: '(visible: boolean)',
        exm: '@visible-change="(v) => console.log(v)"'
      }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
