<template>
  <div class="fb-demo3">
    <t-typography type="secondary">
      _fixed_ 默认开启：按钮固定在视口右下角，通过 _right_ / _bottom_ 调整位置，
      多个按钮用不同的 _bottom_ 堆叠即可。下面的按钮已真实固定在页面右下角。
    </t-typography>

    <div class="fb-demo3__placeholder">
      <span>滚动页面时按钮保持不动</span>
    </div>

    <t-float-button
      type="primary"
      icon="t-icon-top"
      tooltip="回到顶部"
      :bottom="96"
      @click="backTop"
    />
    <t-float-button
      icon="t-icon-customer-service"
      tooltip="联系客服"
      :bottom="156"
      :badge="2"
      @click="tip"
    />
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const backTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const main = document.querySelector('main');
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
};

const tip = () => proxy.$message({ text: '客服小企鹅已上线', type: 'info', timeout: 1600 });
</script>

<style lang="scss" scoped>
.fb-demo3 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.fb-demo3__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border-radius: 14px;
  border: 1px dashed var(--pui-border, #e7ecf3);
  background: var(--pui-bg-soft, #f7f9fc);
  font-size: 13px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
