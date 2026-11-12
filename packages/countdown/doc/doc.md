<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Countdown 倒计时

#### 距目标时间的实时倒计时，支持自定义单位组合、补零、数字底板与结束回调

<br/>

## 基础用法

#### _value_ 传目标时间（Date / 时间戳 / ISO 字符串），_format_ 里出现哪个字母就显示哪个单位：D 天、H 时、m 分、s 秒。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="countdown" demoname="demo1"/>

## 事件与联动

#### 每秒触发 _change_（剩余毫秒），结束时触发 _finish_，可用于驱动进度条或按钮禁用态。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="countdown" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## Events 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 每秒触发 | remain: number（剩余毫秒） |
| finish | 倒计时结束 | —— |

## Methods 方法

| 方法名 | 说明 |
| --- | --- |
| start | 重新开始计时 |
| stop | 停止计时 |
