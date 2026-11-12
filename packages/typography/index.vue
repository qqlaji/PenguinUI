<template>
  <component
    :is="resolvedTag"
    :class="[
      'pui-typography',
      `pui-typography--${type || 'default'}`,
      customClass,
      {
        'is-disabled': disabled,
        'is-block': block,
        'is-strong': strong,
        'is-italic': italic,
        'is-underline': underline,
        'is-delete': deleteText,
        'is-code': code,
        'is-mark': mark,
        'is-link': resolvedTag === 'a'
      }
    ]"
    :style="rootStyle"
    :href="resolvedTag === 'a' ? href || undefined : undefined"
    :target="resolvedTag === 'a' ? target : undefined"
    :rel="resolvedTag === 'a' && target === '_blank' ? 'noopener noreferrer' : undefined"
  >
    <span ref="textRef" class="pui-typography__text" :style="textStyle">
      <slot>{{ text }}</slot>
      <i
        v-if="resolvedTag === 'a' && href"
        class="iconfont t-icon-arrow-up-right pui-typography__external"
        aria-hidden="true"
      ></i>
    </span>

    <span
      v-if="copyable"
      class="pui-typography__action"
      role="button"
      tabindex="0"
      :title="copied ? copiedTips : copyTips"
      :aria-label="copied ? copiedTips : copyTips"
      @click.stop="copy"
      @keydown.enter.prevent="copy"
      @keydown.space.prevent="copy"
    >
      <i :class="['iconfont', copied ? 't-icon-success' : 't-icon-copy']"></i>
    </span>

    <span
      v-if="showExpand"
      class="pui-typography__expand"
      role="button"
      tabindex="0"
      @click.stop="toggleExpand"
      @keydown.enter.prevent="toggleExpand"
    >
      {{ expanded ? collapseText : expandText }}
    </span>
  </component>
</template>

<script>
export default {
  name: 'tTypography'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** 渲染标签，如 span / div / p / h1 / a */
  tag: { type: String, default: 'span' },
  /** 文本内容（也可用默认插槽） */
  text: { type: [String, Number], default: '' },
  /** 标题级别 1-5，传入后自动使用 h1-h5 标签 */
  level: { type: [Number, String], default: 0 },
  /** 语义色：brand / secondary / success / warning / danger */
  type: { type: String, default: '' },
  /** 字号：预设 small/default/large 或数字 / 任意 CSS 长度 */
  size: { type: [String, Number], default: '' },
  /** 加粗 */
  strong: { type: Boolean, default: false },
  italic: { type: Boolean, default: false },
  underline: { type: Boolean, default: false },
  /** 删除线 */
  delete: { type: Boolean, default: false },
  /** 行内代码样式 */
  code: { type: Boolean, default: false },
  /** 标记底色 */
  mark: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** 独占一行 */
  block: { type: Boolean, default: false },
  /** 省略：true 单行，数字为行数，也可传 { rows, expandable } */
  ellipsis: { type: [Boolean, Number, Object], default: false },
  /** 省略行数（ellipsis 为 true 时生效） */
  rows: { type: Number, default: 1 },
  /** 超出时是否显示展开 / 收起 */
  expandable: { type: Boolean, default: false },
  expandText: { type: String, default: '展开' },
  collapseText: { type: String, default: '收起' },
  /** 可复制 */
  copyable: { type: Boolean, default: false },
  /** 复制内容，默认取渲染文本 */
  copyText: { type: String, default: '' },
  copyTips: { type: String, default: '复制' },
  copiedTips: { type: String, default: '复制成功' },
  /** 链接地址（tag 为 a 时生效） */
  href: { type: String, default: '' },
  target: { type: String, default: '_blank' },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['copy', 'expand', 'collapse']);

const deleteText = computed(() => props.delete);

const resolvedTag = computed(() => {
  const lv = Number(props.level);
  if (lv >= 1 && lv <= 5) return `h${lv}`;
  return props.tag || 'span';
});

const toPx = (v) => {
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
};

const sizeMap = { small: '12px', default: '14px', medium: '14px', large: '16px' };
const rootStyle = computed(() => {
  const style = {};
  if (props.size) style.fontSize = sizeMap[props.size] || toPx(props.size);
  return style;
});

/* ---------------- 省略与展开 ---------------- */
const textRef = ref(null);
const expanded = ref(false);
const overflow = ref(false);

const rowsCount = computed(() => {
  if (!props.ellipsis) return 0;
  if (typeof props.ellipsis === 'number') return Math.max(1, props.ellipsis);
  if (typeof props.ellipsis === 'object' && props.ellipsis && props.ellipsis.rows) {
    return Math.max(1, Number(props.ellipsis.rows));
  }
  return Math.max(1, props.rows || 1);
});

const expandableEnabled = computed(() => {
  if (props.expandable) return true;
  return !!(props.ellipsis && typeof props.ellipsis === 'object' && props.ellipsis.expandable);
});

const showExpand = computed(() => expandableEnabled.value && rowsCount.value > 1 && (overflow.value || expanded.value));

const textStyle = computed(() => {
  if (!rowsCount.value) return {};
  if (expanded.value) return {};
  if (rowsCount.value === 1) {
    return { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
  }
  return {
    display: '-webkit-box',
    '-webkit-line-clamp': String(rowsCount.value),
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden'
  };
});

async function measure() {
  if (!expandableEnabled.value || rowsCount.value <= 1) {
    overflow.value = false;
    return;
  }
  if (expanded.value) return;
  await nextTick();
  const el = textRef.value;
  if (!el) return;
  overflow.value = el.scrollHeight - el.clientHeight > 2;
}

function toggleExpand() {
  expanded.value = !expanded.value;
  emit(expanded.value ? 'expand' : 'collapse');
  if (!expanded.value) measure();
}

/* ---------------- 复制 ---------------- */
const copied = ref(false);
let copyTimer = null;

function legacyCopy(value) {
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.setAttribute('readonly', 'readonly');
  ta.style.cssText = 'position:fixed;top:-1000px;left:-1000px;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    /* 忽略：环境不支持时静默失败 */
  }
  document.body.removeChild(ta);
}

async function copy() {
  if (props.disabled) return;
  const value = props.copyText || (textRef.value ? textRef.value.innerText : String(props.text || ''));
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      legacyCopy(value);
    }
  } catch (e) {
    legacyCopy(value);
  }
  copied.value = true;
  emit('copy', value);
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => { copied.value = false; }, 1600);
}

onMounted(() => {
  measure();
  window.addEventListener('resize', measure);
});

onBeforeUnmount(() => {
  clearTimeout(copyTimer);
  window.removeEventListener('resize', measure);
});

watch(
  () => [props.text, props.ellipsis, props.rows, props.expandable, props.size],
  () => {
    expanded.value = false;
    measure();
  },
  { deep: true }
);

defineExpose({ copy, toggleExpand, textRef });
</script>

<style scoped lang="scss">
.pui-typography {
  display: inline;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--pui-text, #1c2534);
  word-break: break-word;

  &.is-block {
    display: block;
  }

  &__text {
    vertical-align: baseline;
  }

  /* ---------- 语义色 ---------- */
  &--secondary { color: var(--pui-text-muted, #8b96a6); }
  &--brand { color: var(--pui-brand, #0e80eb); }
  &--success { color: var(--pui-success, #09b63d); }
  &--warning { color: var(--pui-warning, #f57b29); }
  &--danger { color: var(--pui-danger, #ec3437); }

  /* ---------- 修饰 ---------- */
  &.is-strong { font-weight: 600; }
  &.is-italic { font-style: italic; }
  &.is-underline .pui-typography__text { border-bottom: 1px solid currentColor; }
  &.is-delete .pui-typography__text { text-decoration: line-through; }
  &.is-mark .pui-typography__text {
    padding: 0 4px;
    border-radius: 4px;
    background: linear-gradient(180deg, transparent 52%, rgba(250, 204, 21, 0.42) 52%);
  }
  &.is-code .pui-typography__text {
    padding: 2px 6px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 6px;
    background: var(--pui-bg-soft, #f7f9fc);
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.9em;
  }
  &.is-link {
    color: var(--pui-brand, #0e80eb);
    text-decoration: none;
    cursor: pointer;

    .pui-typography__text { border-bottom: 1px solid transparent; }
    &:hover .pui-typography__text { border-bottom-color: currentColor; }
    &:hover { color: var(--pui-brand-strong, #0a68c4); }
  }

  &.is-disabled {
    color: var(--pui-text-muted, #8b96a6);
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* ---------- 标题 ---------- */
  &[class*='pui-typography'] {
    &:is(h1, h2, h3, h4, h5) {
      font-weight: 600;
      line-height: 1.4;
      color: var(--pui-text, #1c2534);
    }
  }
}

h1.pui-typography { font-size: 30px; }
h2.pui-typography { font-size: 24px; }
h3.pui-typography { font-size: 19px; }
h4.pui-typography { font-size: 16px; }
h5.pui-typography { font-size: 14px; }

.pui-typography__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 6px;
  border-radius: 6px;
  color: var(--pui-text-muted, #8b96a6);
  font-size: 13px;
  vertical-align: -2px;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
  }
  &:focus-visible {
    outline: 2px solid var(--pui-brand, #0e80eb);
    outline-offset: 1px;
  }
}

.pui-typography__expand {
  margin-left: 6px;
  color: var(--pui-brand, #0e80eb);
  font-size: 13px;
  cursor: pointer;
  user-select: none;

  &:hover { text-decoration: underline; }
}

.pui-typography__external {
  margin-left: 2px;
  font-size: 12px;
  opacity: 0.7;
}
</style>
