<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# VirtualList 虚拟列表

#### 只渲染可视区域内的条目，万级数据也能保持流畅；支持定高与动态高度两种模式

<br/>

## 定高模式

#### _item-height_ 传数字时性能最好，配合 _item-key_ 指定唯一字段。DOM 中始终只有可视区 + 缓冲区的少量节点。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="virtualList" demoname="demo1"/>

## 动态高度与加载更多

#### _item-height_ 传 0 开启实测高度，适合评论、聊天这类不等高内容；滚动到距底部 _distance_ 内触发 _load-more_。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="virtualList" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| scroll | 滚动时触发 | event: Event |
| change | 可视区间变化 | indexes: number[] |
| load-more | 滚动到接近底部 | —— |

## Methods 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| scrollToIndex | 滚动到指定条目 | index: number |
| scrollToTop | 滚动到顶部 | —— |
| scrollToBottom | 滚动到底部 | —— |

## Slots 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 每一条内容 | { item, index } |
| empty | 空状态 | —— |
