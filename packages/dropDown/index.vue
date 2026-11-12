<template>
  <div
    ref="triggerRef"
    :class="['pui-dropdown', `pui-dropdown--${size}`, customClass, { 'is-open': visible, 'is-disabled': disabled }]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onTriggerClick"
    @keydown="onKeydown"
  >
    <button
      ref="btnRef"
      type="button"
      class="pui-dropdown__trigger"
      :disabled="disabled"
      :aria-expanded="visible"
      aria-haspopup="menu"
    >
      <slot name="Img">
        <i v-if="icon" :class="['iconfont', icon]" class="pui-dropdown__leading" aria-hidden="true"></i>
      </slot>
      <span v-if="title || $slots.default" class="pui-dropdown__title">
        <slot>{{ title }}</slot>
      </span>
      <i class="iconfont t-icon-arrow-down pui-dropdown__arrow" aria-hidden="true"></i>
    </button>

    <teleport to="body">
      <transition name="pui-dropdown-fade">
        <div
          v-if="visible"
          ref="panelRef"
          class="pui-dropdown__panel"
          :style="panelStyle"
          role="menu"
        >
          <ul class="pui-dropdown__list">
            <template v-for="(item, index) in normalized" :key="index">
              <li v-if="item.divided" class="pui-dropdown__divider" role="separator"></li>
              <li
                :class="[
                  'pui-dropdown__item',
                  {
                    'is-disabled': item.disabled,
                    'is-danger': item.danger,
                    'is-active': item.value === modelValue
                  }
                ]"
                role="menuitem"
                :tabindex="item.disabled ? -1 : 0"
                @click.stop="pick(item, index)"
              >
                <i
                  v-if="item.icon"
                  :class="['iconfont', item.icon]"
                  class="pui-dropdown__item-icon"
                  aria-hidden="true"
                ></i>
                <span class="pui-dropdown__item-label">{{ item.label }}</span>
              </li>
            </template>
            <li v-if="!normalized.length" class="pui-dropdown__empty">暂无数据</li>
          </ul>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'tDropdown'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  trigger: { type: String, default: 'hover' }, // hover | click
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'default' }, // default | small | mini
  customClass: { type: String, default: '' },
  icon: { type: String, default: '' },
  placement: { type: String, default: 'bottom-start' }, // bottom-start | bottom | bottom-end
  disabled: { type: Boolean, default: false },
  hideOnClick: { type: Boolean, default: true },
  maxHeight: { type: [Number, String], default: 260 },
  modelValue: { type: [String, Number], default: undefined }
});

const emit = defineEmits(['change', 'visible-change', 'update:modelValue']);

const triggerRef = ref(null);
const btnRef = ref(null);
const panelRef = ref(null);
const visible = ref(false);
const pos = ref({ top: 0, left: 0, minWidth: 0 });

const normalized = computed(() =>
  (props.options || []).map((item) => {
    if (item && typeof item === 'object') return item;
    return { label: String(item), value: item };
  })
);

const toPx = (v) => (typeof v === 'number' || /^\d+(\.\d+)?$/.test(String(v)) ? `${parseFloat(v)}px` : v);

const panelStyle = computed(() => ({
  top: `${pos.value.top}px`,
  left: `${pos.value.left}px`,
  minWidth: `${pos.value.minWidth}px`,
  maxHeight: toPx(props.maxHeight)
}));

/* ---------------- 定位 ---------------- */
const PANEL_GAP = 8;

const updatePosition = () => {
  const btn = btnRef.value;
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const panel = panelRef.value;
  const pw = panel ? panel.offsetWidth : r.width;
  const ph = panel ? panel.offsetHeight : 0;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = r.left;
  if (props.placement === 'bottom') left = r.left + r.width / 2 - pw / 2;
  if (props.placement === 'bottom-end') left = r.right - pw;

  // 视口水平钳制
  const margin = 8;
  left = Math.max(margin, Math.min(left, vw - pw - margin));

  // 下方空间不足则翻到上方
  let top = r.bottom + PANEL_GAP;
  if (ph && top + ph > vh - margin && r.top - PANEL_GAP - ph > margin) {
    top = r.top - PANEL_GAP - ph;
  }

  pos.value = { top, left, minWidth: r.width };
};

const onScroll = () => { if (visible.value) updatePosition(); };
const onResize = () => { if (visible.value) updatePosition(); };

const bindGlobal = () => {
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);
  document.addEventListener('click', onDocumentClick, true);
};
const unbindGlobal = () => {
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('click', onDocumentClick, true);
};

function onDocumentClick(e) {
  const t = e.target;
  if (triggerRef.value && triggerRef.value.contains(t)) return;
  if (panelRef.value && panelRef.value.contains(t)) return;
  close();
}

/* ---------------- 开合 ---------------- */
const open = async () => {
  if (props.disabled || visible.value) return;
  visible.value = true;
  await nextTick();
  updatePosition();
  bindGlobal();
  emit('visible-change', true);
};
const close = () => {
  if (!visible.value) return;
  visible.value = false;
  unbindGlobal();
  emit('visible-change', false);
};
const toggle = () => (visible.value ? close() : open());

const onEnter = () => { if (props.trigger === 'hover') open(); };
const onLeave = () => { if (props.trigger === 'hover') close(); };
const onTriggerClick = () => { if (props.trigger === 'click') toggle(); };

/* ---------------- 选择 ---------------- */
const pick = (item, index) => {
  if (item.disabled) return;
  emit('update:modelValue', item.value ?? item.label);
  emit('change', item, index);
  if (props.hideOnClick) close();
};

/* ---------------- 键盘 ---------------- */
const focusables = () => {
  if (!panelRef.value) return [];
  return [...panelRef.value.querySelectorAll('.pui-dropdown__item:not(.is-disabled)')];
};

const onKeydown = (e) => {
  if (props.disabled) return;
  if (e.key === 'Escape') { close(); return; }
  if (!visible.value && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    open();
    nextTick(() => focusables()[0]?.focus());
    return;
  }
  if (!visible.value) return;
  const list = focusables();
  const idx = list.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    list[Math.min(idx + 1, list.length - 1)]?.focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    list[Math.max(idx - 1, 0)]?.focus();
  } else if (e.key === 'Tab') {
    close();
  }
};

watch(() => props.disabled, (v) => { if (v) close(); });
onBeforeUnmount(unbindGlobal);

defineExpose({ open, close, toggle });
</script>

<style lang="scss" scoped>
.pui-dropdown {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  vertical-align: middle;
}

/* ---------- 触发器 ---------- */
.pui-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 14px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text-1, #1f2d3d);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  user-select: none;

  &:hover:not(:disabled) {
    border-color: var(--pui-brand, #0e80eb);
    color: var(--pui-brand, #0e80eb);
  }
  &:focus-visible {
    outline: none;
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.16));
  }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
}

.pui-dropdown__leading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  font-size: 15px;
  line-height: 1;
}

.pui-dropdown__title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

:slotted(img) {
  display: block;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.pui-dropdown__arrow {
  flex: none;
  font-size: 10px;
  line-height: 1;
  color: var(--pui-text-3, #97a3b4);
  transition: transform 0.22s ease, color 0.18s ease;
}

.pui-dropdown.is-open {
  .pui-dropdown__trigger {
    border-color: var(--pui-brand, #0e80eb);
    color: var(--pui-brand, #0e80eb);
  }
  .pui-dropdown__arrow {
    transform: rotate(180deg);
    color: var(--pui-brand, #0e80eb);
  }
}

/* ---------- 尺寸 ---------- */
.pui-dropdown--small .pui-dropdown__trigger {
  padding: 5px 11px;
  font-size: 13px;
  border-radius: 8px;
}
.pui-dropdown--mini .pui-dropdown__trigger {
  padding: 3px 9px;
  font-size: 12px;
  border-radius: 7px;
  gap: 6px;
}

/* ---------- 浮层 ---------- */
.pui-dropdown__panel {
  position: fixed;
  z-index: 3000;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
  box-shadow: 0 16px 40px rgba(12, 24, 44, 0.14), 0 2px 8px rgba(12, 24, 44, 0.06);
  overflow: auto;
}

.pui-dropdown__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pui-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: center; /* 文本居中 */
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  color: var(--pui-text-2, #4a5866);
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover,
  &:focus-visible {
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.09));
    color: var(--pui-brand, #0e80eb);
  }
  &.is-active {
    color: var(--pui-brand, #0e80eb);
    font-weight: 600;
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.09));
  }
  &.is-disabled {
    color: var(--pui-text-4, #c0c8d3);
    cursor: not-allowed;
    background: transparent;
  }
  &.is-danger {
    color: var(--pui-danger, #ec3437);
    &:hover, &:focus-visible {
      background: rgba(236, 52, 55, 0.09);
      color: var(--pui-danger, #ec3437);
    }
  }
}

.pui-dropdown__item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  font-size: 15px;
  line-height: 1;
}

.pui-dropdown__item-label {
  display: inline-block;
  text-align: center;
}

.pui-dropdown__divider {
  height: 1px;
  margin: 5px 6px;
  background: var(--pui-border, #eef2f7);
  list-style: none;
}

.pui-dropdown__empty {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--pui-text-4, #a8b3c2);
  cursor: default;
}

/* ---------- 三档尺寸的选项 ---------- */
.pui-dropdown--small .pui-dropdown__item { padding: 7px 10px; font-size: 13px; }
.pui-dropdown--mini .pui-dropdown__item { padding: 5px 9px; font-size: 12px; }

/* ---------- 过渡 ---------- */
.pui-dropdown-fade-enter-active,
.pui-dropdown-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
  transform-origin: top center;
}
.pui-dropdown-fade-enter-from,
.pui-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
