<template>
  <div class="bt-wrap">
    <p class="bt-tip">绑定指定元素 · 滚动超过 120px 后按钮才出现</p>
    <div class="bt-frame">
      <div class="bt-scroll bt-scroll--2">
        <p v-for="i in 26" :key="i"><span>{{ String(i).padStart(2, '0') }}</span> 列表内容，用来制造可滚动的区域。</p>
      </div>
      <t-backtop target=".bt-scroll--2" :visibility-height="120" :fixed="false" :right="14" :bottom="14" />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.bt-wrap { font-family: var(--pui-font-body, sans-serif); }
.bt-tip { margin: 0 0 12px; font-size: 12px; color: var(--pui-text-muted, #8b96a6); }
.bt-frame {
  position: relative;
  height: 240px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  overflow: hidden;
  background: var(--pui-bg-elevated, #fff);
}
.bt-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 8px 18px;
  & p {
    margin: 0;
    padding: 9px 0;
    border-bottom: 1px dashed var(--pui-border, #e7ecf3);
    font-size: 12.5px;
    color: var(--pui-text-sub, #5b6879);
  }
  & span {
    display: inline-block;
    min-width: 26px;
    font-family: var(--pui-font-mono, monospace);
    color: var(--pui-brand, #0e80eb);
  }
}
</style>
