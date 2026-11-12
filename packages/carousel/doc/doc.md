<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Carousel 走马灯
#### 多张内容循环切换的展示组件，支持自动播放、箭头与指示器显隐控制，常用于 Banner 与通知墙。

<br />

## 基础用法
#### 默认开启自动播放与指示器；悬停显示左右切换箭头。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="carousel" demoname="demo1"/>

<br />

## 手动切换
#### `:autoplay="false"` 关闭自动播放；`arrow="always"` 常显箭头；`indicator="hover"` 悬停显示指示点。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="carousel" demoname="demo2"/>

<br />

## 自定义内容
#### 每个 `t-carousel-item` 内可放置任意内容。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="carousel" demoname="demo3"/>

<br />

## Carousel Attributes

<Attributes/>
<br/>

## 方法（ref 调用）

| 方法 | 说明 |
| --- | --- |
| next() | 下一张 |
| prev() | 上一张 |
| go(index) | 跳转到指定页 |

<br />
