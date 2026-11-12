<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Rate 评分
#### 用于评价与打分，支持半星、只读、自定义数量与辅助文案。

<br />

## 基础用法

<br />

### 打分、半星与只读
#### 使用 v-model 双向绑定分值；allowHalf 开启半星，showText 显示对应文案。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="rate" demoname="demo"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 分值变化时触发 | number |
| change | 用户选择分值时触发 | number |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义右侧文案 |

<br />
