<script setup>
import demo1 from './demo1.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Affix 固钉
#### 当页面滚动到指定位置时，将元素固定在视口顶部或底部，常用于吸顶导航、工具条、操作栏。

<br />

## 基础用法
#### 设置 `offset-top`，元素滚动到距顶部该距离时自动固定；组件会保留占位，避免布局跳动。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="affix" demoname="demo1"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 固定状态变化 | affixed: boolean |

<br />

## 方法（通过 ref 调用）

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| update | 手动重新测量并计算固定状态 | — |

<br />
