<template>
  <div class="fb-demo">
    <div class="fb-demo__group">
      <t-float-button :fixed="false" icon="t-icon-add-bold" tooltip="新建" @click="tip('新建')" />
      <t-float-button :fixed="false" type="primary" icon="t-icon-add-bold" tooltip="新建（主色）" @click="tip('新建（主色）')" />
      <t-float-button :fixed="false" icon="t-icon-help" tooltip="帮助" disabled />
    </div>

    <div class="fb-demo__group">
      <t-float-button :fixed="false" size="small" icon="t-icon-search" />
      <t-float-button :fixed="false" icon="t-icon-search" />
      <t-float-button :fixed="false" size="large" icon="t-icon-search" />
    </div>

    <div class="fb-demo__group">
      <t-float-button :fixed="false" icon="t-icon-customer-service" label="联系客服" @click="tip('联系客服')" />
      <t-float-button :fixed="false" type="primary" icon="t-icon-add-bold" label="新建项目" @click="tip('新建项目')" />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const tip = (name) => proxy.$message({ text: `点击了「${name}」`, type: 'success', timeout: 1400 });
</script>

<style lang="scss" scoped>
.fb-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.fb-demo__group {
  display: flex;
  align-items: center;
  gap: 14px;
}
</style>
