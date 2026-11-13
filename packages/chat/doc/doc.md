<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import preview from '@/components/preview.vue'
</script>

# Chat 对话

#### 用于普通会话与 AI 会话场景，支持 Markdown 渲染、流式输出、消息操作与空状态引导

<br />

## 基础用法

#### 传入 `messages` 与 `v-model` 即可。助手消息默认按 Markdown 渲染，接收流式内容时只需持续更新 `content`。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="chat" demoname="demo1"/>

<br />

## 纯文本与空状态

#### `markdown=false` 关闭渲染；无消息时展示空状态，可配置快捷问题。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="chat" demoname="demo2"/>

<br />

## Attributes

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| messages | array | 消息列表，见下方结构 | `[]` |
| modelValue | string | 输入框内容（`v-model`） | `''` |
| variant | string | `default` / `compact` / `plain` | `'default'` |
| title | string | 标题 | `'AI 助手'` |
| subtitle | string | 副标题 | `''` |
| showHeader | boolean | 是否显示头部 | `true` |
| placeholder | string | 输入框占位 | 见默认文案 |
| loading | boolean | 是否正在等待回复（显示停止按钮） | `false` |
| disabled | boolean | 禁用输入 | `false` |
| readonly | boolean | 隐藏输入区 | `false` |
| maxlength | number | 最大字符数，0 不限制 | `0` |
| sendOn | string | `enter` / `ctrl-enter` | `'enter'` |
| markdown | boolean | 助手消息是否按 Markdown 渲染 | `true` |
| allowHtml | boolean | 允许 Markdown 里的原始 HTML（⚠️ 有 XSS 风险） | `false` |
| showAvatar | boolean | 是否显示头像 | `true` |
| showActions | boolean | 是否显示消息操作（复制/重生成/删除） | `true` |
| userAvatar / assistantAvatar | string | 头像图片地址 | `''` |
| userLabel / assistantLabel | string | 角色显示名 | `'我'` / `'AI'` |
| emptyTitle | string | 空状态标题 | `'有什么可以帮你？'` |
| emptyHint | string | 空状态说明 | `''` |
| quickPrompts | array | 快捷问题，`['问题']` 或 `[{label, value}]` | `[]` |
| clearable | boolean | 显示清空按钮 | `true` |
| regenerable | boolean | 显示重新生成按钮 | `true` |
| hasMore | boolean | 显示"加载更早消息" | `false` |
| showDisclaimer | boolean | 显示底部免责声明 | `false` |
| disclaimer | string | 免责声明文案 | `'内容由 AI 生成，请注意甄别'` |

**事件**

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入内容变化 | `string` |
| send | 点击发送或按 Enter | `content: string` |
| stop | 点击停止生成 | — |
| clear | 清空会话 | — |
| regenerate | 重新生成某条消息 | `(message, index)` |
| delete | 删除某条消息 | `(message, index)` |
| load-more | 点击加载更早消息 | — |

**方法**：`scrollToBottom(smooth?)`、`focus()`、`getDraft()`

**插槽**：`header`、`header-extra`、`empty`、`avatar`（`{ message, index }`）、`input`（`{ send, value }`）、`tools`、`handle`

<br />

## 消息结构

```js
{
  id: 'm1',                    // 唯一标识
  role: 'user' | 'assistant' | 'system',
  content: 'Markdown 文本',
  avatar: 'https://...',       // 单条消息头像，优先于全局
  name: '自定义显示名',
  time: '10:24',
  status: 'streaming' | 'done' | 'error',  // streaming 显示光标/打字动画
  markdown: true               // 单条覆盖全局 markdown 设置
}
```

<br />

## 流式输出

只需持续更新消息的 `content`，组件会自动跟随滚动：

```js
const msg = reactive({ id: 'm2', role: 'assistant', content: '', status: 'streaming' });
messages.push(msg);

const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages }) });
const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  msg.content += decoder.decode(value);   // 组件自动渲染 + 滚动
}
msg.status = 'done';
```

<br />

## Markdown 支持范围

| 语法 | 支持 |
| --- | --- |
| 标题 h1~h6 | ✅ |
| 加粗 / 斜体 / 删除线 | ✅ |
| 行内代码 / 围栏代码块（带语言标签） | ✅ |
| 有序 / 无序 / 任务列表 | ✅ |
| 表格（含对齐） | ✅ |
| 引用 / 分割线 / 链接 / 图片 | ✅ |
| 原始 HTML | 默认转义，需显式开 `allow-html` |
| MDX JSX 组件 | 按纯文本转义，**不执行** |

<br />

## 说明

- **默认安全**：所有文本先做 HTML 转义再渲染；链接只放行 `http(s)`/`mailto`/`#`/相对路径，`javascript:` 会被拒绝
- 输入法组词（`isComposing`）期间按 Enter 不会误发送
- 输入框自动增高，最多 6 行后内部滚动
- 仅在用户已经位于底部时才自动跟随滚动，避免打断向上翻看历史
- 复制优先用 `navigator.clipboard`，不支持时降级到 `execCommand`
- Markdown 渲染器零依赖，通过 `renderMarkdown()` 也可单独使用
