<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import demo6 from './demo6.vue'
import demo7 from './demo7.vue'
import demo8 from './demo8.vue'
import Attributes from './Attributes.vue'
import Event from './Events.vue'
import ActiveColors from './activeColors.vue'
import preview from '@/components/preview.vue'
</script>

# Pagination 分页

#### 长列表分批加载时的页码导航，页数过多时自动折叠为省略号，悬停省略号可快速跨页。

<br/>

## 基本使用

#### 页数超出 `pagerCount` 时自动折叠为省略号，当前页以主题色高亮。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="pagination" demoname="demo1"/>

## 禁用状态

#### 通过 _disabled_ 属性来开启禁用。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="pagination" demoname="demo2"/>

## 小型分页

#### 通过 _size=small_ 属性来开启。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="pagination" demoname="demo3"/>

## 带边框

#### 默认是无边框的文字页码；加上 `border` 切换为带边框的按钮形态。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="pagination" demoname="demo4"/>

## 页码折叠数量

#### 通过 _pagerCount_ 控制同时展示的页码数量，取值需为 5~21 的奇数。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="pagination" demoname="demo5"/>

## 更多配置

#### `showTotal` 显示总条数，`jumper` 显示跳页输入，`prevText` / `nextText` 自定义上下页文案。

<div class="componetnsBox">
  <demo6/>
</div>
<preview compname="pagination" demoname="demo6"/>

## 自定义样式

#### 可通过 _activeColors_ 对象自定义分页配色（需配合 `border` 生效）。

<div class="componetnsBox">
  <demo7/>
</div>
<preview compname="pagination" demoname="demo7"/>

## 受控用法

#### 使用 `v-model:current` 或 `@update:current` 接管页码，`@change` 触发数据请求。

<div class="componetnsBox">
  <demo8/>
</div>
<preview compname="pagination" demoname="demo8"/>

## attributes 参数

<Attributes/>
<br/>

## ActiveColors 配置项

<ActiveColors/>
<br/>

## Event 事件

<Event/>
<br/>
