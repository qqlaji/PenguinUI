<script setup>
import demo from './demo.vue';
import Attributes from './Attributes.vue';
import preview from '@/components/preview.vue';
</script>

# Tooltip 文字提示
#### 鼠标悬停、点击或键盘聚焦时展示简短说明；支持四个方向、起止对齐与明暗两种质感。

<br />

## 基础用法

<br />

### 方向、触发方式与自定义内容
#### placement 控制方向（可加 -start / -end），trigger 支持 hover / click / focus / manual，content 插槽可放任意 Vue 内容。

<div class="componetnsBox">
  <demo/>
</div>
<preview compname="tooltip" demoname="demo"/>

<br />

## 气泡宽度与换行

#### 气泡按内容自然展开（width: max-content），超过 maxWidth 才换行，因此中文不会退化成一个字一行的竖条。可用 `placement="top-start"`、`"top-end"` 等 12 种位置。

```vue
<t-tooltip content="一段很长的说明文字……" :max-width="220">
  <t-button size="small">长文本</t-button>
</t-tooltip>

<t-tooltip content="浅色气泡" :dark="false">
  <t-button size="small">浅色</t-button>
</t-tooltip>
```

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:visible | manual 模式下可见性变化 | boolean |
| show / hide | 显示 / 隐藏时触发 | — |

<br />

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 触发元素 |
| content | 自定义提示内容 |

<br />

## 键盘与可访问性

- hover / focus 触发时，触发元素获得焦点即显示气泡，按 `Esc` 可关闭。
- 气泡带 `role="tooltip"` 且不拦截鼠标事件，不会遮挡下方内容。

<br />
