<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Breadcrumb 面包屑
#### 显示当前页面在系统层级结构中的位置，并支持向上层级跳转。

<br />

## 基础用法
#### 默认以 `/` 分隔；`separator` 可自定义文字分隔符，`separator-icon` 可改用图标。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="breadcrumb" demoname="demo1"/>

<br />

## 带跳转
#### 给 `t-breadcrumb-item` 设置 `to` 即可点击跳转（已接入 vue-router）；最后一项自动作为当前页高亮且不可点击。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="breadcrumb" demoname="demo2"/>

<br />

## Attributes 参数

### Breadcrumb
<Attributes/>
<br/>

### BreadcrumbItem

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| to | string \| object | 跳转目标，支持路由路径或 location 对象 | — |
| replace | boolean | 使用 `router.replace` 代替 `router.push` | false |
| target | string | 设为 `_blank` 时新窗口打开 | — |
| customClass | string | 自定义类名 | — |

<br />

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击面包屑项时触发 | event |

<br />
