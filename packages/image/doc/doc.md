<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Image 图片

#### 带预览能力的图片组件：点击放大，支持缩放、旋转、拖拽与多图切换。

<br />

## 基础用法

#### 设置 `width` / `height` 固定尺寸，`fit="cover"` 保证不留白。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="image" demoname="demo1"/>

<br />

## 多图预览

#### `preview-src-list` 传入图片列表，预览时可用左右箭头或键盘方向键切换。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="image" demoname="demo2"/>

<br />

## 圆形与错误兜底

#### `round` 圆形头像；加载失败时显示默认占位或 `error` 插槽。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="image" demoname="demo3"/>

<br />

## Image Attributes

<Attributes/>
<br/>

## 预览操作

| 操作 | 说明 |
| --- | --- |
| 滚轮 / 工具栏 ± | 缩放（25% ~ 400%） |
| 拖拽 | 放大后可平移图片 |
| 工具栏旋转 | 左右旋转 90° |
| ← / → | 多图切换 |
| Esc | 关闭预览 |

<br />

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| load | 图片加载成功 | (event) |
| error | 图片加载失败 | (event) |
| viewer-open | 预览打开 | (index) |
| viewer-close | 预览关闭 | (index) |
| switch | 多图切换 | (index) |

<br />

## 插槽

| 名称 | 说明 |
| --- | --- |
| mask | 自定义预览遮罩内容 |
| error | 自定义加载失败内容 |

<br />
