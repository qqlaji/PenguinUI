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
      { attr: 'icon', type: 'String', red: '图标类名', sel: '——', def: "''" },
      { attr: 'label', type: 'String', red: '文案，传入后变成胶囊按钮', sel: '——', def: "''" },
      { attr: 'type', type: 'String', red: '主题', sel: 'default / primary', def: 'default' },
      { attr: 'shape', type: 'String', red: '形状', sel: 'circle / square', def: 'circle' },
      { attr: 'size', type: 'String', red: '尺寸', sel: 'small / default / large', def: 'default' },
      { attr: 'badge', type: 'Number / String', red: '数字徽标，超过 99 显示 99+', sel: '——', def: "''" },
      { attr: 'dot', type: 'Boolean', red: '只显示小红点', sel: 'true / false', def: 'false' },
      { attr: 'fixed', type: 'Boolean', red: '固定在视口右下角', sel: 'true / false', def: 'true' },
      { attr: 'right', type: 'Number / String', red: '距视口右侧距离', sel: '——', def: '32' },
      { attr: 'bottom', type: 'Number / String', red: '距视口底部距离', sel: '——', def: '96' },
      { attr: 'zIndex', type: 'Number / String', red: '层级', sel: '——', def: '1200' },
      { attr: 'href', type: 'String', red: '链接地址，传入后渲染为 a 标签', sel: '——', def: "''" },
      { attr: 'target', type: 'String', red: '链接打开方式', sel: '_blank / _self', def: '_blank' },
      { attr: 'tooltip', type: 'String', red: '原生 title 提示', sel: '——', def: "''" },
      { attr: 'disabled', type: 'Boolean', red: '禁用', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
