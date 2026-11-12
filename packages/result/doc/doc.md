<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Result 结果页
#### 用于反馈一系列操作任务的处理结果，如成功、失败、警告、提示，以及 403 / 404 / 500 等异常页面。

<br />

## 基础用法
#### 内置 success / warning / info / error 四种状态，搭配标题与副标题。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="result" demoname="demo1"/>

<br />

## 异常页与操作区
#### 403 / 404 / 500 会以大号状态码呈现；通过 `extra` 插槽放置操作按钮。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="result" demoname="demo2"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| title | 自定义标题 |
| subTitle | 自定义副标题 |
| extra | 操作区（按钮等） |
| default | 额外内容，与 extra 同区域渲染 |

<br />
