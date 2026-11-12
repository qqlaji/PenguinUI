<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Watermark 水印

#### 在容器上叠加明暗可调的文字或图片水印，常用于内部资料、敏感信息防护

<br/>

## 基本使用

#### 默认插槽内容为被水印覆盖的区域，通过 _content_ 设置水印文字。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="watermark" demoname="demo1"/>

## 多行与图片水印

#### _content_ 传数组即可多行；设置 _image_ 则改用图片水印，可用 _imageWidth / imageHeight_ 控制绘制尺寸。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="watermark" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>
