<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Bubble 气泡

#### 聊天气泡，支持左右分侧、三种变体、输入中动画、自定义配色与操作区

<br/>

## 基础用法

#### _placement_ 控制气泡在左右哪一侧，_name_ / _time_ 渲染头像旁的署名与时间，_loading_ 显示「正在输入」动画。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="bubble" demoname="demo1"/>

## 变体与自定义

#### _variant_ 可选 `filled` / `outlined` / `text`；_bg-color_ 与 _text-color_ 直接覆盖配色，_#extra_ / _#footer_ 放操作与状态。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="bubble" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 气泡内容，支持富文本 |
| avatar | 自定义头像 |
| extra | 气泡外的附加内容（时间、操作图标） |
| footer | 气泡下方的内容（已读状态等） |
