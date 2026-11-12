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
      { attr: 'code', type: 'String', red: '代码内容', sel: '——', def: "''" },
      { attr: 'lang', type: 'String', red: '语言标识', sel: 'js / ts / vue / html / css / json / bash', def: 'js' },
      { attr: 'title', type: 'String', red: '标题，不传则显示语言名', sel: '——', def: "''" },
      { attr: 'theme', type: 'String', red: '主题', sel: 'dark / light', def: 'dark' },
      { attr: 'lineNumbers', type: 'Boolean', red: '显示行号', sel: 'true / false', def: 'true' },
      { attr: 'showHeader', type: 'Boolean', red: '显示顶部栏', sel: 'true / false', def: 'true' },
      { attr: 'copyable', type: 'Boolean', red: '显示复制按钮', sel: 'true / false', def: 'true' },
      { attr: 'copyText', type: 'String', red: '复制按钮文案', sel: '——', def: '复制' },
      { attr: 'copiedText', type: 'String', red: '复制成功文案', sel: '——', def: '已复制' },
      { attr: 'collapsible', type: 'Boolean', red: '超出阈值时折叠', sel: 'true / false', def: 'false' },
      { attr: 'collapseHeight', type: 'Number', red: '折叠阈值高度（px）', sel: '——', def: '260' },
      { attr: 'maxHeight', type: 'Number / String', red: '固定最大高度，超出滚动', sel: '——', def: "''" },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
