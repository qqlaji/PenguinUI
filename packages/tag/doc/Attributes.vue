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
      { attr: 'type', type: 'string', red: 'default / primary / success / warning / danger / info', def: "'default'" },
      { attr: 'size', type: 'string', red: 'large / default / small', def: "'default'" },
      { attr: 'effect', type: 'string', red: 'light / dark / plain', def: "'light'" },
      { attr: 'color', type: 'string', red: '自定义主色，优先级高于 type', def: "''" },
      { attr: 'round', type: 'boolean', red: '是否为胶囊形状', def: 'false' },
      { attr: 'bordered', type: 'boolean', red: '是否显示完整描边', def: 'false' },
      { attr: 'closable', type: 'boolean', red: '是否可关闭', def: 'false' },
      { attr: 'clickable', type: 'boolean', red: '是否启用点击态（悬停上浮）', def: 'false' },
      { attr: 'checkable', type: 'boolean', red: '是否可选中（配合 checked）', def: 'false' },
      { attr: 'checked', type: 'boolean', red: '选中状态，支持 v-model:checked', def: 'false' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'icon', type: 'string', red: '前置图标类名，如 t-icon-calendar', def: "''" },
      { attr: 'dot', type: 'boolean', red: '是否显示前置状态圆点', def: 'false' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
