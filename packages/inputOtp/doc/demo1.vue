<template>
  <div class="otp-demo">
    <t-input-otp v-model="code" @complete="onComplete" />
    <p class="otp-demo__tip">
      当前输入：<b>{{ code || '——' }}</b>
      <span v-if="completed" class="otp-demo__done">（已完成，触发 complete）</span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const code = ref('');
const completed = ref(false);

const onComplete = (val) => {
  completed.value = true;
  console.log('complete:', val);
};
</script>

<style lang="scss" scoped>
.otp-demo__tip {
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #8b97a8);

  b { color: var(--pui-text-1, #1f2d3d); }
}
.otp-demo__done {
  margin-left: 6px;
  color: var(--pui-success, #52c41a);
}
</style>
