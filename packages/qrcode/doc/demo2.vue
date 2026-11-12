<template>
  <div class="qr-demo2">
    <div class="qr-demo2__item">
      <t-qrcode
        value="https://gitee.com/blue-sf/penguinui"
        type="round"
        :size="140"
        color="#0e80eb"
        title="圆点样式"
      />
    </div>

    <div class="qr-demo2__item">
      <t-qrcode
        value="PenguinUI 组件库，零依赖二维码"
        :size="140"
        color="#13a065"
        bg-color="#f3fbf6"
        title="自定义配色"
        description="前景 / 背景色均可配置"
      />
    </div>

    <div class="qr-demo2__item">
      <t-qrcode
        :value="dynamic"
        :size="140"
        :status="status"
        status-text="二维码已失效"
        title="状态与刷新"
        @refresh="onRefresh"
      />
      <t-button size="small" @click="expire">模拟失效</t-button>
    </div>

    <div class="qr-demo2__item">
      <t-qrcode :value="longText" :size="140" title="长内容自动选版本" :padding="4" />
      <span class="qr-demo2__hint">{{ longText.length }} 字符</span>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();

const dynamic = ref('https://gitee.com/blue-sf/penguinui');
const status = ref('');
const longText = ref('https://gitee.com/blue-sf/penguinui?tab=components&category=general&theme=light&lang=zh-CN');

const expire = () => {
  status.value = 'expired';
};

const onRefresh = () => {
  status.value = 'loading';
  dynamic.value = `https://gitee.com/blue-sf/penguinui?t=${Date.now()}`;
  setTimeout(() => {
    status.value = '';
    proxy.$message({ text: '二维码已刷新', type: 'success', timeout: 1400 });
  }, 700);
};
</script>

<style lang="scss" scoped>
.qr-demo2 {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.qr-demo2__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.qr-demo2__hint {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
