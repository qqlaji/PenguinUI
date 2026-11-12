<template>
  <div class="affix-demo">
    <div class="affix-note">
      当前状态：<b :class="affixed ? 'on' : 'off'">{{ affixed ? '已固定' : '未固定' }}</b>
      · 向下滚动页面，元素到达距顶部 80px 时自动固定
    </div>

    <t-affix :offset-top="80" @change="onChange">
      <div class="affix-bar">
        <span class="affix-bar__label">固钉区域</span>
        <span class="affix-bar__state">{{ affixed ? 'fixed' : 'static' }}</span>
      </div>
    </t-affix>

    <div class="affix-filler">↓ 继续向下滚动 ↓</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const affixed = ref(false)
const onChange = (v) => {
  affixed.value = v
}
</script>

<style scoped>
.affix-note {
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);
  margin-bottom: 12px;
}
.affix-note b.on {
  color: var(--pui-success, #09b63d);
}
.affix-note b.off {
  color: var(--pui-text-muted, #8b96a6);
}
.affix-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--pui-brand, #0e80eb);
  color: #fff;
  font-size: 14px;
}
.affix-bar__state {
  font-size: 12px;
  opacity: 0.85;
  font-variant-numeric: tabular-nums;
}
.affix-filler {
  height: 520px;
  margin-top: 16px;
  border-radius: 10px;
  border: 1px dashed var(--pui-border-strong, #d8e0ea);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 24px;
  color: var(--pui-text-muted, #8b96a6);
  font-size: 13px;
  background: repeating-linear-gradient(
    135deg,
    transparent 0 14px,
    var(--pui-bg-soft, #f7f9fc) 14px 28px
  );
}
</style>
