<template>
  <div class="rs-demo2">
    <div class="rs-demo2__row">
      <!-- 只允许水平方向 -->
      <div class="rs-demo2__item">
        <t-resizable v-model:width="w1" :height="90" handles="horizontal" :min-width="120">
          <div class="rs-demo2__cell">水平伸缩<br /><small>{{ w1 }}px</small></div>
        </t-resizable>
      </div>

      <!-- 只允许垂直方向 -->
      <div class="rs-demo2__item">
        <t-resizable :width="140" v-model:height="h2" handles="vertical" :min-height="60">
          <div class="rs-demo2__cell">垂直伸缩<br /><small>{{ h2 }}px</small></div>
        </t-resizable>
      </div>

      <!-- 锁定宽高比 -->
      <div class="rs-demo2__item">
        <t-resizable v-model:width="w3" v-model:height="h3" aspect-ratio :ratio="4 / 3" :min-width="100">
          <div class="rs-demo2__cell">锁定 4:3<br /><small>{{ w3 }} × {{ h3 }}</small></div>
        </t-resizable>
      </div>
    </div>

    <t-typography type="secondary" size="small" block>
      <code>handles</code> 支持 <code>all</code> / <code>horizontal</code> /
      <code>vertical</code> / <code>corner</code> 或自定义方向数组；
      <code>aspect-ratio</code> 会锁定宽高比，拖任意角都按比例缩放。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const w1 = ref(200);
const h2 = ref(120);
const w3 = ref(160);
const h3 = ref(120);
</script>

<style lang="scss" scoped>
.rs-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rs-demo2__row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.rs-demo2__item {
  min-width: 0;
}
.rs-demo2__cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 9px;
  background: var(--pui-bg-soft, #f7f9fc);
  font-size: 12.5px;
  color: var(--pui-text-sub, #5b6879);
  text-align: center;
  box-sizing: border-box;

  small {
    font-size: 11px;
    color: var(--pui-text-muted, #8b96a6);
    font-variant-numeric: tabular-nums;
  }
}
</style>
