<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Empty 空状态
#### 在没有数据、搜索无结果或权限不足时提供友好的占位与引导操作。

<br />

## 基础用法

<br />

### 描述与操作区
#### 内置轻量插画，可通过 image / description 插槽完全替换。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="empty" demoname="demo"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| — | — | — |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| image | 自定义插画 |
| description | 自定义描述 |
| default | 操作区，如按钮 |

<br />
