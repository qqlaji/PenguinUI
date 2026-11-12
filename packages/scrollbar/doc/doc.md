<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Scrollbar 滚动条

#### 自定义滚动条外观，隐藏系统滚动条并保留原生滚动能力，支持纵横双向、拖拽与点击轨道跳转

<br/>

## 基本使用

#### 用 _height_ 限定滚动区域高度，鼠标进入容器时滚动条淡入。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="scrollbar" demoname="demo1"/>

## 横向、常显与原生

#### _always_ 让滚动条常显，_native_ 回退到浏览器原生滚动条。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="scrollbar" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| scroll | 滚动时触发 | event: Event |

## Methods 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| update | 手动重新计算滑块尺寸与位置 | —— |
| scrollTo | 滚动到指定位置 | options: ScrollToOptions，或 (left, top) |
| setScrollTop | 设置纵向滚动距离 | value: number |
| setScrollLeft | 设置横向滚动距离 | value: number |

## Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 滚动区域内容 |
