<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Descriptions 描述列表

#### 成组展示多个只读字段，常见于详情页、订单信息与配置总览。

<br />

## 带边框

#### `border` 开启表格样式，`span` 让某一项占据多列。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="descriptions" demoname="demo1"/>

<br />

## 无边框 / 纵向

#### 默认无边框；`direction="vertical"` 时标签在上、内容在下。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="descriptions" demoname="demo2"/>

<br />

## Descriptions Attributes

<Attributes/>
<br/>

## DescriptionsItem Attributes

| 参数 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| label | String | 标签文字 | —— |
| span | Number | 占据的列数 | 1 |

<br />

## 插槽

| 名称 | 说明 |
| --- | --- |
| title | 自定义标题 |
| extra | 自定义操作区 |
| label（Item） | 自定义标签内容 |
| default（Item） | 字段内容 |

<br />
