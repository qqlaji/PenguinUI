<template>
  <div class="sg-demo2">
    <div class="sg-demo2__item">
      <t-signature
        width="100%"
        :height="140"
        title="自定义笔色与粗细"
        pen-color="#0e80eb"
        :line-width="4"
        placeholder="蓝色粗笔"
        :show-tools="false"
        :show-baseline="false"
      >
        <template #footer>
          <span class="sg-demo2__hint">pen-color / line-width 可调</span>
        </template>
      </t-signature>
    </div>

    <div class="sg-demo2__item">
      <t-signature
        width="100%"
        :height="140"
        title="禁用状态"
        disabled
        placeholder="该签名已锁定"
        tip="锁定后不可修改"
      />
    </div>

    <div class="sg-demo2__item">
      <t-signature
        width="100%"
        :height="140"
        title="带浅底色的画布"
        bg-color="#f7f9fc"
        placeholder=""
        tip="bg-color 设置画布底色"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.sg-demo2 {
  display: grid;
  /* 用 min() 让列宽不超过容器：内容区（卡片 - padding - border）始终够画布用 */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 20px;
}
.sg-demo2__item {
  padding: 14px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
  /* 关键：网格项默认 min-width:auto 会被内容撑开，导致溢出 */
  min-width: 0;
  box-sizing: border-box;
}
.sg-demo2__hint {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
