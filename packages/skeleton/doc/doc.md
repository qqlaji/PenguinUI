<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Skeleton 骨架屏
#### 在内容加载期间占位，减少布局跳动，加载完成后自动切换为真实内容。

<br />

## 基础用法

<br />

### 加载态切换与自定义占位
#### loading 为 true 时展示骨架，false 时渲染默认插槽；widths 可指定每行宽度。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="skeleton" demoname="demo"/>

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
| default | 加载完成后的真实内容 |
| placeholder | 自定义骨架占位 |

<br />
