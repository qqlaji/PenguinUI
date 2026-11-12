<template>
  <div
    ref="rootRef"
    :class="[
      'pui-autocomplete',
      `pui-autocomplete--${size}`,
      customClass,
      { 'is-open': visible, 'is-disabled': disabled, 'is-focus': focused }
    ]"
    @click="focusInput"
  >
    <div class="pui-autocomplete__control">
      <i v-if="prefixIcon" :class="['iconfont', prefixIcon]" class="pui-autocomplete__prefix" aria-hidden="true"></i>

      <input
        ref="inputRef"
        class="pui-autocomplete__input"
        type="text"
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="visible"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength || undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @click="onInputClick"
        @keydown="onKeydown"
        @compositionstart="composing = true"
        @compositionend="onCompositionEnd"
      />

      <span v-if="loading" class="pui-autocomplete__spinner" aria-hidden="true"></span>
      <i
        v-else-if="clearable && !disabled && String(modelValue) !== ''"
        class="iconfont t-icon-close pui-autocomplete__clear"
        role="button"
        aria-label="清空"
        @mousedown.prevent
        @click.stop="clear"
      ></i>
    </div>

    <teleport to="body">
      <transition name="pui-autocomplete-fade">
        <div
          v-if="visible"
          ref="panelRef"
          class="pui-autocomplete__panel"
          :style="panelStyle"
          role="listbox"
          @mouseenter="hoverPanel = true"
          @mouseleave="hoverPanel = false"
        >
          <ul v-if="filtered.length" class="pui-autocomplete__list">
            <li
              v-for="(opt, i) in filtered"
              :key="`${opt.value}-${i}`"
              :class="[
                'pui-autocomplete__option',
                { 'is-active': i === activeIndex, 'is-disabled': opt.disabled }
              ]"
              role="option"
              :aria-selected="i === activeIndex"
              @mousedown.prevent="pick(opt)"
              @mouseenter="activeIndex = i"
            >
              <i v-if="opt.icon" :class="['iconfont', opt.icon]" class="pui-autocomplete__option-icon"></i>
              <span class="pui-autocomplete__label" v-html="highlight(opt.label)"></span>
              <span v-if="opt.description" class="pui-autocomplete__desc">{{ opt.description }}</span>
            </li>
          </ul>

          <div v-else class="pui-autocomplete__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </div>

          <div v-if="$slots.footer" class="pui-autocomplete__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'tAutoComplete'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  /** 选项：字符串数组，或 { value, label, description, icon, disabled } */
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'default' }, // large | default | small
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  prefixIcon: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无匹配结果' },
  /** 下拉最大高度 */
  maxHeight: { type: [Number, String], default: 260 },
  /** 输入多少个字符后开始联想 */
  minChars: { type: Number, default: 0 },
  /** 聚焦即展示全部选项 */
  triggerOnFocus: { type: Boolean, default: true },
  /** 是否在本地按关键词过滤（远程搜索时置为 false） */
  filterable: { type: Boolean, default: true },
  /** 自定义过滤函数 (query, option) => boolean */
  filterMethod: { type: Function, default: null },
  /** 是否高亮匹配片段 */
  highlight: { type: Boolean, default: true },
  placement: { type: String, default: 'bottom-start' }, // bottom-start | bottom | bottom-end
  maxlength: { type: [Number, String], default: '' },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'select', 'search', 'change', 'clear', 'focus', 'blur']);

const rootRef = ref(null);
const inputRef = ref(null);
const panelRef = ref(null);
const visible = ref(false);
const focused = ref(false);
const composing = ref(false);
const hoverPanel = ref(false);
const query = ref(String(props.modelValue ?? ''));
const activeIndex = ref(-1);
const pos = ref({ top: 0, left: 0, width: 0 });

const normalized = computed(() =>
  (props.options || []).map((opt) => {
    if (opt !== null && typeof opt === 'object') {
      return {
        label: opt.label !== undefined ? String(opt.label) : String(opt.value ?? ''),
        value: opt.value !== undefined ? opt.value : opt.label,
        description: opt.description || '',
        icon: opt.icon || '',
        disabled: !!opt.disabled
      };
    }
    return { label: String(opt), value: opt, description: '', icon: '', disabled: false };
  })
);

const filtered = computed(() => {
  const list = normalized.value;
  const q = query.value.trim();
  if (!props.filterable) return list;
  if (!q) return list;
  if (typeof props.filterMethod === 'function') {
    return list.filter((opt) => props.filterMethod(q, opt));
  }
  const lower = q.toLowerCase();
  return list.filter(
    (opt) =>
      opt.label.toLowerCase().includes(lower) ||
      String(opt.value).toLowerCase().includes(lower)
  );
});

const toPx = (v) => {
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const panelStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
  minWidth: `${pos.value.width}px`,
  maxHeight: toPx(props.maxHeight)
}));

/* ---------------- 高亮 ---------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlight(label) {
  const safe = escapeHtml(label);
  const q = query.value.trim();
  if (!props.highlight || !q) return safe;
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return safe;
  const before = escapeHtml(label.slice(0, idx));
  const hit = escapeHtml(label.slice(idx, idx + q.length));
  const after = escapeHtml(label.slice(idx + q.length));
  return `${before}<em class="pui-autocomplete__hit">${hit}</em>${after}`;
}

/* ---------------- 定位 ---------------- */
const GAP = 6;

function updatePosition() {
  const el = rootRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const panel = panelRef.value;
  const pw = panel ? panel.offsetWidth : r.width;
  const ph = panel ? panel.offsetHeight : 0;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = r.left;
  if (props.placement === 'bottom') left = r.left + r.width / 2 - pw / 2;
  if (props.placement === 'bottom-end') left = r.right - pw;
  const margin = 8;
  left = Math.max(margin, Math.min(left, vw - pw - margin));

  let top = r.bottom + GAP;
  if (ph && top + ph > vh - margin && r.top - GAP - ph > margin) {
    top = r.top - GAP - ph;
  }

  pos.value = { top, left, width: r.width };
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
function onGlobalChange() {
  if (visible.value) updatePosition();
}
function onDocDown(e) {
  const t = e.target;
  if (rootRef.value && rootRef.value.contains(t)) return;
  if (panelRef.value && panelRef.value.contains(t)) return;
  close();
}

/* ---------------- 开合 ---------------- */
async function open() {
  if (props.disabled || props.readonly || visible.value) return;
  if (query.value.trim().length < props.minChars) return;
  visible.value = true;
  activeIndex.value = -1;
  await nextTick();
  updatePosition();
  bindGlobal();
}

function close() {
  if (!visible.value) return;
  visible.value = false;
  unbindGlobal();
}

/* ---------------- 事件 ---------------- */
function onInput(e) {
  query.value = e.target.value;
  emit('update:modelValue', e.target.value);
  emit('search', e.target.value);
  emit('change', e.target.value);
  if (composing.value) return;
  if (e.target.value.trim().length >= props.minChars) open();
  else close();
  activeIndex.value = -1;
}

function onCompositionEnd(e) {
  composing.value = false;
  query.value = e.target.value;
  if (e.target.value.trim().length >= props.minChars) open();
}

function onFocus(e) {
  focused.value = true;
  emit('focus', e);
  if (props.triggerOnFocus) open();
}

function onInputClick() {
  if (props.disabled || props.readonly) return;
  if (props.triggerOnFocus || query.value.trim().length >= props.minChars) open();
}

function onBlur(e) {
  focused.value = false;
  emit('blur', e);
  window.setTimeout(() => {
    if (!hoverPanel.value) close();
  }, 140);
}

function focusInput() {
  if (props.disabled || props.readonly) return;
  if (inputRef.value) inputRef.value.focus();
}

function pick(opt) {
  if (opt.disabled) return;
  // 输入框语义：把 label 写入绑定值，完整选项通过 select 事件抛出
  query.value = opt.label;
  emit('update:modelValue', opt.label);
  emit('select', opt);
  emit('change', opt.label);
  close();
  if (inputRef.value) inputRef.value.focus();
}

function clear() {
  query.value = '';
  emit('update:modelValue', '');
  emit('clear');
  emit('change', '');
  close();
}

/* ---------------- 键盘 ---------------- */
function onKeydown(e) {
  const list = filtered.value;
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (!visible.value) {
        open();
        return;
      }
      if (!list.length) return;
      activeIndex.value = activeIndex.value >= list.length - 1 ? 0 : activeIndex.value + 1;
      scrollActiveIntoView();
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (!visible.value) {
        open();
        return;
      }
      if (!list.length) return;
      activeIndex.value = activeIndex.value <= 0 ? list.length - 1 : activeIndex.value - 1;
      scrollActiveIntoView();
      break;
    case 'Enter':
      if (visible.value && activeIndex.value >= 0 && list[activeIndex.value]) {
        e.preventDefault();
        pick(list[activeIndex.value]);
      }
      break;
    case 'Escape':
      if (visible.value) {
        e.preventDefault();
        close();
      }
      break;
    case 'Tab':
      close();
      break;
    default:
      break;
  }
}

function scrollActiveIntoView() {
  nextTick(() => {
    const panel = panelRef.value;
    if (!panel) return;
    const el = panel.querySelector('.pui-autocomplete__option.is-active');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  });
}

watch(
  () => props.modelValue,
  (val) => {
    if (String(val ?? '') !== query.value) query.value = String(val ?? '');
  }
);

watch(filtered, () => {
  if (visible.value) {
    activeIndex.value = -1;
    nextTick(updatePosition);
  }
});

onBeforeUnmount(() => {
  unbindGlobal();
});

defineExpose({ focus: focusInput, blur: () => inputRef.value && inputRef.value.blur(), open, close });
</script>

<style scoped lang="scss">
.pui-autocomplete {
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 180px;
  vertical-align: middle;

  &__control {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 10px;
    background: var(--pui-bg-elevated, #fff);
    transition: border-color 0.18s ease, box-shadow 0.18s ease;

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
    }
  }

  &.is-focus &__control {
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  }

  &__prefix {
    flex: none;
    font-size: 14px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--pui-text, #1c2534);

    &::placeholder {
      color: var(--pui-text-muted, #8b96a6);
    }
  }

  &__clear {
    flex: none;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
      color: var(--pui-text, #1c2534);
    }
  }

  &__spinner {
    flex: none;
    width: 13px;
    height: 13px;
    border: 2px solid var(--pui-border, #e7ecf3);
    border-top-color: var(--pui-brand, #0e80eb);
    border-radius: 50%;
    animation: pui-autocomplete-spin 0.8s linear infinite;
  }

  /* ---------- 面板 ---------- */
  &__panel {
    position: fixed;
    z-index: 3000;
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
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
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

  &__option-icon {
    flex: none;
    font-size: 14px;
    opacity: 0.8;
  }

  &__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :deep(.pui-autocomplete__hit) {
      font-style: normal;
      font-weight: 600;
      color: var(--pui-brand, #0e80eb);
    }
  }

  &__desc {
    flex: none;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__empty {
    padding: 18px 12px;
    text-align: center;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__footer {
    margin-top: 4px;
    padding: 8px 10px 4px;
    border-top: 1px solid var(--pui-border, #eef2f7);
  }

  /* ---------- 尺寸 ---------- */
  &--small &__control { height: 30px; border-radius: 9px; }
  &--small &__input { font-size: 13px; }
  &--large &__control { height: 42px; border-radius: 11px; }
  &--large &__input { font-size: 15px; }

  &.is-disabled &__control {
    background: var(--pui-bg-soft, #f7f9fc);
    cursor: not-allowed;
    opacity: 0.72;

    &:hover { border-color: var(--pui-border-strong, #d8e0ea); }
  }
  &.is-disabled &__input { cursor: not-allowed; }
}

@keyframes pui-autocomplete-spin {
  to { transform: rotate(360deg); }
}

.pui-autocomplete-fade-enter-active,
.pui-autocomplete-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.pui-autocomplete-fade-enter-from,
.pui-autocomplete-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
