<template>
  <div class="sp-demo">
    <t-splitter v-model="size" :min="20" :max="80">
      <template #start>
        <div class="sp-pane sp-pane--a">
          <strong>左侧面板</strong>
          <span>{{ size.toFixed(0) }}%</span>
          <p>拖动中间的分割条可调整两栏宽度，也支持键盘 ← → 微调（按住 Shift 步长 10）。</p>
        </div>
      </template>
      <template #end>
        <div class="sp-pane sp-pane--b">
          <strong>右侧面板</strong>
          <span>{{ (100 - size).toFixed(0) }}%</span>
          <p>最小 20%，最大 80%，超出范围会被自动钳制。</p>
        </div>
      </template>
    </t-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const size = ref(40);
</script>

<style lang="scss" scoped>
.sp-demo { max-width: 100%; }
.sp-pane {
  height: 200px;
  padding: 16px 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  line-height: 1.7;

  strong { font-size: 14px; }
  span {
    align-self: flex-start;
    padding: 1px 8px;
    border-radius: 20px;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.24);
  }
  p { margin: 4px 0 0; opacity: 0.86; }
}
.sp-pane--a {
  background: linear-gradient(135deg, rgba(14, 128, 235, 0.12), rgba(14, 128, 235, 0.04));
  color: var(--pui-text-1, #1f2d3d);
}
.sp-pane--b {
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.12), rgba(82, 196, 26, 0.04));
  color: var(--pui-text-1, #1f2d3d);
}
</style>
