<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Alert 警告提示
#### 用于页面中展示需要用户关注的状态信息，支持语义色、图标、标题与关闭。

<br />

## 基础用法

<br />

### 五种语义类型与自定义效果
#### 通过 type 切换语义色，effect 切换浅色 / 深色，showIcon 显示类型图标，closable 可关闭。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="alert" demoname="demo"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发 | — |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 描述内容 |
| title | 标题内容 |
| icon | 自定义图标 |

<br />
