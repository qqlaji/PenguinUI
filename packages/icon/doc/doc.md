<script setup>
import demo from './demo.vue'
import preview from '@/components/preview.vue'
</script>

# Icon 图标

组件库内置 190+ 枚图标，字体与新增图标全部随包本地发布，**不依赖任何在线 CDN**。

## 用法一：t-icon 组件（推荐）

```html
<t-icon name="search" />
<t-icon name="t-icon-search" size="24" color="#0e80eb" />
<t-icon name="loading1" spin />
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 图标名，可省略 `t-icon-` 前缀 | string | 必填 |
| size | 图标大小，数字按 px 处理 | number / string | — |
| color | 图标颜色，默认继承父级文字色 | string | — |
| spin | 是否旋转（用于加载图标） | boolean | false |

## 用法二：类名写法（完全兼容旧代码）

```html
<i class="t-icon-search"></i>
<i class="iconfont t-icon-search"></i>
```

<br/>

<i class="iconfont t-icon-search" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-scanning" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-menu" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-edit" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-fabulous" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-good" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-github" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-gitee" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-penguin" style="font-size:25px;margin-right:20px"></i>
<i class="iconfont t-icon-spinner6" style="font-size:25px;margin-right:20px"></i>

<br/>

<demo/>

<br/>

## 示例源码

<preview compname="icon" demoname="demo"/>
