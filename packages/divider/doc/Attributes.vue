<template>
  <t-table :options="state"></t-table>
</template>

<script setup>
import { reactive } from 'vue';
const state = reactive({
  fileds: [
    { field: 'attr', title: '属性', align: 'center' },
    { field: 'type', title: '类型', align: 'center' },
    { field: 'red', title: '说明', align: 'center' },
    { field: 'sel', title: '可选值', align: 'center' },
    { field: 'def', title: '默认值', align: 'center' },
  ],
  datas: [
    { attr: 'direction', type: 'string', red: '设置分割线方向', sel: 'horizontal | vertical', def: 'horizontal' },
    { attr: 'position', type: 'string', red: '设置文案位置（水平时有效）', sel: 'left | center | right', def: 'center' },
    { attr: 'lineStyle', type: 'string', red: '线条样式，等价于 CSS border-style', sel: 'solid | dashed | dotted | double | groove', def: 'solid' },
    { attr: 'color', type: 'string', red: '自定义线色，不传则跟随主题令牌', sel: '任意 CSS 颜色', def: '—' },
  ],
});
</script>
