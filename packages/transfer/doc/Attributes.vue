<template>
  <t-table :options="options"></t-table>
</template>

<script setup>
import { reactive, toRef } from 'vue'
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '属性', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      { attr: 'data', type: 'array', red: '数据源 [{ key, label, disabled }]', def: '[]' },
      { attr: 'modelValue', type: 'array', red: '右侧已选的 key 数组', def: '[]' },
      { attr: 'titles', type: 'array', red: '左右面板标题', def: "['列表一', '列表二']" },
      { attr: 'filterable', type: 'boolean', red: '是否显示搜索框', def: 'false' },
      { attr: 'disabled', type: 'boolean', red: '禁用整个穿梭框', def: 'false' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
