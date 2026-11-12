<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# TimePicker 时间选择器
#### 通过滚动列快速选择时 / 分 / 秒，支持 `HH:mm` 与 `HH:mm:ss` 两种格式，可清空与禁用。

<br />

## 基础用法
#### v-model 绑定字符串时间；面板按列滚动选取，自动滚动到当前值。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="timePicker" demoname="demo1"/>

<br />

## 带秒与不可清空
#### `format="HH:mm:ss"` 显示秒列；`clearable=false` 隐藏清空按钮。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="timePicker" demoname="demo2"/>

<br />

## 禁用
#### `disabled` 禁用选择器。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="timePicker" demoname="demo3"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选择时间时触发 | string |
| change | 选择时间时触发 | string |

<br />
