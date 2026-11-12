<template>
  <div
    class="pui-input-number"
    :class="[
      `pui-input-number--${size}`,
      {
        'is-disabled': disabled,
        'is-focused': focused,
        'is-controls': controls,
        'is-out-of-range': outOfRange
      }
    ]"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <button
      v-if="controls"
      type="button"
      class="pui-input-number__step pui-input-number__step--down"
      :disabled="disabled || reachMin"
      aria-label="减少"
      @click="decrease"
    >
      <i class="t-icon-minus"></i>
    </button>
    <input
      ref="inputEl"
      class="pui-input-number__input"
      type="text"
      inputmode="decimal"
      :value="displayValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      role="spinbutton"
      :aria-valuenow="modelValue"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.up.prevent="increase"
      @keydown.down.prevent="decrease"
    />
    <button
      v-if="controls"
      type="button"
      class="pui-input-number__step pui-input-number__step--up"
      :disabled="disabled || reachMax"
      aria-label="增加"
      @click="increase"
    >
      <i class="t-icon-add-bold"></i>
    </button>
  </div>
</template>

<script>
export default { name: 'tInputNumber' };
</script>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: { type: Number, default: undefined },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  precision: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false },
  controls: { type: Boolean, default: true },
  size: { type: String, default: 'default' },
  placeholder: { type: String, default: '请输入数字' },
  name: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const inputEl = ref(null);
const focused = ref(false);
const hovered = ref(false);

const reachMin = computed(() => props.modelValue !== undefined && props.modelValue <= props.min);
const reachMax = computed(() => props.modelValue !== undefined && props.modelValue >= props.max);
const outOfRange = computed(
  () => props.modelValue !== undefined && (props.modelValue < props.min || props.modelValue > props.max)
);
const displayValue = computed(() => (props.modelValue === undefined || props.modelValue === null ? '' : props.modelValue));

const resolvePrecision = () => {
  if (props.precision !== undefined) return props.precision;
  const decimals = String(props.step).split('.')[1];
  return decimals ? decimals.length : 0;
};

const clamp = (val) => {
  if (Number.isNaN(val)) return props.modelValue;
  const p = resolvePrecision();
  const fixed = Number(val.toFixed(p));
  if (fixed < props.min) return props.min;
  if (fixed > props.max) return props.max;
  return fixed;
};

const commit = (val) => {
  if (val === props.modelValue) return;
  emit('update:modelValue', val);
  emit('change', val);
};

const baseValue = () => {
  if (props.modelValue !== undefined && props.modelValue !== null) return props.modelValue;
  // 空值时从 0 起算，再由 clamp 收敛到 [min, max]
  return 0;
};
const increase = () => {
  if (props.disabled) return;
  commit(clamp(baseValue() + props.step));
};
const decrease = () => {
  if (props.disabled) return;
  commit(clamp(baseValue() - props.step));
};

const onInput = (e) => {
  const raw = e.target.value.trim();
  if (raw === '' || raw === '-') {
    emit('update:modelValue', undefined);
    return;
  }
  const num = Number(raw);
  if (Number.isNaN(num)) {
    e.target.value = displayValue.value;
    return;
  }
  const fixed = clamp(num);
  emit('update:modelValue', fixed);
  emit('change', fixed);
};

const onFocus = (e) => {
  focused.value = true;
  emit('focus', e);
};
const onBlur = (e) => {
  focused.value = false;
  // 失焦时回写规范化后的值（去除多余 0 / 越界修正）
  if (props.modelValue !== undefined) {
    const fixed = clamp(props.modelValue);
    if (fixed !== props.modelValue) commit(fixed);
    if (inputEl.value) inputEl.value.value = fixed === undefined ? '' : fixed;
  }
  emit('blur', e);
};
</script>

<style scoped lang="scss">
.pui-input-number {
  display: inline-flex;
  align-items: stretch;
  width: 160px;
  height: 36px;
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
  overflow: hidden;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &.is-focused {
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  }
  &.is-out-of-range {
    border-color: var(--pui-danger, #ec3437);
  }
  &.is-disabled {
    opacity: 0.55;
    cursor: not-allowed;
    background: var(--pui-bg-soft, #f7f9fc);
  }
}

.pui-input-number__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-size: 14px;
  color: var(--pui-text, #1c2534);
  font-variant-numeric: tabular-nums;
  &::placeholder { color: var(--pui-text-muted, #8b96a6); }
}

.pui-input-number__step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  border: none;
  background: transparent;
  color: var(--pui-text-sub, #5b6879);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  i { font-size: 14px; }

  &:hover:not(:disabled) { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); color: var(--pui-brand, #0e80eb); }
  &:disabled { color: var(--pui-text-muted, #8b96a6); cursor: not-allowed; opacity: 0.6; }

  &--down { border-right: 1px solid var(--pui-border, #e7ecf3); }
  &--up { border-left: 1px solid var(--pui-border, #e7ecf3); }
}

.pui-input-number--small { height: 30px; }
.pui-input-number--large { height: 42px; }
.pui-input-number--small .pui-input-number__step { width: 28px; }
.pui-input-number--large .pui-input-number__step { width: 40px; }

// 无控制按钮时两侧内边距更舒服
.pui-input-number:not(.is-controls) .pui-input-number__input { text-align: left; padding: 0 12px; }

@media (prefers-reduced-motion: reduce) {
  .pui-input-number, .pui-input-number__step { transition: none; }
}
</style>
