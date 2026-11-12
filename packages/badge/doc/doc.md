<script setup>
import demoBasic from './demoBasic.vue';
import demoMax from './demoMax.vue';
import demoCustom from './demoCustom.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
import demoNew from './demoNew.vue'
</script>

# Badge 徽章
#### 按钮和图标上的数字或状态标记。 

<br />

## 基本使用

<br />

### 可以用来展示新消息的数量。
#### 通过设置 value 来调整标记所展示的内容，支持 Number or String 作为参数

<div class="componetnsBox">
  <demo-basic/>
</div>
<preview compname="badge" demoname="demoBasic"/>

<br />

## 最大值

<br />

### 你还可以自定义最大值。
#### 由max属性定义，它接受一个Number， 要注意的是，该值当且仅当在 value 的值也是 Number 时生效。

<div class="componetnsBox">
  <demo-max/>
</div>
<preview compname="badge" demoname="demoMax"/>

<br />

## 自定义内容

<br />

<div class="componetnsBox">
  <demo-custom/>
</div>
<preview compname="badge" demoname="demoCustom"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## v1.9 新增：零值控制 / 自定义颜色 / 呼吸动画

#### `showZero` 控制 0 是否显示，`dot` 是 isDot 的别名，`color` 覆盖语义色，`pulse` 添加呼吸效果。

<br/>
<div class="componetnsBox">
  <demo-new/>
</div>
<preview compname="badge" demoname="demoNew"/>

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dot | isDot 的别名 | boolean | false |
| color | 自定义徽章颜色 | string | '' |
| showZero | value 为 0 时是否显示 | boolean | true |
| pulse | 呼吸动画 | boolean | false |

<br/>
