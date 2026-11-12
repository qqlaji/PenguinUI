<template>
  <div class="sb-demo">
    <t-scrollbar height="220" class="sb-demo__box">
      <div class="sb-demo__list">
        <div v-for="i in 18" :key="i" class="sb-demo__row">
          <span class="sb-demo__idx">{{ String(i).padStart(2, '0') }}</span>
          <span class="sb-demo__text">列表内容第 {{ i }} 项 · 悬停容器后右侧出现自定义滚动条</span>
        </div>
      </div>
    </t-scrollbar>

    <p class="sb-demo__tip">滚动条在鼠标进入时淡入，移出淡出；支持拖拽滑块与点击轨道跳转。</p>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.sb-demo {
  max-width: 560px;
}
.sb-demo__box {
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.sb-demo__list {
  padding: 6px 4px;
}
.sb-demo__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);

  &:hover {
    background: var(--pui-bg-soft, #f7f9fc);
  }
}
.sb-demo__idx {
  flex: none;
  width: 24px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--pui-text-muted, #8b96a6);
}
.sb-demo__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sb-demo__tip {
  margin: 10px 2px 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
