<template>
  <t-table :options="options" size="small"></t-table>
</template>

<script setup>
import { reactive, toRef } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '属性', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center', width: '320px' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'modelValue', type: 'array', red: '绑定值：单选为路径数组，多选为二维数组', def: '[]' },
      { attr: 'options', type: 'array', red: '数据源，{ value, label, children } 嵌套结构', def: '[]' },
      { attr: 'multiple', type: 'boolean', red: '开启多选（v1.19 新增）', def: 'false' },
      { attr: 'checkStrictly', type: 'boolean', red: '父子勾选不联动（多选生效）', def: 'false' },
      { attr: 'maxTagCount', type: 'number', red: '多选最多显示的标签数，超出显示 +N', def: '2' },
      { attr: 'showCheckedStrategy', type: 'string', red: '标签展示策略：leaf 叶子路径 / parent 父级', def: "'leaf'" },
      { attr: 'filterable', type: 'boolean', red: '显示搜索框，命中项平铺为完整路径', def: 'false' },
      { attr: 'filterPlaceholder', type: 'string', red: '搜索框占位文案', def: "'搜索选项'" },
      { attr: 'noResultText', type: 'string', red: '搜索无结果文案', def: "'无匹配结果'" },
      { attr: 'lazyLoad', type: 'function', red: '异步加载子节点：(node) => Promise<children[]>', def: 'null' },
      { attr: 'changeOnSelect', type: 'boolean', red: '是否允许选择任意层级', def: 'false' },
      { attr: 'clearable', type: 'boolean', red: '是否可清空', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'separator', type: 'string', red: '展示分隔符', def: "' / '" },
      { attr: 'size', type: 'string', red: '尺寸：small / default / large', def: "'default'" },
      { attr: 'valueField', type: 'string', red: '取值字段名', def: "'value'" },
      { attr: 'labelField', type: 'string', red: '标签字段名', def: "'label'" },
      { attr: 'childrenField', type: 'string', red: '子节点字段名', def: "'children'" },
      { attr: 'disabledField', type: 'string', red: '禁用字段名', def: "'disabled'" },
      { attr: 'isLeafField', type: 'string', red: '叶子标记字段名（异步加载用）', def: "'isLeaf'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
