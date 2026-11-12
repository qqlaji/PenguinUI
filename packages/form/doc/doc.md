<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Form 表单
#### 用于数据录入与校验的表单容器，内置 `required / email / 正则 / 长度 / 数值范围 / 自定义异步` 校验规则，支持行内、标签方位与整体校验。

<br />

## 基础校验
#### `t-form` 绑定 `model` 与 `rules`，`t-form-item` 通过 `prop` 关联字段；点击提交触发整体校验。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="form" demoname="demo1"/>

<br />

## 行内表单与顶部标签
#### `inline` 开启行内布局；`label-position="top"` 将标签置于控件上方。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="form" demoname="demo2"/>

<br />

## 自定义与异步校验
#### 通过 `validator` 函数返回字符串（失败）或 `true`（通过），支持 `Promise` 异步校验。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="form" demoname="demo3"/>

<br />

## Form Attributes

<Attributes/>
<br/>

## FormItem 属性

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| label | string | 标签文本 | '' |
| prop | string | 表单域字段名 | '' |
| rules | array | 该字段独立规则（覆盖 Form 同名规则） | [] |
| required | boolean | 是否必填（自动加红星） | false |

<br />

## Form 方法（ref 调用）

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| validate() | 校验全部字段 | Promise<{ valid, errors }> |
| validateField(prop) | 校验单个字段 | Promise<{ valid, errors }> |
| resetFields() | 重置为初始值并清除校验 | — |
| clearValidate(props?) | 清除校验状态 | — |

<br />

## 校验规则字段

| 字段 | 说明 |
| --- | --- |
| required | 必填 |
| type | string / number / email |
| pattern | 正则表达式 |
| min / max | 数值范围或字符串长度 |
| len | 精确长度 |
| trigger | blur / change |
| validator | 自定义函数，可返回字符串或 Promise |

<br />
