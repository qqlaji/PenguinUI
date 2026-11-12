<template>
  <div class="tp-demo2">
    <t-typography block strong>单行省略</t-typography>
    <t-typography class="tp-demo2__line" ellipsis>
      PenguinUI 是一套面向 Vue 3 的轻量级组件库，强调一致的设计语言、可预测的交互与开箱即用的类型提示。
    </t-typography>

    <t-typography block strong>多行省略 + 展开收起</t-typography>
    <t-typography
      class="tp-demo2__multi"
      :ellipsis="{ rows: 2 }"
      expandable
      @expand="onExpand"
    >
      组件库的视觉规范由设计令牌统一驱动：圆角、间距、语义色、阴影与动效时长都通过 CSS 变量下发，
      因此既能保持默认的清爽风格，也能在业务侧覆盖为品牌色调。所有交互组件都遵循键盘可达、
      焦点可见、状态可读的原则，弹层类组件统一使用 fixed 定位并做视口钳制，避免被容器裁切。
    </t-typography>

    <t-typography block strong>可复制</t-typography>
    <div class="tp-demo2__copy">
      <t-typography code copyable copy-text="npm install penguinui">npm install penguinui</t-typography>
      <t-typography type="secondary" size="small" copyable text="复制成功后会短暂显示对勾" @copy="onCopy">
        点右侧图标复制这段说明
      </t-typography>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const onExpand = () => proxy.$message({ text: '已展开全文', type: 'success', timeout: 1200 });
const onCopy = () => proxy.$message({ text: '内容已复制到剪贴板', type: 'success', timeout: 1600 });
</script>

<style lang="scss" scoped>
.tp-demo2 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 640px;
}
.tp-demo2__line {
  width: 100%;
}
.tp-demo2__multi {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
  color: var(--pui-text-sub, #5b6879);
}
.tp-demo2__copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
