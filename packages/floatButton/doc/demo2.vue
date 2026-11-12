<template>
  <div class="fb-demo2">
    <div class="fb-demo2__group">
      <t-float-button :fixed="false" icon="t-icon-bell" :badge="5" @click="tip('5 条通知')" />
      <t-float-button :fixed="false" type="primary" icon="t-icon-comment" :badge="120" @click="tip('120 条评论')" />
      <t-float-button :fixed="false" shape="square" icon="t-icon-setting" dot />
      <t-float-button :fixed="false" shape="square" icon="t-icon-email" label="订阅" />
    </div>

    <div class="fb-demo2__group">
      <t-float-button :fixed="false" shape="square" size="large" icon="t-icon-upload" type="primary" label="上传素材" />
    </div>

    <t-typography type="secondary" size="small">
      徽标超过 99 自动显示 99+；dot 只显示小红点；shape 为 square 时使用圆角方形。
    </t-typography>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const tip = (name) => proxy.$message({ text: name, type: 'success', timeout: 1400 });
</script>

<style lang="scss" scoped>
.fb-demo2 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.fb-demo2__group {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 16px;
  border: 1px dashed var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-soft, #f7f9fc);
}
</style>
