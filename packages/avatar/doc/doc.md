<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Avatar 头像
#### 支持图片、图标与文字三种内容形态，图片加载失败时自动回退。

<br />

## 基础用法

<br />

### 尺寸、形状与内容回退
#### size 可接受预设或任意像素值；内容优先级为 图片 > 图标 > 文字。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="avatar" demoname="demo"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| error | 图片加载失败时触发 | event |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义文字内容 |

<br />
