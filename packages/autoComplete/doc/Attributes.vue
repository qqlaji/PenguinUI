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
      { attr: 'modelValue', type: 'String / Number', red: '绑定值', sel: '——', def: "''" },
      { attr: 'options', type: 'Array', red: '候选项：字符串或 { label, value, description, icon, disabled }', sel: '——', def: '[]' },
      { attr: 'placeholder', type: 'String', red: '占位提示', sel: '——', def: "''" },
      { attr: 'size', type: 'String', red: '尺寸', sel: 'large / default / small', def: 'default' },
      { attr: 'disabled', type: 'Boolean', red: '禁用', sel: 'true / false', def: 'false' },
      { attr: 'readonly', type: 'Boolean', red: '只读', sel: 'true / false', def: 'false' },
      { attr: 'clearable', type: 'Boolean', red: '显示清空按钮', sel: 'true / false', def: 'false' },
      { attr: 'prefixIcon', type: 'String', red: '前置图标类名', sel: '——', def: "''" },
      { attr: 'loading', type: 'Boolean', red: '加载中状态', sel: 'true / false', def: 'false' },
      { attr: 'emptyText', type: 'String', red: '无匹配时的文案', sel: '——', def: '暂无匹配结果' },
      { attr: 'maxHeight', type: 'Number / String', red: '下拉面板最大高度', sel: '——', def: '260' },
      { attr: 'minChars', type: 'Number', red: '触发联想的最少字符数', sel: '——', def: '0' },
      { attr: 'triggerOnFocus', type: 'Boolean', red: '聚焦即展示全部选项', sel: 'true / false', def: 'true' },
      { attr: 'filterable', type: 'Boolean', red: '是否在本地过滤（远程搜索时设为 false）', sel: 'true / false', def: 'true' },
      { attr: 'filterMethod', type: 'Function', red: '自定义过滤 (query, option) => boolean', sel: '——', def: 'null' },
      { attr: 'highlight', type: 'Boolean', red: '高亮匹配片段', sel: 'true / false', def: 'true' },
      { attr: 'placement', type: 'String', red: '面板对齐方式', sel: 'bottom-start / bottom / bottom-end', def: 'bottom-start' },
      { attr: 'maxlength', type: 'Number', red: '最大输入长度', sel: '——', def: "''" },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
