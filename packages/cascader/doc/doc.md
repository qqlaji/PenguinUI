<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Cascader 级联选择
#### 从多级嵌套数据中逐级选择，悬停展开下级、点击叶子完成选择，常用于省市区、分类树等场景。

<br />

## 基础用法
#### v-model 为选中节点 `value` 组成的路径数组；悬停父级自动展开下一级。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="cascader" demoname="demo1"/>

<br />

## 任意层级可选 / 不可清空
#### `change-on-select` 允许选择非叶子节点；`clearable=false` 隐藏清空按钮。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="cascader" demoname="demo2"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选择完成时触发 | array |
| change | 选择完成时触发 | array |

<br />

## options 数据结构

```js
[
  { value: 'zj', label: '浙江', children: [
    { value: 'hz', label: '杭州', children: [{ value: 'xh', label: '西湖区' }] }
  ]}
]
```

<br />
