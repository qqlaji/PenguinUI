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
      { attr: 'text', type: 'String / Number', red: '文本内容', sel: '——', def: "''" },
      { attr: 'tag', type: 'String', red: '渲染标签', sel: 'span / div / p / a ...', def: 'span' },
      { attr: 'level', type: 'Number', red: '标题级别，传入后自动使用 h1-h5', sel: '1 / 2 / 3 / 4 / 5', def: '0' },
      { attr: 'type', type: 'String', red: '语义色', sel: 'brand / secondary / success / warning / danger', def: "''" },
      { attr: 'size', type: 'String / Number', red: '字号，支持预设或具体像素', sel: 'small / default / large / 18', def: "''" },
      { attr: 'strong', type: 'Boolean', red: '加粗', sel: 'true / false', def: 'false' },
      { attr: 'italic', type: 'Boolean', red: '斜体', sel: 'true / false', def: 'false' },
      { attr: 'underline', type: 'Boolean', red: '下划线', sel: 'true / false', def: 'false' },
      { attr: 'delete', type: 'Boolean', red: '删除线', sel: 'true / false', def: 'false' },
      { attr: 'code', type: 'Boolean', red: '行内代码样式', sel: 'true / false', def: 'false' },
      { attr: 'mark', type: 'Boolean', red: '高亮标记底色', sel: 'true / false', def: 'false' },
      { attr: 'disabled', type: 'Boolean', red: '禁用态', sel: 'true / false', def: 'false' },
      { attr: 'block', type: 'Boolean', red: '独占一行', sel: 'true / false', def: 'false' },
      { attr: 'ellipsis', type: 'Boolean / Number / Object', red: '省略行数，对象形式可指定 rows', sel: 'true / 2 / { rows: 2 }', def: 'false' },
      { attr: 'rows', type: 'Number', red: 'ellipsis 为 true 时的省略行数', sel: '——', def: '1' },
      { attr: 'expandable', type: 'Boolean', red: '溢出时显示展开 / 收起', sel: 'true / false', def: 'false' },
      { attr: 'expandText', type: 'String', red: '展开文案', sel: '——', def: '展开' },
      { attr: 'collapseText', type: 'String', red: '收起文案', sel: '——', def: '收起' },
      { attr: 'copyable', type: 'Boolean', red: '显示复制按钮', sel: 'true / false', def: 'false' },
      { attr: 'copyText', type: 'String', red: '复制内容，默认取渲染文本', sel: '——', def: "''" },
      { attr: 'copyTips', type: 'String', red: '复制按钮提示', sel: '——', def: '复制' },
      { attr: 'copiedTips', type: 'String', red: '复制成功提示', sel: '——', def: '复制成功' },
      { attr: 'href', type: 'String', red: '链接地址（tag 为 a 时生效）', sel: '——', def: "''" },
      { attr: 'target', type: 'String', red: '链接打开方式', sel: '_blank / _self', def: '_blank' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
