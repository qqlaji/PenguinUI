<template>
  <div class="cd-demo">
    <div class="cd-demo__card">
      <span class="cd-demo__label">秒杀倒计时</span>
      <t-countdown :value="target" :font-size="26" format="HH:mm:ss" />
    </div>

    <div class="cd-demo__card">
      <span class="cd-demo__label">带天数的活动倒计时</span>
      <t-countdown :value="target" format="DD:HH:mm:ss" unit-label :font-size="18" />
    </div>

    <div class="cd-demo__card">
      <span class="cd-demo__label">带数字底板（bordered）</span>
      <t-countdown :value="target" format="DD:HH:mm:ss" bordered :font-size="16" separator=" " />
    </div>

    <div class="cd-demo__card">
      <span class="cd-demo__label">已结束状态</span>
      <t-countdown :value="past" format="HH:mm:ss" finish-text="活动已结束" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 固定到当天 23:59:59，避免演示时数字乱跳
const target = computed(() => {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return d;
});

const past = new Date(Date.now() - 60 * 1000);
</script>

<style lang="scss" scoped>
.cd-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}
.cd-demo__card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.cd-demo__label {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
