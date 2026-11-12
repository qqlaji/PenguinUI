<template>
  <div class="bb-demo">
    <t-bubble name="Cindy" time="10:24" avatar="C" content="组件库这版视觉统一了圆角，观感比之前干净很多。" />
    <t-bubble
      placement="right"
      name="我"
      time="10:25"
      avatar="我"
      content="是的，输入框、表格、弹窗都统一到 10px 圆角了。"
    />
    <t-bubble name="David" time="10:26" avatar="D">
      我把虚拟列表和倒计时也整理进文档了，可以一起看看。
    </t-bubble>
    <t-bubble placement="right" name="我" time="10:27" avatar="我" loading />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.bb-demo {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 620px;
  padding: 14px 16px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
}
</style>
