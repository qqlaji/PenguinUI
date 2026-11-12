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
      { attr: 'modelValue', type: 'array', red: '文件列表（v-model）', def: '[]' },
      { attr: 'action', type: 'string', red: '上传地址，POST + FormData', def: "''" },
      { attr: 'httpRequest', type: 'function', red: '自定义上传 (opts) => Promise，覆盖默认 XHR', def: 'null' },
      { attr: 'multiple', type: 'boolean', red: '是否支持多选', def: 'false' },
      { attr: 'accept', type: 'string', red: '原生 accept 过滤（如 image/*、.pdf）', def: "''" },
      { attr: 'disabled', type: 'boolean', red: '禁用', def: 'false' },
      { attr: 'drag', type: 'boolean', red: '是否展示拖拽上传区', def: 'false' },
      { attr: 'autoUpload', type: 'boolean', red: '选文件后是否自动上传', def: 'true' },
      { attr: 'listType', type: 'string', red: '列表样式：text / picture', def: "'text'" },
      { attr: 'limit', type: 'number', red: '最大上传数量，0 为不限', def: '0' },
      { attr: 'maxSize', type: 'number', red: '单文件最大字节数，0 为不限', def: '0' },
      { attr: 'name', type: 'string', red: 'FormData 字段名', def: "'file'" },
      { attr: 'headers', type: 'object', red: '请求头', def: '{}' },
      { attr: 'data', type: 'object', red: '附加上传字段', def: '{}' },
      { attr: 'withCredentials', type: 'boolean', red: '跨域请求是否携带 cookie', def: 'false' },
      { attr: 'beforeUpload', type: 'function', red: '(rawFile) => bool | Promise<bool>，返回 false 拦截', def: 'null' }
    ]
  }
})
const options = toRef(state, 'options')
</script>
