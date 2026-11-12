<template>
  <div class="sp-demos">
    <t-splitter v-model="vSize" direction="vertical" :height="220" :min="15" :max="85">
      <template #start>
        <div class="sp-row sp-row--a">上方面板 {{ vSize.toFixed(0) }}%</div>
      </template>
      <template #end>
        <div class="sp-row sp-row--b">下方面板 {{ (100 - vSize).toFixed(0) }}%</div>
      </template>
    </t-splitter>

    <t-splitter :model-value="50" disabled>
      <template #start><div class="sp-row sp-row--a">禁用态</div></template>
      <template #end><div class="sp-row sp-row--b">不可拖动</div></template>
    </t-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const vSize = ref(45);
</script>

<style lang="scss" scoped>
.sp-demos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sp-row {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 70px;
  font-size: 13px;
  color: var(--pui-text-1, #1f2d3d);
}
.sp-row--a { background: linear-gradient(135deg, rgba(14, 128, 235, 0.12), rgba(14, 128, 235, 0.04)); }
.sp-row--b { background: linear-gradient(135deg, rgba(250, 140, 22, 0.12), rgba(250, 140, 22, 0.04)); }
</style>
