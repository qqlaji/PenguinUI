<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Cascader 级联选择
#### 从多级嵌套数据中逐级选择，支持多选联动、搜索与异步加载，常用于省市区、分类树等场景。

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

## 多选
#### `multiple` 开启多选，父子默认联动：勾父级选中其下所有叶子，勾单个叶子时父级显示半选。`check-strictly` 关闭联动。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="cascader" demoname="demo3"/>

<br />

## 搜索
#### `filterable` 在面板顶部加搜索框，把各层级命中的节点平铺成完整路径，支持 ↑ ↓ 与 Enter。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="cascader" demoname="demo4"/>

<br />

## 异步加载
#### `lazy-load` 在展开某一级时才请求子节点，加载期间显示转圈，结果会缓存。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="cascader" demoname="demo5"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中变化 | 单选：string[]；多选：string[][] |
| change | 选中变化 | 同上 |
| load | 异步加载完成 | { value, children } / { value, error } |

<br />

## 数据格式

**单选**的 `modelValue` 是一条路径：

```js
['zj', 'hz', 'xh']
```

**多选**的 `modelValue` 是路径的数组（二维）：

```js
[['zj', 'hz', 'xh'], ['fj', 'xm', 'smq']]
```

组件靠「第一项是不是数组」区分两种形状，因此旧的单选代码不需要任何改动。

<br />

## options 数据结构

```js
[
  { value: 'zj', label: '浙江', children: [
    { value: 'hz', label: '杭州', children: [{ value: 'xh', label: '西湖区' }] }
  ]},
  // 禁用某个节点
  { value: 'ops', label: '运维部署', disabled: true },
  // 异步加载：isLeaf: false 表示「还有子节点未加载」
  { value: 'area', label: '华东大区', isLeaf: false }
]
```

<br />

## 说明

- `value` 需要在整棵树里**全局唯一**，组件用它建立索引
- 多选时 `modelValue` 里若同时包含父级与其所有子孙，`show-checked-strategy="parent"` 会让标签只显示父级，避免标签过多
- 异步加载的子节点缓存在组件内部，**不会写入传入的 `options`**
