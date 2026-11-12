<template>
  <div class="otp-demos">
    <div class="otp-row">
      <span class="otp-label">带分隔符</span>
      <t-input-otp v-model="a" :separator="3" />
    </div>

    <div class="otp-row">
      <span class="otp-label">密码模式</span>
      <t-input-otp v-model="b" mask />
    </div>

    <div class="otp-row">
      <span class="otp-label">尺寸</span>
      <t-input-otp v-model="c" size="small" :length="4" />
      <t-input-otp v-model="c" size="large" :length="4" />
    </div>

    <div class="otp-row">
      <span class="otp-label">校验失败</span>
      <t-input-otp v-model="d" status="error" :length="4" />
    </div>

    <div class="otp-row">
      <span class="otp-label">禁用</span>
      <t-input-otp model-value="1234" disabled :length="4" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const a = ref('123456');
const b = ref('8888');
const c = ref('2026');
const d = ref('12');
</script>

<style lang="scss" scoped>
.otp-demos {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.otp-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.otp-label {
  width: 78px;
  flex: none;
  font-size: 13px;
  color: var(--pui-text-3, #8b97a8);
}
</style>
