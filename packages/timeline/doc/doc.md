<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Timeline 时间轴
#### 纵向展示事件发生的时间流，常用于操作记录、版本更新与流程追踪。

<br />

## 基础用法
#### 每个 `t-timeline-item` 由时间戳与内容组成，节点颜色可单独指定。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="timeline" demoname="demo1"/>

<br />

## 图标节点
#### 通过 `icon` 在节点内展示状态图标，`color` 控制节点颜色。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="timeline" demoname="demo2"/>

<br />

## 空心节点与顶部时间戳
#### `hollow` 渲染空心节点；`placement="top"` 将时间戳置于内容上方。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="timeline" demoname="demo3"/>

<br />

## Timeline Item 属性

<Attributes/>
<br />
