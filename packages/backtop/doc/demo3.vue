<template>
  <div class="bt-wrap">
    <p class="bt-tip">自定义元素展示 · 通过默认插槽替换按钮外观</p>
    <div class="bt-frame">
      <div class="bt-scroll bt-scroll--3">
        <p v-for="i in 16" :key="i"><span>{{ String(i).padStart(2, '0') }}</span> 自定义插槽里的圆形按钮，同样点击回到顶部。</p>
      </div>
      <t-backtop target=".bt-scroll--3" :visibility-height="0" :fixed="false" :right="14" :bottom="14">
        <span class="bt-custom">
          <i class="iconfont t-icon-direction-up"></i>
        </span>
      </t-backtop>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.bt-wrap { font-family: var(--pui-font-body, sans-serif); }
.bt-tip { margin: 0 0 12px; font-size: 12px; color: var(--pui-text-muted, #8b96a6); }
.bt-frame {
  position: relative;
  height: 220px;
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
.bt-custom {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(140deg, #ff9a4d, #f57b29);
  box-shadow: 0 8px 22px rgba(245, 123, 41, 0.35);
  & i { font-size: 20px; color: #fff; }
}
</style>
