<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# FloatButton 悬浮按钮

#### 浮动在内容之上的操作入口，支持圆形 / 方形、尺寸、主色、徽标与固定定位

<br/>

## 基础用法

#### 传 _icon_ 显示图标，传 _label_ 变成胶囊按钮；_fixed_ 为 false 时按普通行内元素排版。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="floatButton" demoname="demo1"/>

## 形状与徽标

#### _shape_ 切换圆形与方形，_badge_ 显示数字徽标（超过 99 显示 99+），_dot_ 只显示小红点。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="floatButton" demoname="demo2"/>

## 固定定位

#### 默认固定在视口右下角，多个按钮用不同的 _bottom_ 堆叠。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="floatButton" demoname="demo3"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮 | event: MouseEvent |

## Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义图标内容，优先级高于 icon |
