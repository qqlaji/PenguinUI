<template>
  <div class="pui-chat" :class="[`pui-chat--${variant}`, { 'is-empty': !messages.length }]">
    <!-- 头部 -->
    <header v-if="showHeader" class="pui-chat__header">
      <slot name="header">
        <div class="pui-chat__header-main">
          <div class="pui-chat__title">{{ title }}</div>
          <div v-if="subtitle" class="pui-chat__subtitle">{{ subtitle }}</div>
        </div>
        <div class="pui-chat__header-extra">
          <slot name="header-extra" />
          <button
            v-if="messages.length && clearable"
            type="button"
            class="pui-chat__icon-btn"
            aria-label="清空会话"
            title="清空会话"
            @click="handleClear"
          >
            <i class="iconfont t-icon-delete" aria-hidden="true"></i>
          </button>
        </div>
      </slot>
    </header>

    <!-- 消息列表 -->
    <div ref="scrollRef" class="pui-chat__body" @scroll="onScroll">
      <!-- 空状态 -->
      <div v-if="!messages.length" class="pui-chat__empty">
        <slot name="empty">
          <div class="pui-chat__empty-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.2-.9L3 20.5l1.6-4.6A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12 2.6a8.4 8.4 0 0 1 9 8.9z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="pui-chat__empty-title">{{ emptyTitle }}</div>
          <div v-if="emptyHint" class="pui-chat__empty-hint">{{ emptyHint }}</div>
          <div v-if="quickPrompts.length" class="pui-chat__prompts">
            <button
              v-for="(p, i) in quickPrompts"
              :key="i"
              type="button"
              class="pui-chat__prompt"
              @click="usePrompt(p)"
            >
              {{ p.label || p }}
            </button>
          </div>
        </slot>
      </div>

      <!-- 消息 -->
      <div
        v-for="(msg, index) in messages"
        :key="msg.id ?? index"
        class="pui-chat__msg"
        :class="[`is-${msg.role}`, { 'is-error': msg.status === 'error' }]"
      >
        <!-- 头像 -->
        <div v-if="showAvatar" class="pui-chat__avatar">
          <slot name="avatar" :message="msg" :index="index">
            <img v-if="avatarOf(msg)" :src="avatarOf(msg)" :alt="roleLabel(msg.role)" />
            <span v-else class="pui-chat__avatar-text">{{ initialOf(msg) }}</span>
          </slot>
        </div>

        <div class="pui-chat__content">
          <div class="pui-chat__meta">
            <span class="pui-chat__name">{{ nameOf(msg) }}</span>
            <span v-if="msg.time" class="pui-chat__time">{{ msg.time }}</span>
          </div>

          <div
            class="pui-chat__bubble"
            :class="{
              'is-markdown': isMarkdown(msg),
              'is-plain': !isMarkdown(msg)
            }"
          >
            <!-- 消息内图片 -->
            <div v-if="msg.images && msg.images.length" class="pui-chat__imgs">
              <img
                v-for="(img, ii) in msg.images"
                :key="ii"
                :src="typeof img === 'string' ? img : img.url"
                :alt="typeof img === 'string' ? `图片 ${ii + 1}` : img.name || `图片 ${ii + 1}`"
                loading="lazy"
                @click="$emit('image-click', img, ii)"
              />
            </div>

            <!-- 思考中 -->
            <span v-if="msg.status === 'streaming' && !msg.content" class="pui-chat__typing">
              <i></i><i></i><i></i>
            </span>

            <!-- 渲染内容 -->
            <div
              v-else-if="isMarkdown(msg)"
              class="pui-chat__md pui-md"
              v-html="renderMarkdown(msg.content)"
            ></div>
            <div v-else class="pui-chat__text">{{ msg.content }}</div>

            <!-- 流式光标 -->
            <span v-if="msg.status === 'streaming' && msg.content" class="pui-chat__caret"></span>
          </div>

          <!-- 消息操作 -->
          <div v-if="showActions(msg)" class="pui-chat__actions">
            <button
              type="button"
              class="pui-chat__action"
              title="复制"
              aria-label="复制内容"
              @click="copyMessage(msg)"
            >
              <i :class="['iconfont', copiedId === (msg.id ?? index) ? 't-icon-check-circle' : 't-icon-clipboard']" aria-hidden="true"></i>
            </button>
            <button
              v-if="msg.role === 'assistant' && regenerable"
              type="button"
              class="pui-chat__action"
              title="重新生成"
              aria-label="重新生成"
              @click="$emit('regenerate', msg, index)"
            >
              <i class="iconfont t-icon-refresh" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              class="pui-chat__action"
              title="删除"
              aria-label="删除这条消息"
              @click="removeMessage(index)"
            >
              <i class="iconfont t-icon-delete" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="pui-chat__more">
        <button type="button" class="pui-chat__more-btn" @click="$emit('load-more')">
          加载更早的消息
        </button>
      </div>

      <div ref="bottomRef" class="pui-chat__bottom-anchor"></div>
    </div>

    <!-- 回到底部 -->
    <transition name="pui-chat-fade">
      <button
        v-if="!atBottom && messages.length"
        type="button"
        class="pui-chat__scroll-btn"
        aria-label="回到底部"
        @click="scrollToBottom(true)"
      >
        <i class="iconfont t-icon-arrow-down-bold" aria-hidden="true"></i>
      </button>
    </transition>

    <!-- 输入区 -->
    <footer v-if="!readonly" class="pui-chat__footer">
      <slot name="input" :send="handleSend" :value="draft">
        <div class="pui-chat__composer" :class="{ 'is-disabled': disabled, 'is-focus': focused }">
          <!-- 待发送的图片预览 -->
          <div v-if="attachments.length" class="pui-chat__attach">
            <div
              v-for="(a, i) in attachments"
              :key="a.id"
              class="pui-chat__attach-item"
            >
              <img :src="a.url" :alt="a.name" />
              <button
                type="button"
                class="pui-chat__attach-remove"
                :aria-label="`移除 ${a.name}`"
                @click="removeAttachment(i)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <textarea
            ref="inputRef"
            v-model="draft"
            class="pui-chat__input"
            :placeholder="placeholder"
            :disabled="disabled || loading"
            rows="1"
            @focus="focused = true"
            @blur="focused = false"
            @keydown="onKeydown"
            @input="autoGrow"
          ></textarea>

          <div class="pui-chat__tools">
            <div class="pui-chat__tools-left">
              <!-- 图片上传 -->
              <button
                v-if="allowImage"
                type="button"
                class="pui-chat__tool-btn"
                :disabled="disabled || loading || attachments.length >= maxImages"
                aria-label="上传图片"
                title="上传图片"
                @click="pickImage"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7" />
                  <circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" />
                  <path d="M4.2 17l4.6-4.8 3.2 3.2 3-2.8 4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input
                  ref="fileRef"
                  type="file"
                  accept="image/*"
                  multiple
                  class="pui-chat__file-input"
                  @change="onFilesChange"
                />
              </button>

              <slot name="tools" />
            </div>

            <div class="pui-chat__tools-right">
              <span class="pui-chat__hint">{{ hintText }}</span>

              <button
                v-if="loading"
                type="button"
                class="pui-chat__send pui-chat__send--stop"
                aria-label="停止生成"
                @click="$emit('stop')"
              >
                <span class="pui-chat__stop-square"></span>
              </button>
              <button
                v-else
                type="button"
                class="pui-chat__send"
                :disabled="!canSend"
                aria-label="发送"
                @click="handleSend"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12l16-8-6 8 6 8-16-8z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </slot>

      <div v-if="showDisclaimer" class="pui-chat__disclaimer">{{ disclaimer }}</div>
    </footer>
  </div>
</template>

<script>
export default { name: 'tChat' };
</script>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { renderMarkdown as renderMd } from './markdown';

const props = defineProps({
  /** 消息列表：[{ id, role, content, avatar, name, time, status, markdown }] */
  messages: { type: Array, default: () => [] },
  /** 布局变体：default / compact / plain */
  variant: { type: String, default: 'default' },
  /** 标题与副标题 */
  title: { type: String, default: 'AI 助手' },
  subtitle: { type: String, default: '' },
  showHeader: { type: Boolean, default: true },

  /** 输入相关 */
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '输入消息，Enter 发送，Shift + Enter 换行' },
  /** 是否正在等待回复（显示停止按钮） */
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** 只读模式（隐藏输入区） */
  readonly: { type: Boolean, default: false },
  /** 最多字符数，0 不限制 */
  maxlength: { type: Number, default: 0 },
  /** Enter 发送 / Ctrl+Enter 发送 */
  sendOn: { type: String, default: 'enter' }, // enter | ctrl-enter

  /** 展示 */
  showAvatar: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  /** 是否默认把 assistant 消息按 Markdown 渲染 */
  markdown: { type: Boolean, default: true },
  /** 允许 Markdown 里的原始 HTML（默认关闭，防 XSS） */
  allowHtml: { type: Boolean, default: false },
  /** 用户头像与 AI 头像 */
  userAvatar: { type: String, default: '' },
  assistantAvatar: { type: String, default: '' },
  /** 角色显示名 */
  userLabel: { type: String, default: '我' },
  assistantLabel: { type: String, default: 'AI' },

  /** 空状态 */
  emptyTitle: { type: String, default: '有什么可以帮你？' },
  emptyHint: { type: String, default: '' },
  /** 快捷问题：[{ label, value }] 或 ['问题1'] */
  quickPrompts: { type: Array, default: () => [] },

  /** 是否可清空 / 重新生成 */
  clearable: { type: Boolean, default: true },
  regenerable: { type: Boolean, default: true },
  /** 加载更早消息 */
  hasMore: { type: Boolean, default: false },

  /** 底部免责声明 */
  showDisclaimer: { type: Boolean, default: false },
  disclaimer: { type: String, default: '内容由 AI 生成，请注意甄别' },
  /** 发送快捷键提示文案，空则自动生成 */
  hint: { type: String, default: '' },

  /** 是否允许发送图片 */
  allowImage: { type: Boolean, default: false },
  /** 单次最多图片数 */
  maxImages: { type: Number, default: 4 },
  /** 单张图片大小上限（MB） */
  maxImageSize: { type: Number, default: 8 },
  /** 单张图片最大边长（px），超出会等比缩放后压缩为 JPEG */
  maxImageEdge: { type: Number, default: 1600 }
});

const emit = defineEmits([
  'update:modelValue',
  'send',
  'stop',
  'clear',
  'regenerate',
  'delete',
  'load-more',
  'image-click',
  'image-error'
]);

const scrollRef = ref(null);
const bottomRef = ref(null);
const inputRef = ref(null);
const fileRef = ref(null);

/** 待发送的图片附件：[{ id, name, url, size }] */
const attachments = ref([]);

const draft = ref(props.modelValue);
const focused = ref(false);
const atBottom = ref(true);
const copiedId = ref(null);

/* ---------------- 草稿双向绑定 ---------------- */
watch(draft, (v) => emit('update:modelValue', v));
watch(
  () => props.modelValue,
  (v) => {
    if (v !== draft.value) draft.value = v;
  }
);

/* ---------------- 计算 ---------------- */
const canSend = computed(
  () =>
    !props.disabled &&
    !props.loading &&
    // 有文字或有图片都能发
    (draft.value.trim().length > 0 || attachments.value.length > 0)
);

const hintText = computed(() => {
  if (props.hint) return props.hint;
  return props.sendOn === 'ctrl-enter' ? 'Ctrl+Enter 发送' : 'Enter 发送';
});

/** 判断某条消息是否走 Markdown */
function isMarkdown(msg) {
  if (msg.markdown !== undefined) return !!msg.markdown;
  return props.markdown && msg.role === 'assistant';
}

function roleLabel(role) {
  return role === 'user' ? props.userLabel : props.assistantLabel;
}

function nameOf(msg) {
  return msg.name || roleLabel(msg.role);
}

function avatarOf(msg) {
  if (msg.avatar) return msg.avatar;
  return msg.role === 'user' ? props.userAvatar : props.assistantAvatar;
}

function initialOf(msg) {
  const label = nameOf(msg);
  return label ? label.slice(0, 1).toUpperCase() : '?';
}

function showActions(msg) {
  return (
    props.showActions &&
    msg.status !== 'streaming' &&
    msg.content &&
    msg.role !== 'system'
  );
}

/** 渲染 Markdown（带 allowHtml 开关） */
function renderMarkdown(content) {
  return renderMd(content, { allowHtml: props.allowHtml });
}

/* ---------------- 图片附件 ---------------- */
function pickImage() {
  if (props.disabled || props.loading) return;
  if (fileRef.value) {
    // 清空 value，保证同一张图可以连续选择
    fileRef.value.value = '';
    fileRef.value.click();
  }
}

/**
 * 把任意图片文件转成 dataURL，必要时等比缩放到 maxImageEdge 以内，
 * 避免用户传 4000px 大图直接把消息列表卡死。
 */
function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读取失败'));
    reader.onload = () => {
      const src = String(reader.result || '');
      const img = new Image();
      img.onerror = () => reject(new Error('图片解析失败'));
      img.onload = () => {
        const edge = props.maxImageEdge;
        const { width, height } = img;
        // 小图直接返回原图，避免二次压缩损失
        if (width <= edge && height <= edge && file.size <= 600 * 1024) {
          resolve(src);
          return;
        }
        const scale = Math.min(1, edge / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

async function onFilesChange(e) {
  const files = [...(e.target.files || [])];
  if (!files.length) return;

  const remain = props.maxImages - attachments.value.length;
  for (const file of files.slice(0, Math.max(0, remain))) {
    if (!file.type.startsWith('image/')) {
      emit('image-error', { file, reason: '不是图片文件' });
      continue;
    }
    if (file.size > props.maxImageSize * 1024 * 1024) {
      emit('image-error', { file, reason: `超过 ${props.maxImageSize}MB` });
      continue;
    }
    try {
      const url = await readImage(file);
      attachments.value.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        url
      });
    } catch (err) {
      emit('image-error', { file, reason: err.message || '处理失败' });
    }
  }

  // 清空，允许重复选同一文件
  e.target.value = '';
}

function removeAttachment(i) {
  attachments.value.splice(i, 1);
}

/* ---------------- 发送 ---------------- */
function handleSend() {
  if (!canSend.value) return;
  const text = draft.value.trim();

  // 超过长度上限时截断，而不是静默丢弃
  const content = props.maxlength > 0 ? text.slice(0, props.maxlength) : text;

  const imgs = attachments.value.map((a) => ({ url: a.url, name: a.name }));
  attachments.value = [];

  emit('send', content, { images: imgs });
  draft.value = '';

  nextTick(() => {
    autoGrow();
    scrollToBottom(true);
  });
}

function usePrompt(p) {
  const text = typeof p === 'string' ? p : p.value ?? p.label;
  draft.value = text;
  nextTick(() => {
    autoGrow();
    inputRef.value && inputRef.value.focus();
  });
}

function onKeydown(e) {
  if (e.isComposing) return; // 中文输入法组词中，不触发发送

  if (props.sendOn === 'ctrl-enter') {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
    return;
  }

  // 默认：Enter 发送，Shift+Enter 换行
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    handleSend();
  }
}

/** 文本域自动增高（最多 6 行） */
function autoGrow() {
  const el = inputRef.value;
  if (!el) return;
  el.style.height = 'auto';
  const lineHeight = 22;
  const maxH = lineHeight * 6;
  el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
}

/* ---------------- 滚动 ---------------- */
function onScroll() {
  const el = scrollRef.value;
  if (!el) return;
  // 距底部 40px 内视为"在底部"
  atBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
}

function scrollToBottom(smooth = false) {
  const el = scrollRef.value;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  atBottom.value = true;
}

// 新消息或内容变化时，如果用户本来就在底部，就跟着滚
watch(
  () => props.messages.map((m) => `${m.id ?? ''}:${(m.content || '').length}:${m.status || ''}`).join('|'),
  () => {
    if (atBottom.value) {
      nextTick(() => scrollToBottom(false));
    }
  }
);

/* ---------------- 消息操作 ---------------- */
async function copyMessage(msg) {
  const text = String(msg.content || '');
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // 降级方案：临时 textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copiedId.value = msg.id ?? props.messages.indexOf(msg);
    setTimeout(() => {
      copiedId.value = null;
    }, 1600);
  } catch (e) {
    /* 复制失败静默处理 */
  }
}

function removeMessage(index) {
  emit('delete', props.messages[index], index);
}

function handleClear() {
  emit('clear');
}

/* ---------------- 生命周期 ---------------- */
onMounted(() => {
  nextTick(() => {
    autoGrow();
    scrollToBottom(false);
  });
});

defineExpose({
  scrollToBottom,
  focus: () => inputRef.value && inputRef.value.focus(),
  getDraft: () => draft.value
});
</script>

<style scoped lang="scss">
.pui-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
  overflow: hidden;
  box-sizing: border-box;

  &--plain {
    border: none;
    border-radius: 0;
    background: transparent;
  }

  &--compact {
    border-radius: 10px;
  }

  /* ---------- 头部 ---------- */
  &__header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--pui-border, #e7ecf3);
    background: var(--pui-bg-elevated, #fff);
  }

  &__header-main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 650;
    color: var(--pui-text, #1c2534);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__subtitle {
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__header-extra {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: none;
  }

  &__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;

    i { font-size: 13px; }

    &:hover {
      background: var(--pui-bg-soft, #f0f3f8);
      color: var(--pui-danger, #ec3437);
    }
  }

  /* ---------- 消息区 ---------- */
  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 18px 16px 8px;
    scroll-behavior: auto;
    position: relative;
  }

  &__bottom-anchor {
    height: 1px;
  }

  /* ---------- 空状态 ---------- */
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 240px;
    padding: 24px 12px;
    text-align: center;
  }

  &__empty-icon {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
    color: var(--pui-brand, #0e80eb);

    svg { width: 24px; height: 24px; }
  }

  &__empty-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--pui-text, #1c2534);
  }

  &__empty-hint {
    font-size: 12.5px;
    color: var(--pui-text-muted, #8b96a6);
    max-width: 320px;
    line-height: 1.7;
  }

  &__prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 6px;
    max-width: 460px;
  }

  &__prompt {
    padding: 6px 12px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 8px;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text-sub, #5b6879);
    font-family: inherit;
    font-size: 12.5px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
      color: var(--pui-brand, #0e80eb);
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.06));
    }
  }

  /* ---------- 单条消息 ---------- */
  &__msg {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    align-items: flex-start;

    &.is-user {
      flex-direction: row-reverse;

      .pui-chat__content { align-items: flex-end; }
      .pui-chat__meta { flex-direction: row-reverse; }
      .pui-chat__bubble {
        background: var(--pui-brand, #0e80eb);
        color: #fff;
        border-color: transparent;
      }
      .pui-chat__actions { justify-content: flex-end; }
    }
  }

  &__avatar {
    flex: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    background: var(--pui-bg-soft, #f0f3f8);
    color: var(--pui-text-sub, #5b6879);
    font-size: 12px;
    font-weight: 600;
    margin-top: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__avatar-text {
    line-height: 1;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: min(76%, 620px);
    min-width: 0;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11.5px;
    color: var(--pui-text-muted, #8b96a6);
    line-height: 1.4;
  }

  &__name {
    font-weight: 600;
    color: var(--pui-text-sub, #5b6879);
  }

  &__bubble {
    position: relative;
    padding: 9px 13px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 12px;
    background: var(--pui-bg-soft, #f7f9fc);
    color: var(--pui-text, #1c2534);
    font-size: 13.5px;
    line-height: 1.7;
    word-break: break-word;
    overflow-wrap: anywhere;
    box-sizing: border-box;
    max-width: 100%;

    &.is-plain {
      white-space: pre-wrap;
    }
  }

  &__text {
    white-space: pre-wrap;
  }

  /* ---------- 操作 ---------- */
  &__actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &__msg:hover &__actions {
    opacity: 1;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;

    i { font-size: 12px; }

    &:hover {
      background: var(--pui-bg-soft, #f0f3f8);
      color: var(--pui-text, #1c2534);
    }
  }

  /* ---------- 输入中动画 ---------- */
  &__typing {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 3px 0;

    i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--pui-text-muted, #8b96a6);
      animation: pui-chat-bounce 1.1s infinite ease-in-out;

      &:nth-child(2) { animation-delay: 0.16s; }
      &:nth-child(3) { animation-delay: 0.32s; }
    }
  }

  &__caret {
    display: inline-block;
    width: 2px;
    height: 14px;
    margin-left: 2px;
    vertical-align: -2px;
    background: var(--pui-brand, #0e80eb);
    animation: pui-chat-blink 1s steps(1) infinite;
  }

  /* ---------- 加载更多 ---------- */
  &__more {
    text-align: center;
    padding: 4px 0 12px;
  }

  &__more-btn {
    padding: 5px 12px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 7px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;

    &:hover { color: var(--pui-brand, #0e80eb); border-color: var(--pui-brand, #0e80eb); }
  }

  /* ---------- 回到底部 ---------- */
  &__scroll-btn {
    position: absolute;
    right: 22px;
    bottom: 132px;
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 50%;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text-sub, #5b6879);
    box-shadow: 0 4px 12px rgba(24, 44, 78, 0.1);
    cursor: pointer;
    z-index: 2;

    i { font-size: 11px; }

    &:hover { color: var(--pui-brand, #0e80eb); }
  }

  /* ---------- 输入区 ---------- */
  &__footer {
    flex: none;
    padding: 10px 14px 12px;
    border-top: 1px solid var(--pui-border, #e7ecf3);
    background: var(--pui-bg-elevated, #fff);
  }

  &__composer {
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 11px;
    background: var(--pui-bg-elevated, #fff);
    padding: 8px 10px 6px;
    transition: border-color 0.16s ease, box-shadow 0.16s ease;
    box-sizing: border-box;

    &.is-focus {
      border-color: var(--pui-brand, #0e80eb);
      box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
    }

    &.is-disabled {
      opacity: 0.65;
      pointer-events: none;
    }
  }

  &__input {
    display: block;
    width: 100%;
    min-height: 22px;
    max-height: 132px;
    padding: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    font-family: inherit;
    font-size: 13.5px;
    line-height: 22px;
    color: var(--pui-text, #1c2534);
    box-sizing: border-box;
    overflow-y: hidden;

    &::placeholder {
      color: var(--pui-text-muted, #8b96a6);
    }
  }

  &__tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 4px;
  }

  &__tools-left,
  &__tools-right {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  /* ---------- 图片上传 ---------- */
  &__tool-btn {
    position: relative;
    flex: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;

    svg {
      width: 16px;
      height: 16px;
      display: block;
    }

    &:hover:not(:disabled) {
      color: var(--pui-brand, #0e80eb);
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
    }

    &:disabled {
      opacity: 0.42;
      cursor: not-allowed;
    }
  }

  &__file-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  /* 待发送图片预览 */
  &__attach {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }

  &__attach-item {
    position: relative;
    width: 52px;
    height: 52px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--pui-border, #e7ecf3);
    background: var(--pui-bg-soft, #f7f9fc);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &:hover .pui-chat__attach-remove {
      opacity: 1;
    }
  }

  &__attach-remove {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease;

    svg {
      width: 9px;
      height: 9px;
    }

    &:hover {
      background: var(--pui-danger, #ec3437);
    }
  }

  /* 消息内图片 */
  &__imgs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 6px;

    img {
      max-width: 180px;
      max-height: 180px;
      border-radius: 8px;
      object-fit: cover;
      cursor: zoom-in;
      display: block;
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
  }

  &__hint {
    font-size: 11px;
    color: var(--pui-text-muted, #8b96a6);
    white-space: nowrap;

    @media (max-width: 560px) {
      display: none;
    }
  }

  &__send {
    flex: none;
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: var(--pui-brand, #0e80eb);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.15s ease, opacity 0.15s ease;

    svg { width: 16px; height: 16px; }

    &:hover:not(:disabled) {
      background: var(--pui-brand-hover, #0d73d4);
    }

    &:disabled {
      background: var(--pui-border-strong, #d8e0ea);
      color: var(--pui-text-muted, #8b96a6);
      cursor: not-allowed;
    }

    &--stop {
      background: var(--pui-danger, #ec3437);
    }
  }

  &__stop-square {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    background: #fff;
  }

  &__disclaimer {
    margin-top: 7px;
    text-align: center;
    font-size: 11px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &.is-empty &__body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.pui-chat-fade-enter-active,
.pui-chat-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pui-chat-fade-enter-from,
.pui-chat-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@keyframes pui-chat-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

@keyframes pui-chat-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ===========================================================================
   Markdown 样式（v-html 渲染的节点不带 scoped 属性，需用 :deep）
   =========================================================================== */
.pui-chat__md {
  :deep(.pui-md__p) { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
  :deep(.pui-md__h1),
  :deep(.pui-md__h2),
  :deep(.pui-md__h3),
  :deep(.pui-md__h4),
  :deep(.pui-md__h5),
  :deep(.pui-md__h6) {
    margin: 12px 0 7px;
    line-height: 1.4;
    font-weight: 650;
    &:first-child { margin-top: 0; }
  }
  :deep(.pui-md__h1) { font-size: 17px; }
  :deep(.pui-md__h2) { font-size: 15.5px; }
  :deep(.pui-md__h3) { font-size: 14.5px; }
  :deep(.pui-md__h4),
  :deep(.pui-md__h5),
  :deep(.pui-md__h6) { font-size: 13.5px; }

  :deep(.pui-md__ul),
  :deep(.pui-md__ol) {
    margin: 6px 0;
    padding-left: 20px;
  }
  :deep(.pui-md__li) { margin: 3px 0; }

  :deep(.pui-md__li--task) {
    list-style: none;
    margin-left: -20px;
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }
  :deep(.pui-md__task) {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 4px;
    border: 1.5px solid var(--pui-border-strong, #c9d3e0);
    border-radius: 3px;
    display: inline-grid;
    place-items: center;
    color: #fff;

    &.is-checked {
      background: var(--pui-brand, #0e80eb);
      border-color: var(--pui-brand, #0e80eb);
    }
    svg { width: 10px; height: 10px; }
  }

  :deep(.pui-md__code-inline) {
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--pui-bg-soft, #eef2f8);
    color: var(--pui-danger, #d6336c);
    font-family: var(--pui-font-mono, Consolas, Monaco, monospace);
    font-size: 0.9em;
  }

  :deep(.pui-md__pre-wrap) {
    margin: 8px 0;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 9px;
    overflow: hidden;
    background: var(--pui-code-bg, #f6f8fb);
  }
  :deep(.pui-md__pre-head) {
    padding: 5px 10px;
    border-bottom: 1px solid var(--pui-border, #e7ecf3);
    background: var(--pui-bg-soft, #eef2f8);
  }
  :deep(.pui-md__pre-lang) {
    font-size: 11px;
    color: var(--pui-text-muted, #8b96a6);
    font-family: var(--pui-font-mono, Consolas, Monaco, monospace);
    text-transform: lowercase;
  }
  :deep(.pui-md__pre) {
    margin: 0;
    padding: 10px 12px;
    overflow-x: auto;
    font-family: var(--pui-font-mono, Consolas, Monaco, monospace);
    font-size: 12.5px;
    line-height: 1.6;
    color: var(--pui-text, #1c2534);
  }

  :deep(.pui-md__table-wrap) {
    margin: 8px 0;
    overflow-x: auto;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 8px;
  }
  :deep(.pui-md__table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
  }
  :deep(.pui-md__table th) {
    padding: 6px 10px;
    text-align: left;
    font-weight: 600;
    background: var(--pui-bg-soft, #f7f9fc);
    border-bottom: 1px solid var(--pui-border, #e7ecf3);
    white-space: nowrap;
  }
  :deep(.pui-md__table td) {
    padding: 6px 10px;
    border-bottom: 1px solid var(--pui-border, #e7ecf3);
  }
  :deep(.pui-md__table tr:last-child td) { border-bottom: none; }

  :deep(.pui-md__quote) {
    margin: 8px 0;
    padding: 6px 12px;
    border-left: 3px solid var(--pui-brand, #0e80eb);
    background: var(--pui-bg-soft, #f7f9fc);
    color: var(--pui-text-sub, #5b6879);
    border-radius: 0 6px 6px 0;
  }

  :deep(.pui-md__hr) {
    margin: 12px 0;
    border: none;
    border-top: 1px solid var(--pui-border, #e7ecf3);
  }

  :deep(.pui-md__link) {
    color: var(--pui-brand, #0e80eb);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  :deep(.pui-md__img) {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    display: block;
    margin: 6px 0;
  }
}

/* 用户气泡里的 Markdown 用反色，避免白底白字 */
.pui-chat__msg.is-user .pui-chat__md {
  :deep(.pui-md__code-inline) {
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
  }
  :deep(.pui-md__link) { color: #fff; }
  :deep(.pui-md__quote) {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
    border-left-color: rgba(255, 255, 255, 0.7);
  }
  :deep(.pui-md__pre-wrap) {
    background: rgba(0, 0, 0, 0.18);
    border-color: rgba(255, 255, 255, 0.2);
  }
  :deep(.pui-md__pre-head) { background: rgba(0, 0, 0, 0.14); border-color: rgba(255, 255, 255, 0.16); }
  :deep(.pui-md__pre) { color: #fff; }
  :deep(.pui-md__pre-lang) { color: rgba(255, 255, 255, 0.75); }
}

@media (prefers-reduced-motion: reduce) {
  .pui-chat__typing i,
  .pui-chat__caret { animation: none; }
  .pui-chat-fade-enter-active,
  .pui-chat-fade-leave-active { transition: none; }
}

/* 窄屏适配 */
@media (max-width: 560px) {
  .pui-chat__content { max-width: 84%; }
  .pui-chat__body { padding: 14px 10px 6px; }
  .pui-chat__footer { padding: 8px 10px 10px; }
}
</style>
