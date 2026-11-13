<template>
  <div class="dm-demo2">
    <div class="dm-demo2__row">
      <!-- 指定 trigger：只有把手可以拖 -->
      <div class="dm-demo2__stage">
        <t-drag-move v-model:x="x1" v-model:y="y1" trigger=".dm-demo2__handle" bounds="parent">
          <div class="dm-demo2__panel">
            <div class="dm-demo2__handle">
              <i class="iconfont t-icon-menu" aria-hidden="true"></i>
              按住把手拖动
            </div>
            <div class="dm-demo2__body">
              内容区不参与拖拽，<br />里面的链接和按钮可以正常点。
              <br /><br />
              <a href="#/penguinui/dragMove" class="dm-demo2__link">这是一个链接</a>
            </div>
          </div>
        </t-drag-move>
      </div>

      <!-- 网格吸附 -->
      <div class="dm-demo2__stage dm-demo2__stage--grid">
        <t-drag-move v-model:x="x2" v-model:y="y2" :grid="32" bounds="parent">
          <div class="dm-demo2__snap">吸附 32px</div>
        </t-drag-move>
      </div>
    </div>

    <t-typography type="secondary" size="small" block>
      <code>trigger</code> 指定选择器后，只有匹配的元素能触发拖拽，适合窗口标题栏；
      <code>grid</code> 会让位置吸附到网格；输入框、按钮、链接默认不会启动拖拽。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const x1 = ref(16);
const y1 = ref(16);
const x2 = ref(8);
const y2 = ref(8);
</script>

<style lang="scss" scoped>
.dm-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dm-demo2__row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.dm-demo2__stage {
  position: relative;
  width: 260px;
  height: 200px;
  border: 1px dashed var(--pui-border-strong, #c9d3e0);
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
  overflow: hidden;

  &--grid {
    background-image:
      linear-gradient(var(--pui-grid-line, #e3e9f2) 1px, transparent 1px),
      linear-gradient(90deg, var(--pui-grid-line, #e3e9f2) 1px, transparent 1px);
    background-size: 32px 32px;
  }
}
.dm-demo2__panel {
  width: 200px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 9px;
  background: var(--pui-bg-elevated, #fff);
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(24, 44, 78, 0.09);
}
.dm-demo2__handle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-bottom: 1px solid var(--pui-border, #e7ecf3);
  background: var(--pui-bg-soft, #f7f9fc);
  font-size: 12px;
  color: var(--pui-text-sub, #5b6879);
  cursor: grab;
  user-select: none;

  i { font-size: 11px; color: var(--pui-text-muted, #8b96a6); }
}
.dm-demo2__body {
  padding: 10px;
  font-size: 12px;
  line-height: 1.8;
  color: var(--pui-text-sub, #5b6879);
}
.dm-demo2__link {
  color: var(--pui-brand, #0e80eb);
  font-size: 12px;
}
.dm-demo2__snap {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--pui-brand, #0e80eb);
  border-radius: 8px;
  background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
  color: var(--pui-brand, #0e80eb);
  font-size: 12px;
  cursor: grab;
  user-select: none;
}
</style>
