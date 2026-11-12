<script setup>
import Attributes from './Attributes.vue'
import demoBasic from './demoBasic.vue'
import demoText from './demoText.vue'
import demoDash from './demoDash.vue'
import demoDire from './demoDire.vue'
import preview from '@/components/preview.vue'
</script>

# Divider 分割线
#### 区隔内容的分割线：支持水平 / 垂直、三种文案位置、任意线条样式与自定义颜色。

<br />

## 基本使用

### 对不同段落的文本进行分割。

<div class="componetnsBox">
  <demo-basic/>
</div>
<preview compname="divider" demoname="demoBasic"/>

<br />

## 设置文案

### 通过默认插槽放文案或图标，`position` 决定它靠左、居中还是靠右。

<div class="componetnsBox">
  <demo-text/>
</div>
<preview compname="divider" demoname="demoText"/>

<br />

## 自定义样式

### `lineStyle` 直接映射到 CSS `border-style`；`color` 可覆盖主题线色。

<div class="componetnsBox">
  <demo-dash/>
</div>
<preview compname="divider" demoname="demoDash"/>

<br />

## 垂直分隔线

### 常用于工具栏、面包屑等行内场景，高度跟随所在行的字号。

<div class="componetnsBox">
  <demo-dire/>
</div>
<preview compname="divider" demoname="demoDire"/>

<br />

## Attributes 参数

<Attributes/>
<br/>
