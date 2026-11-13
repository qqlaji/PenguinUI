<template>
  <div :class="['pui-code', `pui-code--${theme}`, customClass]">
    <div v-if="showHeader" class="pui-code__hd">
      <div class="pui-code__hd-left">
        <span v-if="title" class="pui-code__title">{{ title }}</span>
        <span v-else class="pui-code__lang">{{ displayLang }}</span>
        <slot name="header"></slot>
      </div>

      <div class="pui-code__hd-right">
        <button
          v-if="collapsible && overflows"
          type="button"
          class="pui-code__tool"
          @click="collapsed = !collapsed"
        >
          {{ collapsed ? expandText : collapseText }}
          <i :class="['iconfont', collapsed ? 't-icon-arrow-down-bold' : 't-icon-arrow-up-bold']" aria-hidden="true"></i>
        </button>

        <button v-if="copyable" type="button" class="pui-code__tool" @click="copy">
          <i :class="['iconfont', copied ? 't-icon-success' : 't-icon-copy']" aria-hidden="true"></i>
          <span>{{ copied ? copiedText : copyText }}</span>
        </button>

        <slot name="extra"></slot>
      </div>
    </div>

    <div
      ref="wrapRef"
      class="pui-code__body"
      :class="{ 'is-collapsed': collapsed }"
      :style="bodyStyle"
    >
      <pre class="pui-code__pre"><div class="pui-code__code"><template v-if="lineNumbers"><div
        v-for="(line, i) in lines"
        :key="i"
        class="pui-code__line"
      ><span class="pui-code__ln" aria-hidden="true">{{ i + 1 }}</span><span class="pui-code__lc" v-html="line"></span></div></template><div v-else class="pui-code__plain" v-html="highlighted"></div></div></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tCodeBlock'
};
</script>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { highlight, highlightLines, normalizeLang } from './highlighter';

const props = defineProps({
  /** 代码内容 */
  code: { type: String, default: '' },
  /** 语言：js/ts/vue/html/css/json/bash/yaml 等 */
  lang: { type: String, default: 'js' },
  /** 标题（不传则显示语言名） */
  title: { type: String, default: '' },
  /** 主题：dark / light */
  theme: { type: String, default: 'dark' },
  /** 显示行号 */
  lineNumbers: { type: Boolean, default: true },
  /** 显示顶部栏 */
  showHeader: { type: Boolean, default: true },
  /** 显示复制按钮 */
  copyable: { type: Boolean, default: true },
  copyText: { type: String, default: '复制' },
  copiedText: { type: String, default: '已复制' },
  /** 超出高度时折叠 */
  collapsible: { type: Boolean, default: false },
  /** 折叠阈值高度（px） */
  collapseHeight: { type: Number, default: 260 },
  expandText: { type: String, default: '展开' },
  collapseText: { type: String, default: '收起' },
  /** 固定最大高度，超出滚动 */
  maxHeight: { type: [Number, String], default: '' },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['copy']);

const wrapRef = ref(null);
const copied = ref(false);
const collapsed = ref(false);
const overflows = ref(false);
let copyTimer = null;

const displayLang = computed(() => {
  const l = normalizeLang(props.lang);
  return l ? l.toUpperCase() : 'CODE';
});

const highlighted = computed(() => highlight(props.code, props.lang));
const lines = computed(() => highlightLines(props.code, props.lang));

const bodyStyle = computed(() => {
  if (collapsed.value) return { maxHeight: `${props.collapseHeight}px`, overflow: 'hidden' };
  if (props.maxHeight !== '') {
    const h = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
    return { maxHeight: h, overflow: 'auto' };
  }
  return {};
});

async function measure() {
  if (!props.collapsible) return;
  await nextTick();
  const el = wrapRef.value;
  if (!el) return;
  // 用 scrollHeight 判断是否超阈值；折叠后 scrollHeight 仍是完整内容高度
  overflows.value = el.scrollHeight > props.collapseHeight + 4;
}

async function copy() {
  const text = props.code;
  let success = false;

  // 优先 Clipboard API；失败（无权限 / 非安全上下文 / 被拒绝）时回退 execCommand
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (e) {
      success = false;
    }
  }

  if (!success) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      success = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {
      success = false;
    }
  }

  // 即使两条路径都失败，也给出反馈，避免用户以为按钮没响应
  copied.value = true;
  emit('copy', text);
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copied.value = false;
  }, 1800);
}

onMounted(measure);
watch(() => [props.code, props.lang, props.collapsible], measure);

defineExpose({ copy });
</script>

<style scoped lang="scss">
.pui-code {
  display: block;
  border-radius: 12px;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.7;

  &--dark {
    background: #0f1722;
    border: 1px solid #1e2a3a;

    .pui-code__hd {
      background: #131d2a;
      border-bottom: 1px solid #1e2a3a;
      color: #94a7bd;
    }

    .pui-code__tool {
      color: #94a7bd;
      &:hover { color: #e6edf6; background: rgba(255, 255, 255, 0.08); }
    }

    .pui-code__ln { color: #4a5b70; }
    .pui-code__pre { color: #d6e0ec; }

    /* token 配色 */
    :deep(.pui-code__keyword) { color: #c792ea; }
    :deep(.pui-code__string) { color: #9ad48f; }
    :deep(.pui-code__number) { color: #f2b47a; }
    :deep(.pui-code__comment) { color: #5d7189; font-style: italic; }
    :deep(.pui-code__function) { color: #7cc4ff; }
    :deep(.pui-code__tag) { color: #f07178; }
    :deep(.pui-code__punctuation) { color: #89a0b8; }
  }

  &--light {
    background: #fbfcfe;
    border: 1px solid var(--pui-border, #e7ecf3);

    .pui-code__hd {
      background: var(--pui-bg-soft, #f7f9fc);
      border-bottom: 1px solid var(--pui-border, #e7ecf3);
      color: var(--pui-text-muted, #8b96a6);
    }

    .pui-code__tool {
      color: var(--pui-text-muted, #8b96a6);
      &:hover { color: var(--pui-brand, #0e80eb); background: rgba(14, 128, 235, 0.08); }
    }

    .pui-code__ln { color: #b6c1cf; }
    .pui-code__pre { color: #1c2534; }

    :deep(.pui-code__keyword) { color: #8250df; }
    :deep(.pui-code__string) { color: #0a7d3f; }
    :deep(.pui-code__number) { color: #b45309; }
    :deep(.pui-code__comment) { color: #8b96a6; font-style: italic; }
    :deep(.pui-code__function) { color: #0a68c4; }
    :deep(.pui-code__tag) { color: #c02a68; }
    :deep(.pui-code__punctuation) { color: #64748b; }
  }

  &__hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    font-size: 12px;
  }

  &__hd-left,
  &__hd-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-weight: 600;
  }

  &__lang {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    opacity: 0.8;
  }

  &__tool {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;

    i { font-size: 11px; }
  }

  &__body {
    position: relative;
    transition: max-height 0.25s ease;
  }

  &__pre {
    margin: 0;
    padding: 14px 16px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    tab-size: 2;
    /* 至少保证自身不撑破父级 */
    max-width: 100%;
    box-sizing: border-box;
  }

  &__code {
    font-family: inherit;
    display: block;
  }

  &__line {
    display: flex;
    align-items: flex-start;
    /* 行宽由内容决定，配合 __lc 的 white-space: pre 触发 pre 横向滚动 */
    width: max-content;
    min-width: 100%;
  }

  &__ln {
    flex: none;
    width: 34px;
    text-align: right;
    padding-right: 14px;
    user-select: none;
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    line-height: 1.7;
  }

  &__lc {
    flex: 1;
    min-width: 0;
    /* 不折行：长行交给 pre 横向滚动，保持代码缩进可读；折行会把代码压得没法看 */
    white-space: pre;
  }

  &__plain {
    white-space: pre;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-code__body { transition: none; }
}
</style>
