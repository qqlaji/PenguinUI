<template>
  <div class="rs-demo3">
    <div class="rs-demo3__frame">
      <t-resizable-group
        v-model:default-sizes="colSizes"
        direction="horizontal"
        :min-size="90"
        :size="640"
      >
        <template #panel-0>
          <div class="rs-demo3__pane rs-demo3__pane--a">
            <span class="rs-demo3__name">左侧栏</span>
            <span class="rs-demo3__ratio">{{ ratio(0) }}%</span>
          </div>
        </template>
        <template #panel-1>
          <div class="rs-demo3__pane rs-demo3__pane--b">
            <span class="rs-demo3__name">主内容</span>
            <span class="rs-demo3__ratio">{{ ratio(1) }}%</span>
          </div>
        </template>
        <template #panel-2>
          <div class="rs-demo3__pane rs-demo3__pane--c">
            <span class="rs-demo3__name">右侧栏</span>
            <span class="rs-demo3__ratio">{{ ratio(2) }}%</span>
          </div>
        </template>
      </t-resizable-group>
    </div>

    <div class="rs-demo3__frame rs-demo3__frame--v">
      <t-resizable-group
        v-model:default-sizes="rowSizes"
        direction="vertical"
        :min-size="46"
        :size="220"
      >
        <template #panel-0>
          <div class="rs-demo3__pane rs-demo3__pane--a">上</div>
        </template>
        <template #panel-1>
          <div class="rs-demo3__pane rs-demo3__pane--b">中</div>
        </template>
        <template #panel-2>
          <div class="rs-demo3__pane rs-demo3__pane--c">下</div>
        </template>
      </t-resizable-group>
    </div>

    <t-typography type="secondary" size="small" block>
      拖动分隔条时，两侧面板<b>此消彼长</b>，容器总尺寸保持不变；
      <code>min-size</code> 防止把某一栏拖到不可见。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const colSizes = ref([1, 2.2, 1]);
const rowSizes = ref([1, 1, 1]);

const ratio = (i) => {
  const total = colSizes.value.reduce((a, b) => a + b, 0);
  return Math.round((colSizes.value[i] / total) * 100);
};
</script>

<style lang="scss" scoped>
.rs-demo3 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.rs-demo3__frame {
  height: 200px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  overflow: hidden;
  max-width: 100%;

  &--v {
    height: 220px;
    width: 320px;
  }
}
.rs-demo3__pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 12.5px;
  color: var(--pui-text-sub, #5b6879);
  box-sizing: border-box;

  &--a { background: rgba(14, 128, 235, 0.07); }
  &--b { background: rgba(19, 160, 101, 0.07); }
  &--c { background: rgba(250, 140, 22, 0.08); }
}
.rs-demo3__name {
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.rs-demo3__ratio {
  font-size: 11px;
  color: var(--pui-text-muted, #8b96a6);
  font-variant-numeric: tabular-nums;
}
</style>
