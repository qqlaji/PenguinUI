<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import demo4 from './demo4.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
import demo5 from './demo5.vue'
</script>

# Message 消息提示

#### 常用于交互反馈提示场景

<br/>

## 基本使用

#### message 消息提示基本使用示例。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="message" demoname="demo1"/>

#### 你也可以通过获取组件实例的方式来调用。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="message" demoname="demo2"/>

## 不同状态

#### 可根据 _Message_ 参数的 _type_ 来定义显示不同的状态。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="message" demoname="demo3"/>

## 拓展自定义配置

#### 可根据不同场景自定义 _icon_ 图标及 _timeout_ 消失时间。

<div class="componetnsBox">
  <demo4/>
</div>
<preview compname="message" demoname="demo4"/>

## Attributes 参数

<Attributes/>
<br/>

## v1.9 新增：自定义时长 / 手动关闭 / 消息堆叠

#### `duration` 是 `timeout` 的别名；`closable` 显示关闭按钮；多条消息会自动依次下移，也可用 `offset` 指定位置。调用 `Message()` 会返回销毁函数。

<br/>
<div class="componetnsBox">
  <demo5/>
</div>
<preview compname="message" demoname="demo5"/>

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| duration | 显示时长（ms），等价于 timeout | number | 2500 |
| closable | 是否显示关闭按钮 | boolean | false |
| offset | 距顶部的像素值，默认自动堆叠 | number | 自动 |

```js
const destroy = Message({ text: '保存成功', type: 'success', closable: true })
// destroy() 可提前关闭这条消息
```

<br/>
