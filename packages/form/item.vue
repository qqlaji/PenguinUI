<template>
  <div
    class="pui-form-item"
    :class="[
      `pui-form-item--${labelPosition}`,
      { 'is-error': error, 'is-required': required, 'is-inline': inline }
    ]"
  >
    <label v-if="label" class="pui-form-item__label" :style="labelStyle">
      <span class="pui-form-item__star" v-if="required">*</span>{{ label }}
    </label>
    <div class="pui-form-item__content" @focusout="onBlur" @input="onInput">
      <slot />
      <transition name="pui-form-item-err">
        <div v-if="showError" class="pui-form-item__error">
          <i class="t-icon-error"></i>{{ error }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default { name: 'tFormItem' };
</script>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  prop: { type: String, default: '' },
  rules: { type: Array, default: () => [] },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' }, // 手动错误（优先级最高）
});

const ctx = inject('puiForm', null);
const labelPosition = computed(() => props.labelPositionOverride || (ctx ? ctx.labelPosition : 'right'));
const inline = computed(() => ctx && ctx.inline);
const labelWidth = computed(() => {
  const w = ctx && ctx.labelWidth;
  if (!w) return 'auto';
  if (typeof w === 'number') return `${w}px`;
  const s = String(w).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
});
const labelStyle = computed(() => (labelPosition.value === 'top' ? {} : { width: labelWidth.value }));

const modelValue = computed(() => (ctx && ctx.model && props.prop ? ctx.model[props.prop] : undefined));
const formRules = computed(() => (ctx && ctx.rules && props.prop ? ctx.rules[props.prop] || [] : []));
const currentRules = computed(() => {
  if (props.rules && props.rules.length) return props.rules;
  if (formRules.value.length) return formRules.value;
  if (props.required) return [{ required: true, message: `${props.label || '该项'}为必填项` }];
  return [];
});
const required = computed(
  () => props.required || currentRules.value.some((r) => r.required)
);

const error = ref('');
const touched = ref(false);
const showError = computed(() => ctx && ctx.showMessage !== false && !!error.value);

async function validate(trigger) {
  if (props.error) {
    error.value = props.error;
    return { valid: false, errors: [props.error] };
  }
  const rulesToRun = trigger
    ? currentRules.value.filter((r) => !r.trigger || r.trigger === trigger)
    : currentRules.value;
  if (!rulesToRun.length) {
    error.value = '';
    return { valid: true, errors: [] };
  }
  const errs = await ctx.runRules(modelValue.value, rulesToRun, ctx.model);
  error.value = errs[0] || '';
  touched.value = true;
  return { valid: errs.length === 0, errors: errs };
}
function clearValidate() {
  error.value = '';
  touched.value = false;
}

const onBlur = () => { if (touched.value || currentRules.value.some((r) => !r.trigger || r.trigger === 'blur')) validate('blur'); };
const onInput = () => { if (touched.value || currentRules.value.some((r) => !r.trigger || r.trigger === 'change')) validate('change'); };

onMounted(() => {
  if (ctx && props.prop) {
    ctx.registerField(props.prop);
    ctx.bindField(props.prop, { validate, clearValidate });
  }
});
onBeforeUnmount(() => {
  if (ctx && props.prop) ctx.removeField(props.prop);
});

defineExpose({ validate, clearValidate, prop: props.prop });
</script>

<style scoped lang="scss">
.pui-form-item {
  display: flex;
  margin-bottom: 20px;

  &--top { flex-direction: column; }
  &--left .pui-form-item__label { text-align: left; }
  &.is-inline { margin-bottom: 0; align-items: center; }

  &__label {
    flex: none;
    padding-right: 12px;
    line-height: 36px;
    font-size: 14px;
    color: var(--pui-text-sub, #5b6879);
    text-align: right;
    box-sizing: border-box;
  }
  &--top .pui-form-item__label { text-align: left; line-height: 1.5; margin-bottom: 6px; }

  &__star { color: var(--pui-danger, #ec3437); margin-right: 3px; }

  &__content {
    position: relative;
    flex: 1;
    min-width: 0;
    line-height: 36px;
  }
  &__content :deep(.pui-input-number),
  &__content :deep(input),
  &__content :deep(.t-input) { line-height: normal; }

  &__error {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 2px;
    font-size: 12px;
    color: var(--pui-danger, #ec3437);
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 4px;
    i { font-size: 12px; }
  }

  &.is-error :deep(.pui-input-number),
  &.is-error :deep(.t-input),
  &.is-error :deep(input),
  &.is-error :deep(textarea) {
    border-color: var(--pui-danger, #ec3437) !important;
  }
}

.pui-form-item-err-enter-active,
.pui-form-item-err-leave-active { transition: all 0.18s ease; }
.pui-form-item-err-enter-from,
.pui-form-item-err-leave-to { opacity: 0; transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
  .pui-form-item-err-enter-active, .pui-form-item-err-leave-active { transition: none; }
}
</style>
