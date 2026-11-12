<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import Event from './Events.vue'
import preview from '@/components/preview.vue'
</script>

# ColorPicker 颜色选择器

#### 用于选择颜色，支持取色面板、HEX 输入、透明度与预设色板

<br/>

## 基本使用

#### 通过 _v-model_ 双向绑定颜色值，点击触发器展开取色面板。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="colorPicker" demoname="demo1"/>

## 更多形态

#### 支持 _show-alpha_ 透明度、_size_ 尺寸、_disabled_ 禁用、_clearable_ 清空与 _predefine_ 自定义色板。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="colorPicker" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Event 事件

<Event/>
<br/>
