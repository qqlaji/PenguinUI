<script setup>
import demo from './demo.vue'
import preview from '@/components/preview.vue'
</script>

# Icon 图标

组件库内置 **230 枚图标**（191 枚字体图标 + 39 枚内联 SVG 图标），全部随包本地发布，**不依赖任何在线 CDN**。

新增图标按「界面 / 状态 / 开发 / 方向 / 分类导航」五类组织，并支持中文关键词检索（如「主题」「箭头」「剪贴板」）；内联 SVG 通过 CSS mask 渲染，可自由缩放与继承 `color`，无需字体文件。其中 8 枚 `cat-*` 分类图形用于文档站分组编码，也可业务复用。

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
| rotate | 旋转角度（deg） | number / string | — |
| flip | 翻转方向：horizontal / vertical / both | string | — |
| pulse | 是否使用脉冲式旋转（比 spin 更柔和） | boolean | false |
| title | 鼠标悬停提示文本 | string | — |

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
