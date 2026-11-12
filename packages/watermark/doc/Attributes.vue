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
      { attr: 'content', type: 'String / Array', red: '水印文字，传数组则多行显示', sel: '——', def: "''" },
      { attr: 'image', type: 'String', red: '图片水印地址，设置后优先于文字', sel: '——', def: "''" },
      { attr: 'width / height', type: 'Number', red: '单个水印的宽高（px）', sel: '——', def: '120 / 64' },
      { attr: 'gapX / gapY', type: 'Number', red: '水印之间的水平 / 垂直间距（px）', sel: '——', def: '100 / 100' },
      { attr: 'rotate', type: 'Number', red: '旋转角度（度）', sel: '——', def: '-22' },
      { attr: 'opacity', type: 'Number', red: '透明度', sel: '0 ~ 1', def: '0.15' },
      { attr: 'fontColor', type: 'String', red: '文字颜色', sel: '——', def: 'rgba(0,0,0,1)' },
      { attr: 'fontSize', type: 'Number', red: '字号（px）', sel: '——', def: '14' },
      { attr: 'fontFamily', type: 'String', red: '字体', sel: '——', def: 'sans-serif' },
      { attr: 'fontWeight', type: 'String / Number', red: '字重', sel: '——', def: 'normal' },
      { attr: 'fontStyle', type: 'String', red: '字体样式', sel: 'normal / italic', def: 'normal' },
      { attr: 'imageWidth / imageHeight', type: 'Number', red: '图片水印绘制尺寸（px）', sel: '——', def: '0' },
      { attr: 'zIndex', type: 'Number', red: '水印层层级', sel: '——', def: '9' },
      { attr: 'customClass', type: 'String', red: '自定义类名', sel: '——', def: "''" }
    ]
  }
})
const { options } = state
</script>

<style lang="scss" scoped></style>
