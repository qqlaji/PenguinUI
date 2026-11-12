<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# List 列表

#### 基础列表容器，支持头部 / 底部、分隔线、加载态与空状态

<br/>

## 基本使用

#### 通过 _data_ 传入数据，_#item_ 作用域插槽自定义每一条的渲染。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="list" demoname="demo1"/>

## 加载与空状态

#### _loading_ 展示加载态，数据为空时渲染 _#empty_ 插槽。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="list" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Slots 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 默认内容（等同 item 未命中时） | —— |
| item | 自定义每一条内容 | { item, index } |
| header | 头部内容 | —— |
| footer | 底部内容 | —— |
| empty | 空状态内容 | —— |
