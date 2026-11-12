<template>
  <div class="bb-demo2">
    <div class="bb-demo2__col">
      <t-typography strong block>变体</t-typography>
      <t-bubble variant="filled" name="填充（默认）" avatar="A" content="左侧填充气泡，浅灰底。" />
      <t-bubble placement="right" variant="filled" name="填充" avatar="B" content="右侧填充气泡，主色底白字。" />
      <t-bubble variant="outlined" name="描边" avatar="C" content="描边气泡，适合浅色背景。" />
      <t-bubble placement="right" variant="outlined" name="描边" avatar="D" content="描边气泡，右侧尖角方向自动镜像。" />
      <t-bubble variant="text" name="纯文字" avatar="E" content="纯文字模式没有气泡壳，适合系统提示。" />
    </div>

    <div class="bb-demo2__col">
      <t-typography strong block>自定义配色与操作区</t-typography>
      <t-bubble
        name="系统"
        avatar="S"
        bg-color="#fff4e8"
        text-color="#c85a12"
        content="这条消息使用了自定义底色与字色。"
      />
      <t-bubble placement="right" name="我" avatar="我" content="右侧可以放操作按钮。">
        <template #extra>
          <i class="iconfont t-icon-copy bb-demo2__icon" title="复制"></i>
        </template>
      </t-bubble>
      <t-bubble name="Cindy" avatar="C" content="底部插槽用来放时间或状态。">
        <template #footer>
          <span>已读 · 刚刚</span>
        </template>
      </t-bubble>
      <t-bubble
        max-width="260"
        name="长文本"
        avatar="L"
        content="气泡默认最大宽度 460px，可以通过 max-width 收窄。窄气泡在长文本时会自动换行，不会撑破容器宽度，这一点在移动端尤其重要。"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.bb-demo2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.bb-demo2__col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
}
.bb-demo2__icon {
  font-size: 13px;
  cursor: pointer;

  &:hover { color: var(--pui-brand, #0e80eb); }
}
</style>
