<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import preview from '@/components/preview.vue'
</script>

# Collapse 折叠面板

将复杂内容收纳到可展开的面板中，支持多选展开、手风琴模式、禁用项与自定义标题。

## 基本使用

`v-model` 绑定展开项 `name` 数组，点击标题栏切换展开状态。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="collapse" demoname="demo1"/>

## 手风琴模式

设置 `accordion` 后同时只展开一项，`v-model` 变为单个 `name` 字符串；再次点击当前项可收起。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="collapse" demoname="demo2"/>

## 自定义标题与禁用

使用 `#title` 插槽自定义标题内容；`disabled` 禁用单个面板；`borderless` 去掉外层边框。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="collapse" demoname="demo3"/>

## Collapse Attributes 参数

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model / modelValue | 当前展开项；普通模式为数组，手风琴模式为单个值 | array / string / number | `[]` |
| accordion | 是否启用手风琴模式 | boolean | false |
| borderless | 是否隐藏外层边框与背景 | boolean | false |

## Collapse Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 展开项变化时触发 | 当前展开项（数组或字符串） |
| update:modelValue | 支持 `v-model` 的更新事件 | 当前展开项 |

## CollapseItem Attributes 参数

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板唯一标识，省略时使用组件实例 id | string / number | — |
| title | 标题文本，可被 `#title` 插槽覆盖 | string | — |
| disabled | 是否禁用 | boolean | false |

## CollapseItem Slots 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 面板内容 |
| title | 自定义标题 |
