<template>
  <div
    :class="['pui-otp', `pui-otp--${size}`, customClass, { 'is-disabled': disabled, 'is-error': status === 'error' }]"
    @paste="onPaste"
  >
    <template v-for="(cell, i) in cells" :key="i">
      <span v-if="showSeparator(i)" class="pui-otp__separator">{{ separatorText }}</span>
      <input
        :ref="(el) => setInputRef(el, i)"
        class="pui-otp__input"
        :type="inputType"
        :value="cell"
        :disabled="disabled"
        :maxlength="1"
        :aria-label="`第 ${i + 1} 位`"
        inputmode="numeric"
        autocomplete="one-time-code"
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        @focus="onFocus(i, $event)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'tInputOtp'
};
</script>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  /** 验证码位数 */
  length: { type: Number, default: 6 },
  /** 分隔符，如 '-'；也可传数字表示每隔几位分隔 */
  separator: { type: [String, Number], default: '' },
  /** 是否以圆点遮蔽 */
  mask: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'default' }, // small | default | large
  status: { type: String, default: '' }, // '' | error | success
  /** 只允许数字 */
  numberOnly: { type: Boolean, default: true },
  autofocus: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'change', 'complete']);

const inputs = ref([]);
const setInputRef = (el, i) => {
  if (el) inputs.value[i] = el;
};

const chars = computed(() => {
  const s = String(props.modelValue || '');
  return Array.from({ length: props.length }, (_, i) => s[i] || '');
});

const cells = computed(() => (props.mask ? chars.value.map((c) => (c ? '•' : '')) : chars.value));

const inputType = computed(() => (props.mask ? 'password' : 'text'));

const separatorText = computed(() => (typeof props.separator === 'string' ? props.separator : '-'));
const separatorEvery = computed(() => (typeof props.separator === 'number' ? props.separator : 0));
const showSeparator = (i) => separatorEvery.value > 0 && i > 0 && i % separatorEvery.value === 0;

const commit = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
  if (value.length === props.length) emit('complete', value);
};

const focusAt = (i) => {
  const el = inputs.value[i];
  if (el) {
    el.focus();
    el.select && el.select();
  }
};

const writeAt = (index, char) => {
  const arr = chars.value.slice();
  arr[index] = char;
  const next = arr.join('').slice(0, props.length);
  commit(next);
};

const onInput = (i, e) => {
  const raw = e.target.value || '';
  const ch = raw.slice(-1);
  if (props.numberOnly && ch && !/\d/.test(ch)) {
    e.target.value = chars.value[i] || '';
    return;
  }
  if (!ch) {
    writeAt(i, '');
    return;
  }
  writeAt(i, ch);
  nextTick(() => {
    if (i < props.length - 1) focusAt(i + 1);
  });
};

const onKeydown = (i, e) => {
  if (e.key === 'Backspace') {
    if (chars.value[i]) {
      e.preventDefault();
      writeAt(i, '');
      return;
    }
    if (i > 0) {
      e.preventDefault();
      const arr = chars.value.slice();
      arr[i - 1] = '';
      commit(arr.join(''));
      nextTick(() => focusAt(i - 1));
    }
  } else if (e.key === 'ArrowLeft' && i > 0) {
    e.preventDefault();
    focusAt(i - 1);
  } else if (e.key === 'ArrowRight' && i < props.length - 1) {
    e.preventDefault();
    focusAt(i + 1);
  } else if (e.key === 'Delete') {
    e.preventDefault();
    writeAt(i, '');
  }
};

const onFocus = (i, e) => {
  e.target.select && e.target.select();
};

const onPaste = (e) => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text') || '';
  const cleaned = props.numberOnly ? text.replace(/\D/g, '') : text;
  if (!cleaned) return;
  const next = cleaned.slice(0, props.length);
  commit(next);
  nextTick(() => focusAt(Math.min(next.length, props.length - 1)));
};

watch(
  () => props.autofocus,
  (v) => {
    if (v) nextTick(() => focusAt(0));
  }
);

onMounted(() => {
  if (props.autofocus) focusAt(0);
});

defineExpose({ focus: () => focusAt(0), clear: () => commit('') });
</script>

<style lang="scss" scoped>
.pui-otp {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.pui-otp__input {
  width: 40px;
  height: 44px;
  box-sizing: border-box;
  padding: 0;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text-1, #1f2d3d);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;

  &:focus {
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.16));
  }
  &:disabled {
    background: var(--pui-bg-soft, #f4f6fa);
    color: var(--pui-text-4, #a8b3c2);
    cursor: not-allowed;
  }
}

.pui-otp__separator {
  font-size: 16px;
  color: var(--pui-text-3, #8b97a8);
  user-select: none;
}

/* 尺寸 */
.pui-otp--small .pui-otp__input { width: 32px; height: 36px; font-size: 15px; border-radius: 8px; }
.pui-otp--small { gap: 6px; }
.pui-otp--large .pui-otp__input { width: 48px; height: 52px; font-size: 22px; border-radius: 12px; }
.pui-otp--large { gap: 10px; }

/* 状态 */
.pui-otp.is-error .pui-otp__input {
  border-color: var(--pui-danger, #ec3437);
  &:focus { box-shadow: 0 0 0 3px rgba(236, 52, 55, 0.16); }
}
.pui-otp.is-disabled { opacity: 0.7; }
</style>
