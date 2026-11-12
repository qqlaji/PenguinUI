<template>
  <div class="cd-demo2">
    <div class="cd-demo2__bar">
      <t-typography type="secondary" size="small">距结束还有</t-typography>
      <t-countdown :value="target" format="DD:HH:mm:ss" :font-size="22" @change="onChange" @finish="onFinish" />
      <t-button size="small" @click="reset">重置 10 秒</t-button>
    </div>

    <div class="cd-demo2__progress">
      <t-progress :percent="percent" :is-show-text="false" round-corner />
    </div>

    <t-typography type="secondary" size="small">
      {{ finished ? '倒计时已结束，finish 事件已触发' : '每秒触发 change 事件，可用于联动进度条或按钮禁用态' }}
    </t-typography>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const total = ref(10);
const remain = ref(10 * 1000);
const finished = ref(false);
const target = ref(new Date(Date.now() + 10 * 1000));

const percent = computed(() => {
  const p = 100 - (remain.value / (total.value * 1000)) * 100;
  return Math.min(100, Math.max(0, Math.round(p)));
});

// countdown 的 change 事件由外层捕获，用于驱动进度条
const onChange = (ms) => {
  remain.value = ms;
};

const onFinish = () => {
  finished.value = true;
};

const reset = () => {
  finished.value = false;
  remain.value = 10 * 1000;
  target.value = new Date(Date.now() + 10 * 1000);
};
</script>

<style lang="scss" scoped>
.cd-demo2 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
}
.cd-demo2__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.cd-demo2__progress {
  max-width: 320px;
}
</style>
