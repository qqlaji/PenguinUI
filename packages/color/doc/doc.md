---
title: Color 颜色
---
<script setup>
import demo from './demo.vue';
import preview from '@/components/preview.vue';
</script>

# Color 颜色
#### penguin-ui 的色彩体系：品牌色、语义色、文本色、边框色与阴影色。

<br />

## 调色板

#### 所有色值都可以在下方点击复制。组件库默认使用明亮主题，文档站的暗色主题通过设计令牌覆盖表面色。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="color" demoname="demo"/>

<br />

## 语义色速查

| 用途 | 色值 | 说明 |
| --- | --- | --- |
| 主色 Primary | `#0e80eb` | 主按钮、链接、聚焦环、选中态 |
| 成功 Success | `#09b63d` | 成功提示、正向状态 |
| 警告 Warning | `#f57b29` | 警告提示、待处理状态 |
| 危险 Danger | `#ec3437` | 错误提示、删除操作 |
| 主文本 | `#1c2534` | 标题与正文 |
| 次文本 | `#5b6879` | 说明文字、表格内容 |
| 弱文本 | `#8b96a6` | 占位符、辅助信息 |
| 常规边框 | `#f0f0f0` | 分割线、卡片描边 |
| 控件边框 | `#dcdfe6` | 输入框、选择器 |

<br />

## 边框颜色

#### 边框统一使用 1px 发丝线。下面是四个层级，点击示例卡可复制对应写法：

| 名称 | 色值 / 写法 |
| --- | --- |
| 常规边框 | `1px solid #f0f0f0` |
| 输入控件边框 | `1px solid #dcdfe6` |
| 强调边框 | `1px solid #0e80eb` |
| 主题边框（推荐） | `1px solid var(--pui-border)` |

<br />

## 阴影颜色

#### 三级高度体系，阴影带环境色而不是纯黑，层叠时更自然：

| 层级 | 写法 |
| --- | --- |
| 一级 · 悬浮 | `0 2px 8px rgba(24,44,78,.08)` |
| 二级 · 弹层 | `0 12px 36px rgba(24,44,78,.14)` |
| 三级 · 抽屉 | `0 24px 64px rgba(24,44,78,.20)` |
| 经典写法 | `0 2px 12px 0 rgba(0,0,0,.1)` |

<br />

## 在暗色主题中使用

#### 文档站通过 `[data-theme='dark']` 覆盖语义令牌，组件代码无需改动。推荐在自定义样式里优先引用变量：

```css
.my-card {
  background: var(--pui-bg-elevated);
  border: 1px solid var(--pui-border);
  box-shadow: var(--pui-shadow);
  color: var(--pui-text);
}
```

<br />
