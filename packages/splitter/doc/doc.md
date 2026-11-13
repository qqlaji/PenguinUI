<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Splitter 分隔面板

#### 可拖拽调整两栏尺寸的分割布局

> **与 Resizable 的关系**：Splitter 是「两栏按百分比分割」的定型组件，
> 功能上等价于 [Resizable 伸缩框](/penguinui/resizable) 里 `t-resizable-group`
> 的两栏用法（`default-sizes` 传两个值 + `#start` / `#end` 插槽）。
> 需要 **三栏及以上**、或需要同时「拖拽改尺寸 + 拖拽改位置」时，
> 直接用 `t-resizable-group` 更灵活；Splitter 保留是为了兼容既有用法与
> 更简洁的两栏 API（`v-model` 直接绑定百分比）。

<br/>

## 基本使用

#### 通过 _v-model_ 绑定起始面板占比，_#start_ / _#end_ 分别渲染左右（上下）两栏内容。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="splitter" demoname="demo1"/>

## 纵向与禁用

#### _direction="vertical"_ 切换为上下分栏，设置 _disabled_ 后分割条不可拖动。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="splitter" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Event 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 拖动过程中占比变化 | (percent: number) |
| resize-start | 开始拖动 | —— |
| resize | 拖动中（与 update:modelValue 同步触发） | (percent: number) |
| resize-end | 结束拖动 | (percent: number) |
