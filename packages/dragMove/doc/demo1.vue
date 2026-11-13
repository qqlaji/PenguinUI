<template>
  <div class="dm-demo1">
    <!-- 拖拽舞台 -->
    <div ref="stageRef" class="dm-demo1__stage">
      <t-drag-move
        v-model:x="x"
        v-model:y="y"
        bounds="parent"
        @drag-start="dragging = true"
        @drag-end="dragging = false"
      >
        <div class="dm-demo1__card" :class="{ 'is-dragging': dragging }">
          <i class="iconfont t-icon-menu dm-demo1__grip" aria-hidden="true"></i>
          <span class="dm-demo1__label">拖我</span>
        </div>
      </t-drag-move>

      <span class="dm-demo1__hint">区域内可自由拖动，不会超出虚线框</span>
    </div>

    <div class="dm-demo1__meta">
      <t-tag size="small" effect="light">x: {{ Math.round(x) }}</t-tag>
      <t-tag size="small" effect="light">y: {{ Math.round(y) }}</t-tag>
      <t-button size="small" @click="reset">复位</t-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const x = ref(20);
const y = ref(20);
const dragging = ref(false);
const stageRef = ref(null);

const reset = () => {
  x.value = 20;
  y.value = 20;
};
</script>

<style lang="scss" scoped>
.dm-demo1 {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dm-demo1__stage {
  position: relative;
  height: 260px;
  border: 1px dashed var(--pui-border-strong, #c9d3e0);
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
  overflow: hidden;

  /* 点阵背景，方便看出位移 */
  background-image: radial-gradient(var(--pui-grid-line, #dde4ee) 1px, transparent 1px);
  background-size: 16px 16px;
}
.dm-demo1__card {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 9px;
  background: var(--pui-bg-elevated, #fff);
  box-shadow: 0 4px 14px rgba(24, 44, 78, 0.1);
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.15s ease, transform 0.15s ease;

  &.is-dragging {
    cursor: grabbing;
    box-shadow: 0 10px 26px rgba(24, 44, 78, 0.18);
    transform: scale(1.03);
  }
}
.dm-demo1__grip {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.dm-demo1__label {
  font-size: 13px;
  color: var(--pui-text, #1c2534);
}
.dm-demo1__hint {
  position: absolute;
  left: 12px;
  bottom: 10px;
  font-size: 11.5px;
  color: var(--pui-text-muted, #8b96a6);
  pointer-events: none;
}
.dm-demo1__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
