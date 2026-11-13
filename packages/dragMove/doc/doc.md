<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import preview from '@/components/preview.vue'
</script>

# DragMove 拖拽移动

#### 让任意元素可以被拖动改变位置，支持限制拖拽范围与自定义触发元素

<br />

## 基础用法

#### 通过 `v-model:x` / `v-model:y` 双向绑定位置，`bounds="parent"` 把拖动范围限制在父容器内。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="dragMove" demoname="demo1"/>

<br />

## 自定义触发区与网格吸附

#### `trigger` 指定只有某部分能拖动；`grid` 让位置吸附到网格。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="dragMove" demoname="demo2"/>

<br />

## Attributes

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| x | number | 水平位移（受控，支持 `v-model:x`） | — |
| y | number | 垂直位移（受控，支持 `v-model:y`） | — |
| defaultX | number | 非受控时的初始 x | `0` |
| defaultY | number | 非受控时的初始 y | `0` |
| bounds | string \| function | 拖拽范围：`'parent'` / `'viewport'` / CSS 选择器 / 返回 `{left,top,right,bottom}` 的函数 | `'parent'` |
| trigger | string | 只有匹配该选择器的元素能触发拖拽（默认整块可拖） | `''` |
| grid | number | 网格吸附步长（px），1 表示连续 | `1` |
| preventSelect | boolean | 拖拽时阻止文本选中 | `true` |
| disabled | boolean | 禁用拖拽 | `false` |
| raiseOnDrag | boolean | 拖拽时提升层级，避免被遮挡 | `true` |
| customClass | string | 自定义类名 | `''` |

**事件**

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:x / update:y | 位置变化 | `number` |
| drag-start | 开始拖动 | `{ x, y }` |
| drag | 拖动中持续触发 | `{ x, y }` |
| drag-end | 结束拖动 | `{ x, y, moved }` |
| click | 未发生位移的点击 | `MouseEvent` |

**方法**：`reset()`、`moveTo(x, y)`、`getPosition()`

**插槽**：`default`（内容）、`handle`（配置 `trigger` 时的把手内容）

<br />

## 说明

- 位置用 `transform: translate3d()` 实现，不触发重排，拖动流畅
- 边界计算基于元素**静态位置 + 当前位移**反推，因此父容器尺寸变化后约束依然正确
- 默认会跳过 `input`、`textarea`、`button`、`a`、`[contenteditable]` 上的拖拽，避免误触；给元素加 `data-drag-ignore` 也可排除
- 用 Pointer Events 实现，触屏与手写笔同样可用
