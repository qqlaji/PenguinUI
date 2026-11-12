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
      { attr: 'modelValue', type: 'String', red: '文本内容', sel: '——', def: "''" },
      { attr: 'options', type: 'Array', red: '候选：字符串或 { label, value, description, avatar, disabled }', sel: '——', def: '[]' },
      { attr: 'prefix', type: 'String', red: '触发前缀', sel: '——', def: '@' },
      { attr: 'split', type: 'String', red: '插入后的分隔符', sel: '——', def: '空格' },
      { attr: 'rows', type: 'Number', red: '文本域行数', sel: '——', def: '3' },
      { attr: 'placeholder', type: 'String', red: '占位提示', sel: '——', def: "''" },
      { attr: 'disabled', type: 'Boolean', red: '禁用', sel: 'true / false', def: 'false' },
      { attr: 'filterable', type: 'Boolean', red: '是否按关键词过滤候选', sel: 'true / false', def: 'true' },
      { attr: 'emptyText', type: 'String', red: '无匹配文案', sel: '——', def: '暂无匹配成员' },
      { attr: 'maxlength', type: 'Number', red: '最大输入长度', sel: '——', def: "''" },
      { attr: 'showCount', type: 'Boolean', red: '显示字数统计', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
