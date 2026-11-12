<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Typography 排版

#### 标题、正文、语义色、行内修饰与省略复制，统一页面文字的表达层级

<br/>

## 标题与文本样式

#### 通过 _level_ 生成 h1-h5 标题，_type_ 切换语义色，_strong / italic / underline / delete / code / mark_ 组合行内修饰。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="typography" demoname="demo1"/>

## 省略与复制

#### _ellipsis_ 支持单行与多行省略，配合 _expandable_ 自动判断是否溢出并显示展开收起；_copyable_ 一键复制文本。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="typography" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| copy | 复制成功后触发 | value: string |
| expand | 展开时触发 | —— |
| collapse | 收起时触发 | —— |

## Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 文本内容，优先级高于 text 属性 |
