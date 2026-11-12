<template>
  <div class="sb-demo2">
    <div class="sb-demo2__item">
      <span class="sb-demo2__label">横向滚动</span>
      <t-scrollbar height="120" class="sb-demo2__box">
        <div class="sb-demo2__track">
          <div v-for="i in 8" :key="i" class="sb-demo2__card">{{ i }}</div>
        </div>
      </t-scrollbar>
    </div>

    <div class="sb-demo2__item">
      <span class="sb-demo2__label">常显滚动条（always）</span>
      <t-scrollbar height="120" always class="sb-demo2__box">
        <div class="sb-demo2__long">
          <p v-for="i in 10" :key="i" class="sb-demo2__p">第 {{ i }} 段：滚动条保持可见，便于用户发现可滚动区域。</p>
        </div>
      </t-scrollbar>
    </div>

    <div class="sb-demo2__item">
      <span class="sb-demo2__label">原生滚动条（native）</span>
      <t-scrollbar height="120" native class="sb-demo2__box sb-demo2__box--native">
        <div class="sb-demo2__long">
          <p v-for="i in 10" :key="i" class="sb-demo2__p">第 {{ i }} 段：使用系统滚动条，适合需要保持平台原生观感的场景。</p>
        </div>
      </t-scrollbar>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.sb-demo2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.sb-demo2__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sb-demo2__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.sb-demo2__box {
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
}
.sb-demo2__box--native {
  scrollbar-width: thin;
}
.sb-demo2__track {
  display: flex;
  gap: 10px;
  padding: 14px;
  width: max-content;
}
.sb-demo2__card {
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--pui-brand, #0e80eb);
  background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
}
.sb-demo2__long {
  padding: 10px 14px;
}
.sb-demo2__p {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--pui-text-sub, #5b6879);
}
</style>
