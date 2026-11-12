<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Mentions 提及

#### 在文本域中输入触发符唤起候选人列表，支持关键词过滤、键盘选择与自定义插入分隔符

<br/>

## 基础用法

#### 输入 _@_ 唤起成员列表，上下键移动、回车或 Tab 插入，插入后自动补一个空格。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="mentions" demoname="demo1"/>

## 自定义前缀与选项

#### _prefix_ 换成 _#_ 可做话题选择；_filterable_ 关闭后展示全部候选，也可用 _#option_ 插槽完全自定义。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="mentions" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 文本变化 | value: string |
| select | 选中候选人 | option: { label, value, description, avatar } |
| search | 唤起面板或关键词变化 | (query: string, prefix: string) |
| change | 文本变化 | value: string |
| focus | 聚焦 | event: FocusEvent |
| blur | 失焦 | event: FocusEvent |

## Slots 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| option | 自定义候选项内容 | { option, index } |
| empty | 无匹配时的内容 | —— |
