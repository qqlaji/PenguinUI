<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Calendar 日历

#### 整月视图的日期面板，支持年月切换、今日定位、禁用日期与自定义单元格。

<br />

## 基础用法

#### `v-model` 绑定选中的日期，值为 `YYYY-MM-DD` 字符串。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="calendar" demoname="demo1"/>

<br />

## 自定义单元格

#### 通过 `cell` 插槽在日期上叠加标记、日程点等内容。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="calendar" demoname="demo2"/>

<br />

## 禁用日期

#### `disabled-date` 返回 true 的日期不可选择；`size="small"` 更紧凑。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="calendar" demoname="demo3"/>

<br />

## Calendar Attributes

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中日期变化 | (value: string) |
| change | 选中日期变化 | (value: string, date: Date) |
| select | 选中日期 | (date: Date) |

<br />

## 插槽

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| cell | 自定义日期单元格 | { cell, date } |
| header | 头部右侧操作区 | { date } |

<br />
