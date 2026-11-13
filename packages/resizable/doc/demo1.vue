<template>
  <div class="rs-demo1">
    <t-resizable
      v-model:width="w"
      v-model:height="h"
      :min-width="160"
      :min-height="100"
      class="rs-demo1__box"
    >
      <div class="rs-demo1__inner">
        <div class="rs-demo1__size">{{ w }} × {{ h }}</div>
        <div class="rs-demo1__tip">拖动边框或四角手柄改变尺寸</div>
      </div>
    </t-resizable>

    <div class="rs-demo1__meta">
      <t-typography type="secondary" size="small" block>
        默认 8 个方向手柄全部可用，最小尺寸分别为 <code>min-width</code> /
        <code>min-height</code>。拖到边界外会被自动钳制，不会跑出父容器。
      </t-typography>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const w = ref(300);
const h = ref(180);
</script>

<style lang="scss" scoped>
.rs-demo1 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.rs-demo1__box {
  border: 1px dashed var(--pui-brand, #0e80eb);
  border-radius: 10px;
  background: var(--pui-brand-soft, rgba(14, 128, 235, 0.06));
}
.rs-demo1__inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  padding: 12px;
}
.rs-demo1__size {
  font-size: 16px;
  font-weight: 650;
  color: var(--pui-brand, #0e80eb);
  font-variant-numeric: tabular-nums;
}
.rs-demo1__tip {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  text-align: center;
}
.rs-demo1__meta {
  max-width: 460px;
}
</style>
