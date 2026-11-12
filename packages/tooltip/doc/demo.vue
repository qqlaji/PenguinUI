<template>
  <div class="tt-demo">
    <p class="tt-demo__label">01 / 四个方向</p>
    <div class="tt-demo__grid">
      <t-tooltip content="上方提示 · top" placement="top">
        <t-button size="small">上</t-button>
      </t-tooltip>
      <t-tooltip content="下方提示 · bottom" placement="bottom">
        <t-button size="small">下</t-button>
      </t-tooltip>
      <t-tooltip content="左侧提示 · left" placement="left">
        <t-button size="small">左</t-button>
      </t-tooltip>
      <t-tooltip content="右侧提示 · right" placement="right">
        <t-button size="small">右</t-button>
      </t-tooltip>
    </div>

    <p class="tt-demo__label">02 / 对齐与主题</p>
    <div class="tt-demo__grid">
      <t-tooltip content="左对齐气泡 top-start" placement="top-start">
        <t-button size="small" type="primary">top-start</t-button>
      </t-tooltip>
      <t-tooltip content="右对齐气泡 top-end" placement="top-end">
        <t-button size="small" type="primary">top-end</t-button>
      </t-tooltip>
      <t-tooltip content="浅色气泡 · light" :dark="false">
        <t-button size="small">浅色</t-button>
      </t-tooltip>
      <t-tooltip content="延迟 300ms 显示" :delay="300">
        <t-button size="small">延迟</t-button>
      </t-tooltip>
    </div>

    <p class="tt-demo__label">03 / 长文本与富文本</p>
    <div class="tt-demo__grid">
      <t-tooltip
        content="这是一段比较长的说明文字，气泡会按 maxWidth 自动换行，不会再出现一个字一行的竖条。"
        :max-width="220"
      >
        <t-button size="small">长文本自动换行</t-button>
      </t-tooltip>
      <t-tooltip :max-width="240">
        <t-button size="small">富文本内容</t-button>
        <template #content>
          <b>自定义插槽</b><br />
          可以放任意 Vue 内容
        </template>
      </t-tooltip>
      <t-tooltip content="点击切换，再次点击关闭" trigger="click">
        <t-button size="small" type="primary">点击触发</t-button>
      </t-tooltip>
    </div>

    <p class="tt-demo__label">04 / 手动控制</p>
    <div class="tt-demo__grid">
      <t-tooltip content="由外部 v-model 控制" trigger="manual" v-model:visible="visible">
        <t-button size="small">手动气泡</t-button>
      </t-tooltip>
      <t-button size="small" @click="visible = !visible">{{ visible ? '关闭' : '显示' }}提示</t-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const visible = ref(false);
</script>

<style scoped>
.tt-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tt-demo__label {
  margin: 4px 0 0;
  font-family: var(--pui-font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--pui-text-muted, #8b96a6);
}
.tt-demo__grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 26px;
  padding: 20px 18px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
}
</style>
