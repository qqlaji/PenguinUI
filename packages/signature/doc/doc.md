<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Signature 手写签名

#### 基于 Canvas 的手写签名板，支持撤销、清空、导出 PNG 与载入已有签名

<br/>

## 基础用法

#### 鼠标拖动或手指书写，_change_ 事件回传 dataURL；点「保存签名」用 _toDataURL_ 导出带白底的图片。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="signature" demoname="demo1"/>

## 笔触、禁用与底色

#### _pen-color_ / _line-width_ 调整笔迹，_disabled_ 锁定画布，_bg-color_ 设置画布底色。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="signature" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| start | 落笔 | { x, y } |
| end | 抬笔 | { dataUrl } |
| change | 笔迹变化 | dataUrl: string |
| clear | 清空 | —— |
| undo | 撤销 | —— |

## Methods 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| clear | 清空画布 | —— |
| undo | 撤销上一笔 | —— |
| toDataURL | 导出图片，可指定底色 | (type?, quality?, bgColor?) |
| download | 触发下载 | filename?: string |
| loadImage | 载入已有图片作为签名 | src: string |

> 画布按 _devicePixelRatio_ 放大像素后缩放，高分屏下笔迹不发虚；撤销采用「落笔前快照」策略，最多保留 30 步。
