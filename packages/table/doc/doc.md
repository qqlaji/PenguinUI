<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import demo6 from './demo6.vue'
import demo7 from './demo7.vue'
import Attributes from './Attributes.vue'
import Fileds from './fileds.vue'
import preview from '@/components/preview.vue'
</script>

# Table 表格

#### 用于展示多层次结构的数据，可自定义并保持高度灵活

<br/>

## 基本使用

#### table 表格基本使用示例,需要一个主要的 _options_ 参数。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="table" demoname="demo1"/>

## 不同大小

#### 你可以传入一个 _size_ 来确定表格的不同大小，以适配不同的应用场景

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="table" demoname="demo2"/>

## 自定义插槽内容

#### 根据需要自定义表格的插槽内容，插槽接受需要定义表格列的 _field_ 并返回当前行的数据 _rowItem_ ，如果是定义表头，需要在插槽名加上 _head-_ 前缀作为识别符

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="table" demoname="demo3"/>

## 自定义表头及表格样式

#### 使用 _headStyle_ 自定义表头的样式，使用 _rowStyle_ 自定义表格内容区域的样式

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="table" demoname="demo4"/>

## 行选择

#### 开启 _selectable_ 后首列出现复选框，配合 _v-model:selectedKeys_ 与 _rowKeyField_ 管理选中态；_showToolbar_ 显示已选统计，_#toolbar-extra_ 放批量操作。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="table" demoname="demo5"/>

## 排序、筛选与分页

#### 列上声明 _sortable_ 即可点击表头排序（升序 → 降序 → 取消），_filters_ 提供多选筛选；开启 _pagination_ 后内置分页条。

<div class="componetnsBox">
  <demo6/>
</div>
<preview compname="table" demoname="demo6"/>

## 固定表头、斑马纹与加载态

#### _fixedHeader_ 配合 _maxHeight_ 让表头吸顶，_striped_ 开启斑马纹，_loading_ 覆盖加载遮罩，_#empty_ 自定义空态。

<div class="componetnsBox">
  <demo7/>
</div>
<preview compname="table" demoname="demo7"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:selectedKeys | 选中项变化 | keys: Array |
| selection-change | 选中行变化 | rows: Array |
| sort-change | 排序变化 | { field, order } |
| filter-change | 筛选变化 | state: Record\<string, Array\> |
| update:page | 页码变化 | page: number |
| page-change | 页码变化 | page: number |
| row-click | 行点击（需 clickableRow） | { row, index, event } |

## fileds API

<Fileds/>
<br/>
