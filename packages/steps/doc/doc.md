<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Steps 步骤条
#### 引导用户按流程完成任务的步骤指示器，支持横向 / 竖向、图标节点与自定义状态。

<br />

## 基础用法
#### 通过 `active` 控制当前步骤，已完成的步骤自动高亮连线。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="steps" demoname="demo1"/>

<br />

## 竖向步骤条
#### `direction="vertical"` 适用于详情页的时间线式流程。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="steps" demoname="demo2"/>

<br />

## 图标与自定义状态
#### 通过 `icon` 指定节点图标；通过 `status="error"` 标记异常节点。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="steps" demoname="demo3"/>

<br />

## Steps Attributes

<Attributes/>
<br/>

## Step 子组件属性

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| title | string | 步骤标题 | '' |
| description | string | 步骤描述 | '' |
| icon | string | 节点图标类名（如 t-icon-upload） | '' |
| status | string | 强制状态：wait / process / finish / error | ''（按 active 推导） |

<br />
