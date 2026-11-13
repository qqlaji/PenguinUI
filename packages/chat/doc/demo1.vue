<template>
  <div class="chat-demo1">
    <t-chat
      v-model="draft"
      :messages="messages"
      :loading="loading"
      title="AI 助手"
      subtitle="支持 Markdown 渲染的会话示例"
      :quick-prompts="prompts"
      allow-image
      :max-images="3"
      show-disclaimer
      class="chat-demo1__box"
      @send="onSend"
      @stop="onStop"
      @clear="onClear"
      @regenerate="onRegenerate"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const draft = ref('');
const loading = ref(false);
const timers = [];
let seq = 1;

const prompts = [
  { label: '介绍一下 Markdown 支持', value: '介绍一下你支持的 Markdown 语法' },
  { label: '给个代码示例', value: '用 JavaScript 写一个防抖函数' },
  { label: '表格怎么用', value: 'Markdown 表格怎么写？给个例子' }
];

/** 预置一条助手消息，直接能看到 Markdown 渲染效果 */
const messages = ref([
  {
    id: 'm0',
    role: 'assistant',
    content:
      '你好，我是 **Penguin UI** 的会话组件。\n\n' +
      '我支持这些 Markdown 语法：\n\n' +
      '- **加粗**、*斜体*、~~删除线~~\n' +
      '- `行内代码` 与代码块\n' +
      '- 列表、引用、表格、分割线\n' +
      '- [链接](https://example.com)\n\n' +
      '> 试着点下面的快捷问题，或者自己输入。\n\n' +
      '```js\nconst greeting = "Hello, Penguin UI";\nconsole.log(greeting);\n```\n\n' +
      '| 特性 | 是否支持 |\n| --- | :-: |\n| Markdown | ✅ |\n| 流式输出 | ✅ |\n| MDX 文本 | ✅（按 Markdown 渲染） |',
    time: '刚刚'
  }
]);

const now = () =>
  new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });

/** 模拟流式回复 */
function simulateStream(messageId, fullText) {
  const msg = messages.value.find((m) => m.id === messageId);
  if (!msg) return;

  let i = 0;
  const step = () => {
    // 每帧吐 3~6 个字符，模拟真实打字
    const chunk = 3 + Math.floor(Math.random() * 4);
    i = Math.min(fullText.length, i + chunk);
    msg.content = fullText.slice(0, i);

    if (i < fullText.length) {
      timers.push(setTimeout(step, 28));
    } else {
      msg.status = 'done';
      loading.value = false;
    }
  };
  step();
}

function replyFor(text) {
  if (/防抖/i.test(text)) {
    return (
      '防抖的核心是「等用户停下来再执行」。\n\n' +
      '```js\nfunction debounce(fn, delay = 300) {\n  let timer = null;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n```\n\n' +
      '注意 `this` 的绑定，以及组件卸载时要 `clearTimeout` 避免内存泄漏。'
    );
  }
  if (/表格/i.test(text)) {
    return (
      '表格用 `|` 分隔单元格，第二行是分隔行：\n\n' +
      '```md\n| 姓名 | 年龄 |\n| --- | :-: |\n| 小明 | 18 |\n```\n\n' +
      '渲染结果：\n\n| 姓名 | 年龄 |\n| --- | :-: |\n| 小明 | 18 |\n\n' +
      '第二行的 `:---:` 可以控制对齐方式。'
    );
  }
  if (/markdown/i.test(text)) {
    return (
      '我支持常用的 Markdown 子集：\n\n' +
      '1. **标题** h1~h6\n2. **强调** 加粗 / 斜体 / 删除线\n3. **列表** 有序、无序、任务列表\n4. **代码** 行内与围栏代码块\n5. **表格** 含对齐\n6. **引用与分割线**\n\n' +
      '> MDX 里的 JSX 标签会被当纯文本转义，不会执行，这样是安全的。\n\n' +
      '任务列表示例：\n\n- [x] 支持流式输出\n- [x] 支持复制消息\n- [ ] 支持多轮上下文管理'
    );
  }
  return (
    `收到你的问题：「${text}」\n\n` +
    '这是一个演示回复，用于展示**流式输出**与 **Markdown 渲染**。\n\n' +
    '实际接入时，把 `@send` 里的模拟逻辑换成真实的接口调用即可，' +
    '边接收边更新 `messages` 里对应消息的 `content`，组件会自动跟随滚动。'
  );
}

function onSend(text, extra) {
  const imgs = (extra && extra.images) || [];
  messages.value.push({
    id: `m${seq++}`,
    role: 'user',
    content: text,
    // 有图时把图片挂在消息上，组件会自动渲染缩略图
    images: imgs.length ? imgs : undefined,
    time: now()
  });

  const replyId = `m${seq++}`;
  messages.value.push({
    id: replyId,
    role: 'assistant',
    content: '',
    status: 'streaming',
    time: now()
  });

  loading.value = true;
  // 只发图片没有文字时，给一个针对性回复
  const question = text || (imgs.length ? '这张图片里有什么？' : '');
  // 延迟一点再开始，模拟"思考"
  timers.push(setTimeout(() => simulateStream(replyId, replyFor(question)), 420));
}

function onStop() {
  timers.forEach(clearTimeout);
  timers.length = 0;
  const last = messages.value[messages.value.length - 1];
  if (last && last.status === 'streaming') last.status = 'done';
  loading.value = false;
}

function onClear() {
  timers.forEach(clearTimeout);
  timers.length = 0;
  messages.value = [];
  loading.value = false;
}

function onRegenerate(msg) {
  msg.content = '';
  msg.status = 'streaming';
  loading.value = true;
  timers.push(setTimeout(() => simulateStream(msg.id, replyFor('重新生成')), 320));
}

function onDelete(msg, index) {
  messages.value.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.chat-demo1 {
  max-width: 720px;
}
.chat-demo1__box {
  height: 560px;
}
</style>
