<template>
  <div class="cp-demo2">
    <div class="cp-demo2__toggle">
      <t-segmented v-model="theme" :options="themes" size="small" />
      <t-typography type="secondary" size="small">切换后整块区域切到暗色令牌</t-typography>
    </div>

    <t-config-provider :theme="theme" :primary-color="theme === 'dark' ? '#54a8ff' : '#0e80eb'">
      <div class="cp-demo2__panel">
        <t-typography strong block>嵌套配置</t-typography>
        <t-typography type="secondary" size="small" block>
          ConfigProvider 可多层嵌套，内层未声明的字段会继承外层
        </t-typography>

        <div class="cp-demo2__row">
          <t-button type="primary">主按钮</t-button>
          <t-button>次按钮</t-button>
          <t-tag type="info" effect="light">标签</t-tag>
        </div>

        <t-config-provider primary-color="#c02a68">
          <div class="cp-demo2__nested">
            <t-typography type="secondary" size="small" block>内层覆写主色为 #c02a68</t-typography>
            <t-button type="primary">内层主按钮</t-button>
          </div>
        </t-config-provider>
      </div>
    </t-config-provider>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const theme = ref('light');
const themes = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' }
];
</script>

<style lang="scss" scoped>
.cp-demo2 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 620px;
}
.cp-demo2__toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cp-demo2__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.cp-demo2__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cp-demo2__nested {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
}
</style>
