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
import preview from '@/components/preview.vue'
import demo9 from './demo9.vue'
</script>

# Input 输入框

#### 数据输入框类型，通过键盘输入字符

<br/>

## 基本使用

#### input 的基本使用

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="input" demoname="demo1"/>

## 禁用状态

#### input 的禁用状态，通过 _disabled_ 属性限制输入及操作

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="input" demoname="demo2"/>

## 可清空数据

#### input 的 value 可快捷清空，通过 _clearable_ 属性启用

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="input" demoname="demo3"/>

## 带图标

#### 可使用 _leftIcon_ 或者 _rightIcon_ 来定义显示图标并确定显示的位置。需要注意的是如果定义了右侧显示图标，那 _clearable_ 将不再起作用

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="input" demoname="demo4"/>

## 不同大小

#### 通过设置 _size_ 属性来适应不同大小

<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="input" demoname="demo5"/>

## 组合输入

#### 可通过插槽完成组合输入，插槽名默认为 _btn_

<div class="componetnsBox">
  <demo6/>
</div>
<preview compname="input" demoname="demo6"/>

## 密码类型

#### 密码类型的输入框，可通过 _showPassword_ 来启用是否开启显示密码

<div class="componetnsBox">
  <demo7/>
</div>
<preview compname="input" demoname="demo7"/>

## 自定义 Focus 颜色

#### 通过 _focusColor_ 属性自定义 input 在获取焦点后的颜色

<div class="componetnsBox">
  <demo8/>
</div>
<preview compname="input" demoname="demo8"/>

## Attributes 参数

<Attributes/>
<br/>

## Event 事件

<Event/>
<br/>

## v1.9 新增：前后缀 / 字数统计 / 校验状态

#### 通过 `prefix` / `suffix` 插槽添加组合内容，`showWordLimit` 显示字数，`status` 切换校验边框色。

<br/>
<div class="componetnsBox">
  <demo9/>
</div>
<preview compname="input" demoname="demo9"/>

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prefixIcon / suffixIcon | leftIcon / rightIcon 的语义化别名 | string | '' |
| maxlength | 最大输入长度 | number / string | — |
| showWordLimit | 显示字数统计 | boolean | false |
| status | error / success / warning | string | '' |

| 插槽 | 说明 |
| --- | --- |
| prefix | 输入框左侧附加内容 |
| suffix | 输入框右侧附加内容 |

<br/>
