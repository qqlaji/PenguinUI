<template>
  <div
    ref="rootRef"
    class="pui-segmented"
    :class="[`pui-segmented--${size}`, { 'is-block': block, 'is-disabled': disabled }]"
    role="tablist"
    :aria-disabled="disabled"
  >
    <span
      class="pui-segmented__thumb"
      :style="thumbStyle"
      aria-hidden="true"
    ></span>

    <button
      v-for="(opt, i) in normalized"
      :key="opt.value"
      :ref="(el) => setItemRef(el, i)"
      type="button"
      class="pui-segmented__item"
      :class="{ 'is-active': opt.value === modelValue }"
      role="tab"
      :aria-selected="opt.value === modelValue"
      :disabled="disabled || opt.disabled"
      @click="select(opt, i)"
    >
      <i v-if="opt.icon" :class="opt.icon" class="pui-segmented__icon"></i>
      <span v-if="opt.label !== ''" class="pui-segmented__label">{{ opt.label }}</span>
    </button>
  </div>
</template>

<script>
export default { name: 'tSegmented' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** 绑定值 */
  modelValue: { type: [String, Number, Boolean], default: '' },
  /** 选项：字符串 / 数字，或 { label, value, icon, disabled } */
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'default' },
  /** 撑满父级宽度 */
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'change']);

const normalized = computed(() =>
  (props.options || []).map((opt) => {
    if (opt !== null && typeof opt === 'object') {
      return {
        label: opt.label !== undefined ? opt.label : opt.value,
        value: opt.value !== undefined ? opt.value : opt.label,
        icon: opt.icon || '',
        disabled: !!opt.disabled
      };
    }
    return { label: opt, value: opt, icon: '', disabled: false };
  })
);

const activeIndex = computed(() => normalized.value.findIndex((o) => o.value === props.modelValue));

/* ---------- 滑块位置：按真实 DOM 测量，兼容不等宽选项 ---------- */
const rootRef = ref(null);
const itemEls = [];
const thumbStyle = ref({ width: '0px', transform: 'translateX(0)', opacity: 0 });

function setItemRef(el, i) {
  if (el) itemEls[i] = el;
}

function updateThumb() {
  const root = rootRef.value;
  const el = itemEls[activeIndex.value];
  if (!root || !el) {
    thumbStyle.value = { ...thumbStyle.value, opacity: 0 };
    return;
  }
  const cRect = root.getBoundingClientRect();
  const iRect = el.getBoundingClientRect();
  const pad = parseFloat(getComputedStyle(root).paddingLeft) || 4;
  thumbStyle.value = {
    width: `${iRect.width}px`,
    transform: `translateX(${iRect.left - cRect.left - pad}px)`,
    opacity: 1
  };
}

let ro = null;

onMounted(async () => {
  await nextTick();
  updateThumb();
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateThumb());
    if (rootRef.value) ro.observe(rootRef.value);
    itemEls.forEach((el) => el && ro.observe(el));
  }
  window.addEventListener('resize', updateThumb);
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  window.removeEventListener('resize', updateThumb);
});

watch(
  () => [props.modelValue, props.options, props.size],
  async () => {
    await nextTick();
    updateThumb();
  },
  { deep: true }
);

function select(opt, i) {
  if (props.disabled || opt.disabled) return;
  if (opt.value === props.modelValue) return;
  emit('update:modelValue', opt.value);
  emit('change', opt.value, i);
}

defineExpose({ select });
</script>

<style scoped lang="scss">
.pui-segmented {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 10px;
  background: var(--pui-fill-2, #f2f3f5);
  user-select: none;

  &.is-block {
    display: flex;
    width: 100%;
    .pui-segmented__item { flex: 1; }
  }

  &__thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    bottom: 4px;
    border-radius: 8px;
    background: var(--pui-bg, #fff);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06);
    transition: transform 0.24s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
    pointer-events: none;
  }

  &__item {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
    height: 30px;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--pui-text-2, #4e5969);
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s ease;
    outline: none;

    &:hover:not(:disabled):not(.is-active) {
      color: var(--pui-text-1, #1f2329);
    }
    &:focus-visible {
      outline: 2px solid var(--pui-primary, #0e80eb);
      outline-offset: -2px;
    }
    &:disabled {
      color: var(--pui-text-4, #c0c4cc);
      cursor: not-allowed;
    }

    &.is-active {
      color: var(--pui-text-1, #1f2329);
      font-weight: 600;
    }
  }

  &__icon {
    font-size: 14px;
  }

  /* ---------- 尺寸 ---------- */
  &--small {
    padding: 3px;
    border-radius: 9px;
    .pui-segmented__thumb { top: 3px; left: 3px; bottom: 3px; border-radius: 7px; }
    .pui-segmented__item { height: 24px; padding: 0 10px; font-size: 12px; border-radius: 7px; }
    .pui-segmented__icon { font-size: 12px; }
  }

  &--large {
    padding: 5px;
    border-radius: 12px;
    .pui-segmented__thumb { top: 5px; left: 5px; bottom: 5px; border-radius: 9px; }
    .pui-segmented__item { height: 36px; padding: 0 18px; font-size: 14px; border-radius: 9px; }
    .pui-segmented__icon { font-size: 16px; }
  }

  /* ---------- 禁用 ---------- */
  &.is-disabled {
    opacity: 0.6;
    .pui-segmented__item { cursor: not-allowed; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-segmented__thumb,
  .pui-segmented__item { transition: none; }
}
</style>
