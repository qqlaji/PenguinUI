<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import demo6 from './demo6.vue'
import demo7 from './demo7.vue'
import demo8 from './demo8.vue'
import demo9 from './demo9.vue'
import demo10 from './demo10.vue'
import Attributes from './Attributes.vue'
import Options from './options.vue'
import Event from './Events.vue'
import preview from '@/components/preview.vue'
</script>

# Tree 树形控件

#### 用层级结构展示数据，支持勾选联动、搜索过滤、异步加载与展开收起

<br/>

## 基础用法

#### 点击行展开 / 收起并高亮节点，_default-open-nodes_ 按路径 key 展开指定节点（如 `0-2`）。_show-toolbar_ 提供展开全部 / 收起全部。

<div class="componetnsBox">
  <demo7/>
</div>
<preview compname="tree" demoname="demo7"/>

## 勾选联动

#### _checkable_ 开启复选框。默认父子联动：勾父节点选中全部后代，子节点部分选中时父级显示半选；_check-strictly_ 关闭联动，父子互不影响。

<div class="componetnsBox">
  <demo8/>
</div>
<preview compname="tree" demoname="demo8"/>

## 搜索过滤

#### _filterable_ 开启搜索，命中文字高亮，未命中的节点连同子树隐藏，命中节点的祖先链自动保留并展开。

<div class="componetnsBox">
  <demo9/>
</div>
<preview compname="tree" demoname="demo9"/>

## 异步加载

#### _lazy_ + _load-data_ 让子节点在首次展开时才拉取，加载期间箭头转圈，结果会缓存。

<div class="componetnsBox">
  <demo10/>
</div>
<preview compname="tree" demoname="demo10"/>

## 默认展开

#### 通过 _defaultOpenNodes_ 属性设置默认展开的节点。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="tree" demoname="demo2"/>

## 可选择

#### 通过 _multiple_ 属性启用可选择的树（等价于 _checkable_，为兼容旧版保留）。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="tree" demoname="demo3"/>

## 默认选中

#### 通过 _defaultSelectNodes_ 属性设置默认选中的节点。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="tree" demoname="demo4"/>

## 禁用状态

#### 通过对数据项增加 _disabled:true_ 来设置禁用指定节点。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="tree" demoname="demo5"/>

## 匹配不同格式

#### 通过设置 _labelFiled_ 可替换默认 _label_ 字段的展示，匹配不同数据格式。

<div class="componetnsBox">
  <demo6/>
</div>
<preview compname="tree" demoname="demo6"/>

## Attributes 参数

<Attributes/>
<br/>

## options 配置项

<Options/>
<br/>

## Events 事件

<Event/>
<br/>

## 说明

节点 key 默认按路径生成（根节点第 1 个是 `0`，其第 3 个子节点是 `0-2`）；
如果数据里自带 `key` 字段，则优先使用它，此时 `defaultOpenNodes` / `v-model` 里也要用该值。

组件**不会修改传入的 `options`**，展开态、勾选态都存放在内部 Set 中，因此把 `props` 直接传给 `options` 也不会报错。
