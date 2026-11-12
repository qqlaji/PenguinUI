<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# ImageViewer 图片查看器

#### 全屏图片预览，支持滚轮缩放、拖拽平移、旋转、多图切换与键盘操作

<br/>

## 基础用法

#### _images_ 传图片列表，点击缩略图打开；打开后用滚轮或工具栏缩放，放大后可拖拽平移。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="imageViewer" demoname="demo1"/>

## 单图模式

#### _showThumbnails_ 关闭缩略图条，列表只有一张时左右切换也会自动隐藏；_mask-closable_ 控制点遮罩是否关闭。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="imageViewer" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## 快捷键

| 按键 | 说明 |
| --- | --- |
| `←` / `→` | 上一张 / 下一张 |
| `+` / `-` | 放大 / 缩小 |
| `0` | 重置缩放与旋转 |
| `Esc` | 关闭 |

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 显示状态变化 | visible: boolean |
| update:current | 当前索引变化 | index: number |
| change | 切换图片 | index: number |
| close | 关闭 | index: number |

## Methods 方法

| 方法名 | 说明 |
| --- | --- |
| zoomBy | 按步长缩放，参数可正可负 |
| rotateBy | 旋转指定角度 |
| reset | 重置缩放、旋转与位移 |
| prev / next | 上一张 / 下一张 |
| goTo | 跳到指定索引 |
| close | 关闭 |
