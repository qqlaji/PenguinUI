<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# AutoComplete 自动补全

#### 输入时联想候选，支持本地过滤、远程搜索、键盘导航与匹配片段高亮

<br/>

## 基础用法

#### _options_ 支持字符串数组或对象数组，输入内容自动过滤并高亮命中的片段。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="autoComplete" demoname="demo1"/>

## 远程搜索

#### 监听 _search_ 事件异步取数，配合 _loading_ 展示加载态；远程结果无需再本地过滤，设置 _:filterable="false"_ 即可。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="autoComplete" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入或选择后更新绑定值（选中时写入 label） | value: string |
| select | 选中候选项，可拿到完整选项 | option: { label, value, description, icon } |
| search | 输入时触发，适合远程搜索 | query: string |
| change | 值变化时触发 | value: string |
| clear | 点击清空按钮 | —— |
| focus | 聚焦时触发 | event: FocusEvent |
| blur | 失焦时触发 | event: FocusEvent |

## Methods 方法

| 方法名 | 说明 |
| --- | --- |
| focus | 让输入框获得焦点 |
| blur | 让输入框失去焦点 |
| open | 展开下拉面板 |
| close | 收起下拉面板 |

## Slots 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| empty | 自定义无匹配结果的内容 | —— |
| footer | 下拉面板底部内容 | —— |
