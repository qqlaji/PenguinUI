<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Backtop 回到顶部
#### 用于快捷返回页面或指定滚动容器的顶部，支持阈值显示、平滑滚动与自定义按钮。

<br />

## 基本使用

#### 默认监听 window 滚动，超过 240px 后出现在视口右下角。下面的示例用 `:fixed="false"` 把按钮内嵌到演示框中，方便直接查看效果。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="backtop" demoname="demo1"/>

<br />

## 绑定指定元素

#### 传入 `target` 选择器监听某个可滚动容器；`visibilityHeight` 控制出现阈值。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="backtop" demoname="demo2"/>

<br />

## 自定义元素展示

#### 通过默认插槽替换按钮外观。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="backtop" demoname="demo3"/>

<br />

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发 | — |

<br />

## Attributes 参数

<Attributes/>
<br/>
