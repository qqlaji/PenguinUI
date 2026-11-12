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
      { attr: 'author', type: 'String', red: '作者名', sel: '——', def: "''" },
      { attr: 'avatar', type: 'String', red: '头像地址，缺省时显示作者首字母', sel: '——', def: "''" },
      { attr: 'avatarSize', type: 'Number / String', red: '头像尺寸', sel: 'small / default / large / 40', def: 'default' },
      { attr: 'datetime', type: 'String', red: '时间文案', sel: '——', def: "''" },
      { attr: 'content', type: 'String', red: '正文（也可用默认插槽）', sel: '——', def: "''" },
      { attr: 'actions', type: 'Array', red: '操作项：[{ label, icon, disabled }]', sel: '——', def: '[]' },
      { attr: 'collapsedText', type: 'String', red: '展开回复的文案，传入后显示回复区', sel: '——', def: "''" },
      { attr: 'nested', type: 'Boolean', red: '嵌套模式（去掉分隔线、缩小间距）', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
