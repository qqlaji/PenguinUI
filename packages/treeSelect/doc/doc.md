<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# TreeSelect 树选择
#### 在树形结构中选择单个或多个值，支持展开收起、搜索过滤与标签展示。

<br />

## 基础用法
#### `options` 传入树形数据，单选点击即选中并收起；`multiple` 开启多选，选中项以标签展示，可单独移除。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="treeSelect" demoname="demo1"/>

<br />

## 搜索 / 尺寸 / 禁用
#### `filterable` 开启搜索，输入关键字后平铺展示命中节点；`disabled` 禁用；`size` 控制尺寸。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="treeSelect" demoname="demo2"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | value \| array |
| change | 选中值变化时触发 | value \| array |
| visible-change | 面板展开/收起 | boolean |

<br />
