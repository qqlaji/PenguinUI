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
      { attr: 'content', type: 'String', red: '气泡文字（也可用默认插槽）', sel: '——', def: "''" },
      { attr: 'placement', type: 'String', red: '气泡位置', sel: 'left / right', def: 'left' },
      { attr: 'variant', type: 'String', red: '变体', sel: 'filled / outlined / text', def: 'filled' },
      { attr: 'maxWidth', type: 'Number / String', red: '气泡最大宽度', sel: '——', def: '460px' },
      { attr: 'bgColor', type: 'String', red: '自定义底色', sel: '——', def: "''" },
      { attr: 'textColor', type: 'String', red: '自定义字色', sel: '——', def: "''" },
      { attr: 'loading', type: 'Boolean', red: '显示「正在输入」', sel: 'true / false', def: 'false' },
      { attr: 'avatar', type: 'String', red: '头像地址', sel: '——', def: "''" },
      { attr: 'avatarSize', type: 'Number / String', red: '头像尺寸', sel: 'small / default / large', def: 'default' },
      { attr: 'name', type: 'String', red: '发言人名称，空闲时用首字母做头像', sel: '——', def: "''" },
      { attr: 'time', type: 'String', red: '时间文案', sel: '——', def: "''" },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
