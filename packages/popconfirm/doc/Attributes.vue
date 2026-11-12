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
      { attr: 'title', type: 'string', red: '确认标题', def: "'确定要执行此操作吗？'" },
      { attr: 'content', type: 'string', red: '补充说明文本', def: "''" },
      { attr: 'confirmText', type: 'string', red: '确认按钮文本', def: "'确认'" },
      { attr: 'cancelText', type: 'string', red: '取消按钮文本', def: "'取消'" },
      { attr: 'confirmType', type: 'string', red: '确认按钮类型', def: "'primary'" },
      { attr: 'icon', type: 'string', red: '标题图标类名', def: "'t-icon-warning'" },
      { attr: 'placement', type: 'string', red: '弹出方位：top/bottom/left/right（可加 -start/-end）', def: "'bottom'" },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
