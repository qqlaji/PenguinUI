<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Transfer 穿梭框
#### 在两栏之间批量移动数据，支持全选、半选、搜索过滤与禁用项。

<br />

## 基础用法
#### `data` 提供数据源，`v-model` 绑定右侧已选的 key 数组；勾选后点击中间箭头批量移动。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="transfer" demoname="demo1"/>

<br />

## 搜索与自定义标题
#### `filterable` 开启两侧搜索，`titles` 自定义面板标题；全选框支持半选（indeterminate）状态。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="transfer" demoname="demo2"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 右侧选中项变化 | keys: array |
| change | 移动完成时触发 | (keys, direction, movedKeys) |

<br />
