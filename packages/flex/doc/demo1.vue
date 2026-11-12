<template>
  <div class="flex-demos">
    <t-flex gap="8">
      <span class="fx-box">1</span>
      <span class="fx-box">2</span>
      <span class="fx-box">3</span>
    </t-flex>

    <t-flex justify="space-between">
      <span class="fx-box">space-between</span>
      <span class="fx-box">右侧</span>
    </t-flex>

    <t-flex justify="center" gap="12">
      <span class="fx-box">居中</span>
      <span class="fx-box">居中</span>
    </t-flex>

    <t-flex vertical gap="8" align="flex-start">
      <span class="fx-box">纵向 1</span>
      <span class="fx-box">纵向 2</span>
    </t-flex>

    <t-flex wrap gap="8">
      <span v-for="i in 12" :key="i" class="fx-box">项 {{ i }}</span>
    </t-flex>
  </div>
</template>

<style lang="scss" scoped>
.flex-demos {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.fx-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
  color: var(--pui-brand, #0e80eb);
  font-size: 13px;
  white-space: nowrap;
}
</style>
