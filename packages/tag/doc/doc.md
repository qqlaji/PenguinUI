<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Tag 标签
#### 用于标记状态、分类与关键词，支持语义色、三种质感、多种尺寸与可选中交互。

<br />

## 全部用法
#### `type` 决定语义色，`effect` 提供 light / dark / plain 三种质感，`size` 控制尺寸；
#### `closable` 可移除，`checkable` 可选中，`icon` / `dot` 增加前置标记，`color` 自定义主色。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="tag" demoname="demo"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭图标时触发 | event |
| click | 点击标签时触发 | event |
| change | checkable 选中状态变化时触发 | checked: boolean |
| update:checked | 选中状态更新（支持 v-model:checked） | checked: boolean |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 标签文字 |

<br />
