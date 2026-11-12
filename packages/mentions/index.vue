<template>
  <div
    ref="rootRef"
    :class="['pui-mentions', customClass, { 'is-disabled': disabled, 'is-focus': focused }]"
  >
    <textarea
      ref="taRef"
      class="pui-mentions__inner"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength || undefined"
      @input="onInput"
      @click="onCaret"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    ></textarea>

    <span v-if="showCount" class="pui-mentions__count">
      {{ String(modelValue || '').length }} / {{ maxlength || '∞' }}
    </span>

    <teleport to="body">
      <transition name="pui-mentions-fade">
        <div
          v-if="open"
          ref="panelRef"
          class="pui-mentions__panel"
          :style="panelStyle"
          @mouseenter="hoverPanel = true"
          @mouseleave="hoverPanel = false"
        >
          <ul v-if="filtered.length" class="pui-mentions__list">
            <li
              v-for="(opt, i) in filtered"
              :key="`${opt.value}-${i}`"
              :class="['pui-mentions__option', { 'is-active': i === activeIndex, 'is-disabled': opt.disabled }]"
              @mousedown.prevent="pick(opt)"
              @mouseenter="activeIndex = i"
            >
              <slot name="option" :option="opt" :index="i">
                <span v-if="opt.avatar" class="pui-mentions__avatar">
                  <img v-if="isUrl(opt.avatar)" :src="opt.avatar" alt="" />
                  <template v-else>{{ opt.avatar }}</template>
                </span>
                <span class="pui-mentions__label">{{ opt.label }}</span>
                <span v-if="opt.description" class="pui-mentions__desc">{{ opt.description }}</span>
              </slot>
            </li>
          </ul>

          <div v-else class="pui-mentions__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'tMentions'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  /** 候选：字符串数组，或 { value, label, description, avatar, disabled } */
  options: { type: Array, default: () => [] },
  /** 触发前缀 */
  prefix: { type: String, default: '@' },
  /** 插入后的分隔符 */
  split: { type: String, default: ' ' },
  rows: { type: Number, default: 3 },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  /** 输入前缀后按关键词过滤 */
  filterable: { type: Boolean, default: true },
  emptyText: { type: String, default: '暂无匹配成员' },
  maxlength: { type: [Number, String], default: '' },
  showCount: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'select', 'search', 'change', 'focus', 'blur']);

const rootRef = ref(null);
const taRef = ref(null);
const panelRef = ref(null);
const open = ref(false);
const focused = ref(false);
const hoverPanel = ref(false);
const activeIndex = ref(0);
const query = ref('');
const pos = ref({ top: 0, left: 0 });

let prefixIndex = -1;
let caretPos = 0;

const normalized = computed(() =>
  (props.options || []).map((opt) => {
    if (opt !== null && typeof opt === 'object') {
      return {
        label: opt.label !== undefined ? String(opt.label) : String(opt.value ?? ''),
        value: opt.value !== undefined ? opt.value : opt.label,
        description: opt.description || '',
        avatar: opt.avatar || '',
        disabled: !!opt.disabled
      };
    }
    return { label: String(opt), value: opt, description: '', avatar: '', disabled: false };
  })
);

const filtered = computed(() => {
  const list = normalized.value;
  const q = query.value.trim().toLowerCase();
  if (!props.filterable || !q) return list;
  return list.filter(
    (opt) =>
      opt.label.toLowerCase().includes(q) ||
      String(opt.value).toLowerCase().includes(q)
  );
});

const panelStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`
}));

const isUrl = (v) => /^(https?:)?\/\//.test(String(v)) || String(v).startsWith('data:');

/* ---------------- 检测触发 ---------------- */
function closePanel() {
  if (!open.value) return;
  open.value = false;
  unbindGlobal();
}

function detect(el) {
  if (!el || props.disabled) return;
  const value = el.value;
  const caret = typeof el.selectionStart === 'number' ? el.selectionStart : value.length;
  const before = value.slice(0, caret);
  const idx = before.lastIndexOf(props.prefix);

  if (idx === -1) return closePanel();

  const prevChar = idx > 0 ? before[idx - 1] : '';
  if (prevChar && !/\s/.test(prevChar)) return closePanel();

  const q = before.slice(idx + props.prefix.length);
  if (/[\s\n]/.test(q)) return closePanel();

  prefixIndex = idx;
  caretPos = caret;
  query.value = q;

  if (!open.value) {
    open.value = true;
    bindGlobal();
  }
  activeIndex.value = 0;
  emit('search', q, props.prefix);

  nextTick(() => computePosition(el, caret));
}

function onInput(e) {
  const value = e.target.value;
  emit('update:modelValue', value);
  emit('change', value);
  detect(e.target);
}

function onCaret(e) {
  detect(e.target);
}

/* ---------------- 定位 ---------------- */
const MIRROR_PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight',
  'textTransform', 'textIndent', 'paddingTop', 'paddingRight', 'paddingBottom',
  'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'
];

function computePosition(el, caret) {
  const cs = getComputedStyle(el);
  const mirror = document.createElement('div');
  MIRROR_PROPS.forEach((k) => {
    mirror.style[k] = cs[k];
  });
  mirror.style.position = 'fixed';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';
  mirror.style.visibility = 'hidden';
  mirror.style.boxSizing = 'border-box';
  mirror.style.width = `${el.clientWidth}px`;
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.textContent = el.value.slice(0, caret);

  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6 || 20;
  const rect = el.getBoundingClientRect();
  const markerTop = marker.offsetTop;
  const markerLeft = marker.offsetLeft;
  document.body.removeChild(mirror);

  let top = rect.top + markerTop - el.scrollTop + lineHeight + 6;
  let left = rect.left + markerLeft;

  const panelW = panelRef.value ? panelRef.value.offsetWidth : 240;
  const panelH = panelRef.value ? panelRef.value.offsetHeight : 220;
  const margin = 8;

  left = Math.max(margin, Math.min(left, window.innerWidth - panelW - margin));
  if (top + panelH > window.innerHeight - margin) {
    top = Math.max(margin, rect.top + markerTop - el.scrollTop - panelH - 6);
  }

  pos.value = { top, left };
}

/* ---------------- 全局监听 ---------------- */
function onGlobalChange() {
  if (open.value && taRef.value) computePosition(taRef.value, caretPos);
}

function onDocDown(e) {
  const t = e.target;
  if (rootRef.value && rootRef.value.contains(t)) return;
  if (panelRef.value && panelRef.value.contains(t)) return;
  closePanel();
}

function bindGlobal() {
  window.addEventListener('scroll', onGlobalChange, true);
  window.addEventListener('resize', onGlobalChange);
  document.addEventListener('mousedown', onDocDown, true);
}
function unbindGlobal() {
  window.removeEventListener('scroll', onGlobalChange, true);
  window.removeEventListener('resize', onGlobalChange);
  document.removeEventListener('mousedown', onDocDown, true);
}

/* ---------------- 选择 ---------------- */
function pick(opt) {
  if (opt.disabled) return;
  const value = props.modelValue || '';
  const before = value.slice(0, prefixIndex);
  const after = value.slice(caretPos);
  const insert = `${props.prefix}${opt.label}${props.split}`;
  const next = before + insert + after;

  emit('update:modelValue', next);
  emit('change', next);
  emit('select', opt);
  closePanel();

  nextTick(() => {
    const el = taRef.value;
    if (!el) return;
    el.focus();
    const p = (before + insert).length;
    el.setSelectionRange(p, p);
  });
}

/* ---------------- 焦点与键盘 ---------------- */
function onFocus(e) {
  focused.value = true;
  emit('focus', e);
}

function onBlur(e) {
  focused.value = false;
  emit('blur', e);
  window.setTimeout(() => {
    if (!hoverPanel.value) closePanel();
  }, 140);
}

function onKeydown(e) {
  if (!open.value) return;
  const list = filtered.value;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (list.length) activeIndex.value = (activeIndex.value + 1) % list.length;
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (list.length) activeIndex.value = (activeIndex.value - 1 + list.length) % list.length;
      break;
    case 'Enter':
    case 'Tab':
      if (list[activeIndex.value]) {
        e.preventDefault();
        pick(list[activeIndex.value]);
      }
      break;
    case 'Escape':
      e.preventDefault();
      closePanel();
      break;
    default:
      break;
  }
}

watch(filtered, () => {
  activeIndex.value = 0;
});

onBeforeUnmount(() => {
  unbindGlobal();
});

defineExpose({ focus: () => taRef.value && taRef.value.focus(), blur: () => taRef.value && taRef.value.blur(), close: closePanel });
</script>

<style scoped lang="scss">
.pui-mentions {
  position: relative;
  display: block;
  width: 100%;

  &__inner {
    display: block;
    width: 100%;
    padding: 9px 12px 22px;
    box-sizing: border-box;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 10px;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text, #1c2534);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.7;
    outline: none;
    resize: vertical;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;

    &::placeholder {
      color: var(--pui-text-muted, #8b96a6);
    }

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
    }
  }

  &.is-focus &__inner {
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  }

  &.is-disabled &__inner {
    background: var(--pui-bg-soft, #f7f9fc);
    cursor: not-allowed;
    opacity: 0.72;

    &:hover { border-color: var(--pui-border-strong, #d8e0ea); }
  }

  &__count {
    position: absolute;
    right: 12px;
    bottom: 8px;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }

  &__panel {
    position: fixed;
    z-index: 3000;
    width: 240px;
    max-height: 220px;
    overflow-y: auto;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 12px;
    background: var(--pui-bg-elevated, #fff);
    box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.16));
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 9px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--pui-text, #1c2534);
    cursor: pointer;
    transition: background-color 0.12s ease;

    &.is-active {
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
      color: var(--pui-brand, #0e80eb);
    }

    &.is-disabled {
      color: var(--pui-text-muted, #8b96a6);
      cursor: not-allowed;
      background: transparent;
    }
  }

  &__avatar {
    flex: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12));

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    flex: none;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__empty {
    padding: 16px 10px;
    text-align: center;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }
}

.pui-mentions-fade-enter-active,
.pui-mentions-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.pui-mentions-fade-enter-from,
.pui-mentions-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
