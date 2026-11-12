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
      { attr: 'modelValue', type: 'string | number | Date | array', red: '绑定值；range 时为 [start, end]', def: 'null' },
      { attr: 'type', type: 'string', red: 'date / datetime / month / year', def: "'date'" },
      { attr: 'range', type: 'boolean', red: '是否选择起止范围（双面板）', def: 'false' },
      { attr: 'showTime', type: 'boolean', red: '是否显示时分秒列（等价 type="datetime"）', def: 'false' },
      { attr: 'format', type: 'string', red: '输入框展示格式，如 YYYY-MM-DD HH:mm', def: '按 type 决定' },
      { attr: 'valueFormat', type: 'string', red: '绑定值格式；timestamp 返回时间戳；留空返回 Date 对象', def: "''" },
      { attr: 'placeholder', type: 'string', red: '占位文案', def: "'请选择日期'" },
      { attr: 'startPlaceholder', type: 'string', red: '范围模式开始占位', def: "'开始日期'" },
      { attr: 'endPlaceholder', type: 'string', red: '范围模式结束占位', def: "'结束日期'" },
      { attr: 'clearable', type: 'boolean', red: '是否可清空', def: 'true' },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'size', type: 'string', red: 'small / default / large', def: "'default'" },
      { attr: 'disabledDate', type: 'function', red: '禁用日期判定，(date) => boolean', def: '—' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
