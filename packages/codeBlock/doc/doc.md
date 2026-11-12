<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# CodeBlock 代码块

#### 零依赖语法高亮，支持行号、复制、折叠与明暗双主题

<br/>

## 基础用法

#### _code_ 传代码文本，_lang_ 指定语言；右上角有复制按钮，复制成功后图标切换为对勾。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="codeBlock" demoname="demo1"/>

## 主题、行号与折叠

#### _theme_ 切换深浅配色，_line-numbers_ 控制行号，_collapsible_ 在内容超阈值时自动出现展开 / 收起。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="codeBlock" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## 支持的语言

| 语言 | 标识 | 说明 |
| --- | --- | --- |
| JavaScript | `js` / `javascript` / `jsx` | 关键字、字符串、模板串、注释、数字、函数名 |
| TypeScript | `ts` / `typescript` / `tsx` | 含 interface / type / 泛型等关键字 |
| Vue / HTML | `vue` / `html` / `xml` | 标签、属性、HTML 注释 |
| CSS / SCSS | `css` / `scss` / `less` | 选择器、属性、颜色值、注释 |
| JSON | `json` | 键值、字符串、数字、布尔 |
| Shell | `bash` / `sh` / `shell` | 命令、`#` 注释 |
| 其他 | 任意 | 只做 HTML 转义，不染色 |

> 高亮采用逐字符状态机而非正则替换：正则会把字符串里的 `//` 误判成注释，也会重复匹配已包裹的标签。

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| copy | 复制成功 | code: string |

## Methods 方法

| 方法名 | 说明 |
| --- | --- |
| copy | 手动触发复制 |
