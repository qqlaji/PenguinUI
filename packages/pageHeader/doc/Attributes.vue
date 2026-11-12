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
      { attr: 'title', type: 'String', red: '主标题', sel: '——', def: "''" },
      { attr: 'subTitle', type: 'String', red: '副标题', sel: '——', def: "''" },
      { attr: 'showBack', type: 'Boolean', red: '显示返回按钮', sel: 'true / false', def: 'false' },
      { attr: 'backText', type: 'String', red: '返回按钮文案', sel: '——', def: '返回' },
      { attr: 'breadcrumb', type: 'Array', red: '面包屑：[{ title, path }]', sel: '——', def: '[]' },
      { attr: 'extra', type: 'String', red: '右侧操作文字（建议用 extra 插槽）', sel: '——', def: "''" },
      { attr: 'ghost', type: 'Boolean', red: '无背景边框', sel: 'true / false', def: 'false' },
      { attr: 'compact', type: 'Boolean', red: '紧凑模式', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
