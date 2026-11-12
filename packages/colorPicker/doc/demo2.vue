<template>
  <div class="color-demo">
    <div class="color-demo__row">
      <t-color-picker v-model="alphaColor" show-alpha />
      <code class="color-demo__code">{{ alphaColor }}</code>
    </div>

    <div class="color-demo__row">
      <t-color-picker v-model="small" size="small" :predefine="presets" />
      <span class="color-demo__label">小尺寸 + 自定义色板</span>
    </div>

    <div class="color-demo__row">
      <t-color-picker v-model="disabledColor" disabled />
      <span class="color-demo__label">禁用状态</span>
    </div>

    <div class="color-demo__row">
      <t-color-picker v-model="clearable" />
      <span class="color-demo__label">可清空（悬停右侧出现 ×）</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const alphaColor = ref('rgba(14, 128, 235, 0.65)');
const small = ref('#52c41a');
const disabledColor = ref('#fa8c16');
const clearable = ref('#722ed1');

const presets = ['#f5222d', '#fa8c16', '#faad14', '#52c41a', '#13c2c2', '#0e80eb', '#722ed1', '#eb2f96'];
</script>

<style lang="scss" scoped>
.color-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.color-demo__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.color-demo__label {
  font-size: 13px;
  color: var(--pui-text-3, #8b97a8);
}
.color-demo__code {
  padding: 4px 10px;
  border-radius: 7px;
  background: var(--pui-bg-soft, #f4f6fa);
  font-size: 13px;
  color: var(--pui-text-2, #4a5866);
}
</style>
