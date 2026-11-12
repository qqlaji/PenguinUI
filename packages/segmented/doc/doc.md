<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Segmented 分段控制器

#### 在多个互斥选项间切换，滑块跟随移动，适合视图切换、时间粒度切换等场景。

<br />

## 基础用法

#### `v-model` 绑定选中值，`options` 传入选项数组。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="segmented" demoname="demo1"/>

<br />

## 尺寸 / 撑满 / 禁用

#### `size` 控制尺寸，`block` 撑满宽度，`disabled` 整体禁用。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="segmented" demoname="demo2"/>

<br />

## 图标与禁用项

#### 选项支持 `icon` 图标与单独 `disabled`。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="segmented" demoname="demo3"/>

<br />

## Segmented Attributes

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | (value) |
| change | 选中值变化 | (value, index) |

<br />
