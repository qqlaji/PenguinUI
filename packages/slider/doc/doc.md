<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import demo5 from './demo5.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Slider 滑块
#### 通过拖动滑块在一个固定区间内进行选择，支持单值 / 范围、步长、间断点、刻度标记、输入框联动与竖向布局。

<br />

## 基础用法
#### 拖动滑块或点击轨道即可取值，悬浮时在滑块上方展示当前值。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="slider" demoname="demo1"/>

<br />

## 输入框联动 / 间断点 / 禁用
#### `show-input` 开启数字输入联动；`show-stops` 显示步长间断点；`disabled` 禁用。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="slider" demoname="demo2"/>

<br />

## 竖向滑块
#### 设置 `vertical` 并指定 `height` 切换为竖直方向，向上拖动数值增大。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="slider" demoname="demo3"/>

<br />

## 范围选择
#### `range` 开启双滑块，`v-model` 绑定数组 `[start, end]`，与输入框联动时自动约束起止顺序。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="slider" demoname="demo4"/>

<br />

## 刻度标记
#### `marks` 传入 `{ 值: 文案 }`，刻度可点击跳转，位于选区内的刻度会高亮。

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="slider" demoname="demo5"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 拖动过程中实时触发 | number \| number[] |
| input | 同 update:modelValue | number \| number[] |
| change | 拖拽结束（松开）时触发 | number \| number[] |

<br />
