<template>
  <div class="chat-demo2">
    <div class="chat-demo2__row">
      <!-- 纯文本模式：不渲染 Markdown -->
      <div class="chat-demo2__col">
        <span class="chat-demo2__label">纯文本（markdown=false）</span>
        <t-chat
          :messages="plainMessages"
          :markdown="false"
          :show-header="false"
          readonly
          variant="compact"
          class="chat-demo2__box"
        />
      </div>

      <!-- 空状态 + 快捷问题 -->
      <div class="chat-demo2__col">
        <span class="chat-demo2__label">空状态与快捷问题</span>
        <t-chat
          :messages="[]"
          title="新建对话"
          empty-title="今天想聊点什么？"
          empty-hint="选一个话题开始，或者直接在下方输入你的问题。"
          :quick-prompts="prompts"
          :show-disclaimer="true"
          class="chat-demo2__box"
        />
      </div>
    </div>

    <t-typography type="secondary" size="small" block>
      <code>:markdown="false"</code> 关闭渲染后按纯文本显示，适合日志、代码片段这类内容；
      不传消息时展示空状态，可配 <code>empty-title</code>、<code>quick-prompts</code>。
    </t-typography>
  </div>
</template>

<script setup>
const plainMessages = [
  {
    id: 'p1',
    role: 'user',
    content: '这条消息里有 **星号** 和 `反引号`，但不会渲染',
    time: '10:02'
  },
  {
    id: 'p2',
    role: 'assistant',
    content: '对，因为关闭了 markdown 渲染。\n换行也会原样保留。',
    time: '10:02'
  }
];

const prompts = [
  '帮我写一段自我介绍',
  '解释一下什么是闭包',
  { label: '推荐几个学习资源', value: '推荐几个学前端的好资源' }
];
</script>

<style lang="scss" scoped>
.chat-demo2 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.chat-demo2__row {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.chat-demo2__col {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.chat-demo2__label {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.chat-demo2__box {
  height: 380px;
}
</style>
