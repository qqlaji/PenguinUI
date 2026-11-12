<script setup>
import demo1 from './demo1.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Anchor 锚点
#### 长页面中的快速定位导航，随滚动自动高亮当前区块。

<br />

## 基础用法
#### 传入 `links`（`title` + `href`），`container` 指定滚动容器；点击平滑滚动到目标位置，滚动时自动切换高亮。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="anchor" demoname="demo1"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 说明
- `href` 需指向页面中真实存在的元素 id。
- 未指定 `container` 时会自动向上查找最近的可滚动祖先，找不到则回退到 `window`。
- 若页面有固定头部，通过 `offset-top` 设置其高度，避免标题被遮挡。

<br />
