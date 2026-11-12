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
      { attr: 'modelValue', type: 'Boolean', red: '是否显示引导', sel: 'true / false', def: 'false' },
      { attr: 'steps', type: 'Array', red: '步骤配置，见 Steps 配置', sel: '——', def: '[]' },
      { attr: 'current', type: 'Number', red: '当前步骤（支持 v-model:current）', sel: '——', def: 'null' },
      { attr: 'mask', type: 'Boolean', red: '显示遮罩', sel: 'true / false', def: 'true' },
      { attr: 'maskClosable', type: 'Boolean', red: '点击遮罩关闭', sel: 'true / false', def: 'false' },
      { attr: 'closable', type: 'Boolean', red: '显示右上角关闭按钮', sel: 'true / false', def: 'true' },
      { attr: 'showIndicator', type: 'Boolean', red: '显示步骤指示点', sel: 'true / false', def: 'true' },
      { attr: 'gap', type: 'Number', red: '高亮区域外扩距离（px）', sel: '——', def: '8' },
      { attr: 'zIndex', type: 'Number / String', red: '层级', sel: '——', def: '2100' },
      { attr: 'scrollIntoView', type: 'Boolean', red: '切换时把目标滚动到视口', sel: 'true / false', def: 'true' },
      { attr: 'nextText', type: 'String', red: '下一步文案', sel: '——', def: '下一步' },
      { attr: 'prevText', type: 'String', red: '上一步文案', sel: '——', def: '上一步' },
      { attr: 'finishText', type: 'String', red: '完成文案', sel: '——', def: '完成' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
