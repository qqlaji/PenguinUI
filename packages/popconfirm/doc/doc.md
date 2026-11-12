<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Popconfirm 气泡确认框
#### 点击元素弹出轻量确认框，用于二次确认危险或重要操作，避免误触。

<br />

## 基础用法
#### 将触发元素放入默认插槽；点击确认 / 取消会分别触发 `confirm` / `cancel` 事件。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="popconfirm" demoname="demo1"/>

<br />

## 弹出方位
#### 通过 `placement` 控制气泡相对触发元素的位置。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="popconfirm" demoname="demo2"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| confirm | 点击确认按钮 | — |
| cancel | 点击取消按钮 | — |
| visible-change | 显示状态变化 | boolean |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 触发元素（按钮等） |

<br />
