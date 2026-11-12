<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# DatePicker 日期选择器
#### 在日期、月份、年份、日期时间与起止范围之间选择，支持自定义格式、清空、禁用日期与时分秒。

<br />

## 基础用法
#### 点击输入框展开日历，选择日期后自动回填；`clearable` 支持一键清空，`format` / `value-format` 分别控制展示与绑定值格式。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="datePicker" demoname="demo1"/>

<br />

## 月份 / 年份
#### `type="month"`、`type="year"` 直接以月/年粒度选择；点击面板标题可在 日 / 月 / 年 视图之间逐级切换。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="datePicker" demoname="demo2"/>

<br />

## 日期时间
#### `show-time` 或 `type="datetime"` 打开时分秒三列，右侧列可滚动，选中后点「确定」提交。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="datePicker" demoname="demo3"/>

<br />

## 起止范围
#### `range` 开启左右双月面板：先点开始日期，再点结束日期；悬停时实时预览区间。配合 `show-time` 可分别设置开始/结束时间。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="datePicker" demoname="demo4"/>

<br />

## 禁用日期
#### `disabled-date` 返回 `true` 的日期不可选，可用于限制「今天之前」「周末」等范围。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="datePicker" demoname="demo5"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | value |
| change | 确定选择时触发 | value |
| clear | 点击清空时触发 | — |
| visible-change | 面板展开/收起 | boolean |

<br />

## 说明
- `range` 的 `v-model` 为数组，顺序始终为 `[开始, 结束]`。
- `value-format` 留空时绑定值为 `Date` 对象；设为 `timestamp` 返回毫秒时间戳。
- 旧的 `Date` 日期组件仍然保留，两者可按需选用。

<br />
