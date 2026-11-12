<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Tour 漫游式引导

#### 通过遮罩挖洞与聚光灯高亮，分步介绍页面功能，支持自动翻转、键盘操作与居中说明卡片

<br/>

## 基础用法

#### _steps_ 中每项通过 _target_ 指定元素（选择器 / DOM / 函数均可），卡片会按 _placement_ 自动定位并在空间不足时翻转。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="tour" demoname="demo1"/>

## 无目标与自定义内容

#### 不传 _target_ 时卡片居中显示；用 _#description_ 插槽替换正文，可放置图片、表单等任意内容。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="tour" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 显示状态变化 | visible: boolean |
| update:current | 当前步骤变化 | index: number |
| change | 切换步骤 | index: number |
| finish | 最后一步点击完成 | —— |
| close | 关闭引导 | index: number |

## Steps 配置

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| target | 高亮目标，支持 CSS 选择器、DOM 元素、组件实例或返回它们的函数 | string / Element / Function |
| title | 步骤标题 | string |
| description | 步骤正文 | string |
| placement | 卡片位置：top / bottom / left / right | string |
| icon | 标题前的图标类名 | string |

## Slots 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| description | 自定义正文 | { step, index } |
| default | 追加在正文之后的内容 | { step, index } |
