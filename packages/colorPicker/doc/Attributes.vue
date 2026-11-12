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
      { field: 'red', title: '说明', align: 'center', width: '350px' },
      { field: 'sel', title: '可选值', align: 'center' },
      { field: 'def', title: '默认值', align: 'center' }
    ],
    datas: [
      {
        attr: 'v-model',
        type: 'string',
        red: '绑定值，支持 #rgb / #rrggbb / #rrggbbaa / rgb() / rgba()',
        sel: '——',
        def: "''"
      },
      {
        attr: 'defaultColor',
        type: 'String',
        red: '默认颜色（未绑定值时展示，也是「默认颜色」按钮的取值）',
        sel: '——',
        def: '#0e80eb'
      },
      {
        attr: 'disabled',
        type: 'Boolean',
        red: '是否禁用',
        sel: 'true / false',
        def: 'false'
      },
      {
        attr: 'size',
        type: 'String',
        red: '尺寸',
        sel: 'default / small',
        def: 'default'
      },
      {
        attr: 'clearable',
        type: 'Boolean',
        red: '是否可清空（悬停显示 ×）',
        sel: 'true / false',
        def: 'true'
      },
      {
        attr: 'showAlpha',
        type: 'Boolean',
        red: '是否显示透明度滑块，开启后输出 rgba()',
        sel: 'true / false',
        def: 'false'
      },
      {
        attr: 'predefine',
        type: 'Array',
        red: '预设色板，传入颜色字符串数组',
        sel: '——',
        def: '12 个常用色'
      },
      {
        attr: 'placement',
        type: 'String',
        red: '面板弹出位置',
        sel: 'bottom-start / bottom / bottom-end',
        def: 'bottom-start'
      },
      {
        attr: 'autoClose',
        type: 'Boolean',
        red: '点选预设颜色后是否自动关闭面板',
        sel: 'true / false',
        def: 'false'
      },
      {
        attr: 'customClass',
        type: 'String',
        red: '自定义组件类名',
        sel: '——',
        def: "''"
      }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
