<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import demo6 from './demo6.vue'
import Attributes from './Attributes.vue'
import Options from './options.vue'
import Event from './Events.vue'
import preview from '@/components/preview.vue'
</script>

# Dropdown 下拉菜单

#### 向下展开的菜单列表，支持图标、分隔线、禁用与危险操作

<br/>

## 基本使用

#### Dropdown 下拉菜单的基本使用，需要一个主要的 _options_ 参数。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="dropDown" demoname="demo1"/>

## 不同大小

#### 通过设置 _size_ 属性适应不同大小。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="dropDown" demoname="demo2"/>

## 图标类型

#### 通过设置 _options_ 数据的 _icon_ 属性展示图标，文本与图标自动居中对齐。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="dropDown" demoname="demo3"/>

## 唤醒方式

#### 通过设置 _trigger_ 属性设置不同的唤醒方式。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="dropDown" demoname="demo4"/>

## 头像类型

#### 通过插槽 _#Img_ 设置头像类型的下拉菜单。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="dropDown" demoname="demo5"/>

## 分隔线 / 禁用 / 危险操作

#### options 中通过 _divided_ 插入分隔线、_disabled_ 禁用某一项、_danger_ 标记危险操作；配合 _v-model_ 可高亮当前选中项。

<div class="componetnsBox">
  <demo6/>
</div>
<preview compname="dropDown" demoname="demo6"/>

## Attributes 参数

<Attributes/>
<br/>

## options API

<Options/>
<br/>

## Event 事件

<Event/>
<br/>
