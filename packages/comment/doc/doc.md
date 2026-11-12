<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Comment 评论

#### 承载用户讨论的列表单元，支持头像、作者、时间、操作项、嵌套回复与富内容插槽

<br/>

## 基础用法

#### 传 _author_ / _datetime_ / _content_ 渲染一条评论，_actions_ 配置底部操作项，点击触发 _action_ 事件。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="comment" demoname="demo1"/>

## 嵌套回复与富内容

#### _collapsedText_ 生成可展开的回复区，内部再放 _nested_ 的评论即可形成层级；默认插槽与 _#actions_ 插槽支持任意内容。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="comment" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| action | 点击操作项 | (action, index) |

## Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 正文内容（富文本） |
| avatar | 自定义头像 |
| author | 自定义作者区 |
| datetime | 自定义时间区 |
| actions | 自定义操作区 |
| replies | 展开后的回复内容 |
