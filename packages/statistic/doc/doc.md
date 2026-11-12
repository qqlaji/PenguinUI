<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Statistic 统计数值
#### 展示统计数据，支持千分位、精度、前后缀与数字滚动动画，常用于仪表盘、数据看板。

<br />

## 基础用法
#### 通过 `precision` 控制小数位，`prefix` / `suffix` 添加货币符号与单位，默认开启千分位。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="statistic" demoname="demo1"/>

<br />

## 数字滚动
#### 设置 `count-up` 后，数值会从 0 平滑滚动到目标值；数值更新时从当前值滚动到新值。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="statistic" demoname="demo2"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| title | 自定义标题 |
| prefix | 自定义前缀 |
| suffix | 自定义后缀 |

<br />
