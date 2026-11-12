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
      { attr: 'v-model', type: 'String', red: '绑定值', sel: '——', def: "''" },
      { attr: 'length', type: 'Number', red: '验证码位数', sel: '——', def: '6' },
      { attr: 'separator', type: 'String / Number', red: '分隔符；传数字表示每隔几位插入分隔', sel: '——', def: "''" },
      { attr: 'mask', type: 'Boolean', red: '是否以圆点遮蔽', sel: 'true / false', def: 'false' },
      { attr: 'numberOnly', type: 'Boolean', red: '是否只允许输入数字', sel: 'true / false', def: 'true' },
      { attr: 'disabled', type: 'Boolean', red: '是否禁用', sel: 'true / false', def: 'false' },
      { attr: 'size', type: 'String', red: '尺寸', sel: 'small / default / large', def: 'default' },
      { attr: 'status', type: 'String', red: '校验状态', sel: "'' / error / success", def: "''" },
      { attr: 'autofocus', type: 'Boolean', red: '是否自动聚焦第一格', sel: 'true / false', def: 'false' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
