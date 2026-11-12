<template>
  <div class="tp-demo">
    <div class="tp-demo__block">
      <t-typography level="1" block>一级标题 30px</t-typography>
      <t-typography level="2" block>二级标题 24px</t-typography>
      <t-typography level="3" block>三级标题 19px</t-typography>
      <t-typography level="4" block>四级标题 16px</t-typography>
      <t-typography level="5" block>五级标题 14px</t-typography>
    </div>

    <t-divider />

    <div class="tp-demo__block">
      <t-typography block>默认正文，用于承载页面中的说明性文字与段落内容。</t-typography>
      <t-typography type="secondary" block>次要文字，用于辅助说明、时间戳等信息。</t-typography>
      <t-typography type="brand" block>品牌色文字，用于强调关键信息。</t-typography>
      <t-typography type="success" block>成功状态文案</t-typography>
      <t-typography type="warning" block>警告状态文案</t-typography>
      <t-typography type="danger" block>错误状态文案</t-typography>
      <t-typography disabled block>禁用状态文案</t-typography>
    </div>

    <t-divider />

    <div class="tp-demo__row">
      <t-typography strong>加粗</t-typography>
      <t-typography italic>斜体</t-typography>
      <t-typography underline>下划线</t-typography>
      <t-typography delete>删除线</t-typography>
      <t-typography code>npm i penguinui</t-typography>
      <t-typography mark>高亮标记</t-typography>
      <t-typography size="large">大号 16px</t-typography>
      <t-typography size="small" type="secondary">小号 12px</t-typography>
      <t-typography href="https://gitee.com/blue-sf/penguinui" type="brand">外链文字</t-typography>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.tp-demo__block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tp-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
}
</style>
