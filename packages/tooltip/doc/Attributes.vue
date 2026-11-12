<template>
  <t-table :options="options"></t-table>
</template>

<script setup>
import { reactive, toRef } from 'vue';
const state = reactive({
  options: {
    fileds: [
      { field: 'attr', title: '属性', align: 'center' },
      { field: 'type', title: '类型', align: 'center' },
      { field: 'red', title: '说明', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' },
    ],
    datas: [
      { attr: 'content', type: 'string', red: '提示内容', def: "''" },
      { attr: 'placement', type: 'string', red: 'top / bottom / left / right，可加 -start / -end', def: "'top'" },
      { attr: 'trigger', type: 'string', red: 'hover / click / focus / manual', def: "'hover'" },
      { attr: 'visible', type: 'boolean', red: 'manual 模式下配合 v-model:visible', def: 'false' },
      { attr: 'dark', type: 'boolean', red: '是否使用深色气泡', def: 'true' },
      { attr: 'delay', type: 'number', red: '悬停显示延迟（ms）', def: '0' },
      { attr: 'maxWidth', type: 'number | string', red: '气泡最大宽度，超出自动换行', def: '280' },
      { attr: 'offset', type: 'number', red: '气泡与触发元素的间距（px）', def: '10' },
      { attr: 'showArrow', type: 'boolean', red: '是否显示箭头', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '是否禁用', def: 'false' },
    ],
  },
});
const options = toRef(state, 'options');
</script>
