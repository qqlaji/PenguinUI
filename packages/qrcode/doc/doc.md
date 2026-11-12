<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# QRCode 二维码

#### 零依赖的内置二维码生成器，支持四级纠错、自定义配色、圆点样式、中心 Logo 与失效刷新

<br/>

## 基础用法

#### _value_ 为二维码内容，_level_ 控制纠错等级：等级越高抗污损能力越强，但同样内容需要的版本更高、模块更密。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="qrcode" demoname="demo1"/>

## 样式、Logo 与状态

#### _type="round"_ 渲染圆点，_color / bgColor_ 改配色，_status="expired"_ 覆盖失效遮罩并触发 _refresh_ 让业务重新取码。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="qrcode" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| refresh | 点击遮罩上的刷新按钮 | —— |
| error | 编码失败（内容过长等） | error: Error |

## Methods 方法

| 方法名 | 说明 |
| --- | --- |
| generate | 手动重新生成 |
| refresh | 触发 refresh 事件 |
