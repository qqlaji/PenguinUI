<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# PageHeader 页头

#### 把返回、面包屑、标题、操作区与页脚收拢为一套固定结构的页面头部

<br/>

## 基础用法

#### _title_ / _subTitle_ 渲染标题区，_#extra_ 放右侧操作，_#tags_ 放状态标签，_#content_ 放说明文字。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="pageHeader" demoname="demo1"/>

## 轻量与紧凑模式

#### _ghost_ 去掉背景与边框，_compact_ 收紧内边距，适合贴在页面顶部或塞进弹窗。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="pageHeader" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| back | 点击返回按钮 | —— |
| crumb-click | 点击面包屑条目 | item: { title, path } |

## Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| title | 标题 |
| subTitle | 副标题 |
| back | 自定义返回按钮内容 |
| extra | 右侧操作区 |
| tags | 标题下方的标签区 |
| content | 说明内容 |
| footer | 页脚操作区 |
