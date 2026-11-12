<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# ConfigProvider 全局配置

#### 用 provide / inject 下发主色、尺寸、圆角、文案等全局配置，支持多层嵌套与就近覆盖

<br/>

## 基础用法

#### 包裹在应用最外层，_primary-color_ / _radius_ / _size_ 会以 CSS 变量与注入值两种方式同时生效。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="configProvider" demoname="demo1"/>

## 主题与嵌套

#### _theme_ 切换浅色 / 深色令牌，内层 ConfigProvider 只覆写自己声明的字段，其余继承外层。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="configProvider" demoname="demo2"/>

## Attributes 参数

<Attributes/>
<br/>

## 读取配置

组件内部或业务代码都可用 `useConfig()` 读取当前生效配置：

```js
import { useConfig } from 'penguinui'

const { config, size, theme, primaryColor } = useConfig()
console.log(config.value.pageSize)
```

未包裹 ConfigProvider 时返回默认值，无需判空。

## 默认配置

| 字段 | 说明 | 默认值 |
| --- | --- | --- |
| size | 组件默认尺寸 | `default` |
| primaryColor | 主色 | `#0e80eb` |
| radius | 圆角基准 | `10` |
| theme | 主题 | `light` |
| emptyText | 空状态文案 | `暂无数据` |
| loadingText | 加载中文案 | `加载中...` |
| pageSize | 分页每页条数 | `10` |
| pageSizes | 分页可选条数 | `[10, 20, 50, 100]` |
| dateFormat | 日期格式 | `YYYY-MM-DD` |
