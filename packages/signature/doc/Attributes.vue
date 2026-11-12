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
      { attr: 'width', type: 'Number / String', red: '画布宽度', sel: '——', def: '480' },
      { attr: 'height', type: 'Number / String', red: '画布高度', sel: '——', def: '200' },
      { attr: 'penColor', type: 'String', red: '画笔颜色', sel: '——', def: '#1c2534' },
      { attr: 'lineWidth', type: 'Number', red: '画笔粗细', sel: '——', def: '2.4' },
      { attr: 'bgColor', type: 'String', red: '画布底色', sel: '——', def: 'transparent' },
      { attr: 'title', type: 'String', red: '标题', sel: '——', def: "''" },
      { attr: 'placeholder', type: 'String', red: '未签名时的占位提示', sel: '——', def: '请在此处手写签名' },
      { attr: 'tip', type: 'String', red: '底部提示文案', sel: '——', def: "''" },
      { attr: 'showTools', type: 'Boolean', red: '显示撤销 / 清空按钮', sel: 'true / false', def: 'true' },
      { attr: 'showBaseline', type: 'Boolean', red: '显示签名基线', sel: 'true / false', def: 'true' },
      { attr: 'exportBgColor', type: 'String', red: '导出图片时的底色', sel: '——', def: "''" },
      { attr: 'disabled', type: 'Boolean', red: '禁用', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
