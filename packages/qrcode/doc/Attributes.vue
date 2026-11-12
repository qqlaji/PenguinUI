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
      { attr: 'value', type: 'String', red: '二维码内容，支持中文与 emoji', sel: '——', def: "''" },
      { attr: 'size', type: 'Number', red: '边长（px）', sel: '——', def: '160' },
      { attr: 'level', type: 'String', red: '纠错等级', sel: 'L / M / Q / H', def: 'M' },
      { attr: 'color', type: 'String', red: '前景色', sel: '——', def: '#1c2534' },
      { attr: 'bgColor', type: 'String', red: '背景色', sel: '——', def: '#ffffff' },
      { attr: 'padding', type: 'Number / String', red: '静默区宽度，建议不小于 6px', sel: '——', def: '8' },
      { attr: 'type', type: 'String', red: '模块形状', sel: 'rect / round', def: 'rect' },
      { attr: 'logo', type: 'String', red: '中心 Logo 图片地址', sel: '——', def: "''" },
      { attr: 'logoScale', type: 'Number', red: 'Logo 占位比例（相对宽度）', sel: '——', def: '0.22' },
      { attr: 'title', type: 'String', red: '标题（也可用 title 插槽）', sel: '——', def: "''" },
      { attr: 'description', type: 'String', red: '描述（也可用 description 插槽）', sel: '——', def: "''" },
      { attr: 'status', type: 'String', red: '状态遮罩', sel: '空 / loading / expired', def: "''" },
      { attr: 'statusText', type: 'String', red: '状态文案', sel: '——', def: "''" },
      { attr: 'disabled', type: 'Boolean', red: '禁用态', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
