<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# InputOTP 验证码输入

#### 分格输入的验证码 / 一次性密码框，支持自动跳格、粘贴、退格回退

<br/>

## 基本使用

#### 输入满 _length_ 位后触发 _complete_ 事件；支持整段粘贴自动分配。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="inputOtp" demoname="demo1"/>

## 分隔符 / 密码 / 尺寸 / 状态

#### _separator_ 传数字表示每隔几位插入分隔符，_mask_ 开启遮蔽，_status_ 展示校验态。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="inputOtp" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Event 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化 | (value: string) |
| change | 输入值变化 | (value: string) |
| complete | 输入满位数时触发 | (value: string) |

## 暴露方法

| 方法名 | 说明 |
| --- | --- |
| focus() | 聚焦第一格 |
| clear() | 清空全部输入 |
