<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import preview from '@/components/preview.vue'
</script>

# Resizable 伸缩框

#### 通过鼠标拖拽改变元素尺寸，支持单组件伸缩与多面板组合伸缩

<br />

## 基础用法

#### 拖拽边框或四角手柄改变尺寸，`v-model:width` / `v-model:height` 双向绑定。尺寸超出父容器时会被自动钳制。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="resizable" demoname="demo1"/>

<br />

## 单方向与锁定比例

#### `handles` 限定可拖拽的方向；`aspect-ratio` 锁定宽高比。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="resizable" demoname="demo2"/>

<br />

## 组合伸缩

#### `t-resizable-group` 里的多个面板通过分隔条联动伸缩，总尺寸保持不变。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="resizable" demoname="demo3"/>

<br />

## t-resizable Attributes

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| width | number \| string | 宽度（受控，支持 `v-model:width`） | — |
| height | number \| string | 高度（受控，支持 `v-model:height`） | — |
| minWidth | number | 最小宽度 | `100` |
| minHeight | number | 最小高度 | `60` |
| maxWidth | number | 最大宽度 | `Infinity` |
| maxHeight | number | 最大高度 | `Infinity` |
| handles | string \| array | 手柄方向：`all` / `horizontal` / `vertical` / `corner`，或 `['right','bottom']` | `'all'` |
| grid | number | 拖拽步长（px），1 表示连续 | `1` |
| aspectRatio | boolean | 是否锁定宽高比 | `false` |
| ratio | number | 宽高比数值，默认按初始尺寸计算 | `0` |
| disabled | boolean | 禁用拖拽 | `false` |
| customClass | string | 自定义类名 | `''` |

**事件**

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:width | 宽度变化 | `number` |
| update:height | 高度变化 | `number` |
| resize | 拖拽过程中持续触发 | `{ width, height, dir }` |
| resize-start | 开始拖拽 | `{ width, height, dir }` |
| resize-end | 结束拖拽 | `{ width, height, dir, changed }` |
| handle-dblclick | 双击手柄 | `dir` |

**方法**：`setSize(w, h)`、`getSize()`

<br />

## t-resizable-group Attributes

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| defaultSizes | array | 各面板占比数组，长度即面板数量（`v-model:default-sizes`） | `[1, 1]` |
| direction | string | `horizontal` / `vertical` | `'horizontal'` |
| minSize | number | 每个面板的最小像素尺寸 | `80` |
| maxSize | number | 单个面板最大像素尺寸 | `Infinity` |
| size | number \| string | 整体固定宽（水平）/ 高（垂直） | `100%` |
| dividerSize | number | 分隔条粗细（px） | `8` |
| disabled | boolean | 禁用拖拽与键盘调整 | `false` |

**插槽**：`#panel-0`、`#panel-1`… 按索引提供，也可用 `#panel-{id}`。
双栏时可用更直观的 `#start` / `#end`。

**键盘**：分隔条获得焦点后，`←/→`（竖向为 `↑/↓`）每次移动 8px，
按住 `Shift` 为 32px，`Home` / `End` 推到两端。

<br />

## 说明

- 拖拽使用 Pointer Events，同时支持鼠标、触屏与手写笔
- 尺寸计算走 `requestAnimationFrame` 节流，拖动时不触发高频重排
- `handles` 为四边时会内置 8px 的透明抓取区，鼠标移到边框附近即可拖动
- 组合伸缩永远不会把面板拖到 0 宽，`minSize` 是硬性下限
