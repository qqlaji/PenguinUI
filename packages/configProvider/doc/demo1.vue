<template>
  <div class="cp-demo">
    <t-config-provider primary-color="#13a065" :radius="14" size="large" empty-text="这里空空如也">
      <div class="cp-demo__inner">
        <t-typography strong block>默认配置已被覆盖</t-typography>
        <t-typography type="secondary" size="small" block>
          主色改为绿色 #13a065，圆角 14px，默认尺寸 large，空文案统一替换
        </t-typography>

        <div class="cp-demo__row">
          <t-button type="primary">主色按钮</t-button>
          <t-tag type="success" effect="dark">标签</t-tag>
          <t-alert type="success" title="这条提示的主色来自 ConfigProvider" :closable="false" />
        </div>

        <div class="cp-demo__row">
          <t-input v-model="text" placeholder="输入框（large）" style="width: 200px" />
          <t-select v-model="picked" :options="opts" placeholder="下拉框" style="width: 160px" />
        </div>

        <config-reader />
      </div>
    </t-config-provider>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ConfigReader from './reader.vue';

const text = ref('');
const picked = ref('');
const opts = ['选项一', '选项二', '选项三'];
</script>

<style lang="scss" scoped>
.cp-demo {
  max-width: 620px;
}
.cp-demo__inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px dashed var(--pui-border-strong, #d8e0ea);
  border-radius: 14px;
}
.cp-demo__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
