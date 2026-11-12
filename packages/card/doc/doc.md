<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Card 卡片
#### 将信息、操作与相关内容聚合在统一的容器中，支持自定义头尾。

<br />

## 基础用法

<br />

### 标题、额外操作与页脚
#### 通过 header / extra / footer 插槽自由组合，shadow 控制阴影出现的时机。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="card" demoname="demo"/>

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
| default | 卡片内容 |
| header | 自定义头部 |
| extra | 头部右侧操作区 |
| footer | 页脚 |

<br />
