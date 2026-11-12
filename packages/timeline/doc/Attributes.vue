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
      { attr: 'timestamp', type: 'string', red: '时间戳文本', def: "''" },
      { attr: 'color', type: 'string', red: '节点颜色（十六进制或主题色）', def: "''（品牌色）" },
      { attr: 'icon', type: 'string', red: '节点图标类名', def: "''" },
      { attr: 'hollow', type: 'boolean', red: '是否为空心节点', def: 'false' },
      { attr: 'placement', type: 'string', red: '时间戳位置：top / bottom', def: "'bottom'" }
    ]
  }
})
const options = toRef(state, 'options')
</script>
