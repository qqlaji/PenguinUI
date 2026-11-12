<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# InputNumber 数字输入框
#### 仅允许输入数字的输入框，带步进按钮、范围限制与精度控制，常用于数量、价格、页码等场景。

<br />

## 基础用法
#### 支持最小值 / 最大值 / 步进 / 精度；越界自动修正。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="inputNumber" demoname="demo1"/>

<br />

## 尺寸
#### 提供 small / default / large 三档尺寸，可实时观察当前值。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="inputNumber" demoname="demo2"/>

<br />

## 无按钮与越界提示
#### 设置 `:controls="false"` 隐藏加减按钮；输入超过范围时边框变红并自动夹取。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="inputNumber" demoname="demo3"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化时触发 | number \| undefined |
| change | 用户改变值时触发 | number \| undefined |
| focus | 获得焦点 | FocusEvent |
| blur | 失去焦点 | FocusEvent |

<br />

## 键盘
#### 聚焦后按 `↑` / `↓` 可直接增减步长。
<br />
