<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Form 表单
#### 用于数据录入与校验的表单容器，内置 `required / type / pattern / 长度 / 值域 / 自定义异步` 校验，支持 Promise 风格的整体校验、单字段校验与重置。

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

## 完整示例：Promise 校验 / 重置 / 联动 / 异步
#### 覆盖 `validate()` 抛异常与 `validateQuietly()` 布尔返回两种调用方式、`resetFields()` 重置、`scrollToError` 定位、`transform` 类型转换、跨字段联动校验与远程昵称查重。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="form" demoname="demo4"/>

<br />

## Form Attributes

<Attributes/>
<br/>

## FormItem 属性

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| label | string | 标签文本 | '' |
| prop | string | 表单域字段名，对应 model 的键 | '' |
| rules | array | 该字段独立规则（覆盖 Form 同名规则） | [] |
| required | boolean | 是否必填（自动加红星并生成规则） | false |
| error | string | 手动错误信息，优先级最高 | '' |
| labelPosition | string | 标签位置：right / left / top | 继承 Form |
| labelWidth | string \| number | 标签宽度 | 继承 Form |
| validateTrigger | string \| array | 触发校验的时机：blur / change | 由规则决定 |

<br />

## Form 方法（ref 调用）

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| validate() | 校验全部字段 | `Promise<true>`，失败时 **reject** 一个带 `fields` 的 Error |
| validateQuietly() | 同上但不抛异常 | `Promise<boolean>` |
| validateField(prop \| prop[]) | 校验指定字段 | `Promise<Array>` |
| resetFields() | 重置为初始值并清除校验 | — |
| clearValidate(props?) | 只清除校验状态，不改值 | — |
| setInitialValues(model) | 重设「初始值」快照（编辑页回填后重置用） | — |
| submit() | 校验通过后 emit `submit` | `Promise<boolean>` |

<br />

### validate() 的两种用法

```js
// 1. try/catch —— 能拿到第一个错误的文案与失败字段
try {
  await formRef.value.validate();
  // 通过
} catch (e) {
  console.log(e.message);  // 第一个错误的 message
  console.log(e.fields);   // [{ prop, errors, element }]
}

// 2. 布尔版 —— 只关心"能不能提交"
if (await formRef.value.validateQuietly()) {
  doSubmit();
}
```

<br />

## 校验规则字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| required | boolean | 必填（空值时不再跑后续规则） |
| type | string | `string` / `number` / `integer` / `boolean` / `array` / `email` / `url` / `date` |
| pattern | RegExp \| string | 正则匹配 |
| min / max | number | 数字→值域；字符串/数组→长度 |
| len | number | 精确长度 |
| enum | array | 枚举白名单 |
| trigger | string \| array | `blur` / `change`，不写则任何时机都校验 |
| transform | function | 校验前对值做转换，如 `v => Number(v)` |
| validator | function | `(rule, value, model) => boolean \| string \| Error \| Promise` |
| message | string | 错误文案 |

<br />

## 规则预设

```js
import { rulePresets } from 'penguinui';

const rules = {
  name: [rulePresets.required('姓名')],
  phone: [rulePresets.phone()],
  email: [rulePresets.email()],
  age: [rulePresets.range(18, 60, '年龄')]
};
```

<br />

## 说明

- `0` 与 `false` **不算空值**，`required` 不会误报
- 非必填字段为空时，其余规则全部跳过，不会因为空值报「格式错误」
- `type` 校验失败后直接返回，不再跑 `min/max`，避免一条数据报多个错
- 字段校验**并发执行**，不会因为某个字段的异步校验而串行等待
- `resetFields()` 使用类型感知的克隆（保留 `Date` / `File`），不像 `JSON` 深拷贝那样丢类型
- 开启 `scroll-to-error` 后校验失败会自动滚动到第一个错误字段并聚焦输入框
