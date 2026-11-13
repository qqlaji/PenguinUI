<template>
  <div
    ref="rootRef"
    class="pui-form-item"
    :class="[
      `pui-form-item--${labelPosition}`,
      { 'is-error': !!errorText, 'is-required': required, 'is-inline': inline, 'is-disabled': disabled }
    ]"
  >
    <label
      v-if="label || $slots.label"
      class="pui-form-item__label"
      :style="labelStyle"
      :for="controlId"
    >
      <slot name="label">
        <span v-if="required" class="pui-form-item__star" aria-hidden="true">*</span>
        {{ label }}
      </slot>
    </label>

    <div class="pui-form-item__content" @focusout="onBlur" @input="onInput" @change="onChange">
      <slot />
      <transition name="pui-form-item-err">
        <div v-if="showError" class="pui-form-item__error" role="alert">
          <i class="iconfont t-icon-close-circle" aria-hidden="true"></i>
          <span>{{ errorText }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default { name: 'tFormItem' };
</script>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({  label: { type: String, default: '' },
  /** 对应 model 里的字段名 */
  prop: { type: String, default: '' },
  /** 字段级规则，优先级高于表单 rules[prop] */
  rules: { type: Array, default: () => [] },
  /** 强制必填（自动生成一条 required 规则） */
  required: { type: Boolean, default: false },
  /** 手动错误，优先级最高 */
  error: { type: String, default: '' },
  /** 标签位置覆盖 */
  labelPosition: { type: String, default: '' },
  /** 标签宽度覆盖 */
  labelWidth: { type: [String, Number], default: '' },
  /** 校验触发时机：blur / change / none */
  validateTrigger: { type: [String, Array], default: '' },
  /** 是否显示校验状态图标（预留） */
  showStatus: { type: Boolean, default: true }
});

const emit = defineEmits(['validate']);

const ctx = inject('puiForm', null);
const rootRef = ref(null);

/** 用于 label 的 for 属性，无 prop 时留空 */
const controlId = computed(() => (props.prop ? `pui-field-${props.prop}` : undefined));

/* ---------------- 继承表单级配置 ---------------- */
const labelPosition = computed(
  () => props.labelPosition || (ctx ? ctx.labelPosition : 'right') || 'right'
);
const inline = computed(() => !!(ctx && ctx.inline));
const disabled = computed(() => !!(ctx && ctx.disabled));

const labelWidth = computed(() => {
  const w = props.labelWidth || (ctx && ctx.labelWidth);
  if (!w) return 'auto';
  if (typeof w === 'number') return `${w}px`;
  const s = String(w).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
});

const labelStyle = computed(() =>
  labelPosition.value === 'top' ? {} : { width: labelWidth.value }
);

/* ---------------- 数据与规则 ---------------- */
const modelValue = computed(() =>
  ctx && ctx.model && props.prop ? ctx.model[props.prop] : undefined
);

const formRules = computed(() => {
  if (!ctx || !ctx.rules || !props.prop) return [];
  const r = ctx.rules[props.prop];
  return Array.isArray(r) ? r : [];
});

const currentRules = computed(() => {
  const own = props.rules && props.rules.length ? props.rules : [];
  const inherited = formRules.value;
  const merged = own.length ? own : inherited;
  if (merged.length) return merged;
  if (props.required) {
    return [{ required: true, message: `${props.label || '该项'}为必填项`, trigger: 'blur' }];
  }
  return [];
});

const required = computed(
  () => props.required || currentRules.value.some((r) => r && r.required)
);

/* ---------------- 校验状态 ---------------- */
const errorText = ref('');
const validating = ref(false);
const touched = ref(false);

const showError = computed(
  () => !!(ctx && ctx.showMessage !== false) && !!errorText.value
);

/**
 * 校验本字段
 * @param {string} [trigger] 只跑匹配触发时机的规则
 * @returns {Promise<{valid:boolean, errors:string[]}>}
 */
async function validate(trigger) {
  // 手动 error 优先级最高
  if (props.error) {
    errorText.value = props.error;
    return { valid: false, errors: [props.error] };
  }

  const activeTrigger = trigger || normalizeTrigger(props.validateTrigger);

  let rulesToRun = currentRules.value;
  if (activeTrigger) {
    rulesToRun = rulesToRun.filter((r) => {
      if (!r) return false;
      // 规则没写 trigger 视为所有时机都校验
      if (!r.trigger) return true;
      const list = Array.isArray(r.trigger) ? r.trigger : [r.trigger];
      return list.includes(activeTrigger);
    });
  }

  if (!rulesToRun.length) {
    errorText.value = '';
    return { valid: true, errors: [] };
  }

  validating.value = true;
  let errs = [];
  try {
    errs = await ctx.runRules(modelValue.value, rulesToRun, ctx.model);
  } catch (e) {
    errs = [typeof e === 'string' ? e : e && e.message ? e.message : '校验失败'];
  } finally {
    validating.value = false;
  }

  errorText.value = errs[0] || '';
  touched.value = true;
  emit('validate', { prop: props.prop, valid: errs.length === 0, errors: errs });

  return { valid: errs.length === 0, errors: errs };
}

function clearValidate() {
  errorText.value = '';
  touched.value = false;
}

function normalizeTrigger(t) {
  if (!t) return '';
  return Array.isArray(t) ? t[0] : t;
}

/* ---------------- 触发时机 ---------------- */
function hasTrigger(kind) {
  const t = props.validateTrigger;
  if (t) {
    const list = Array.isArray(t) ? t : [t];
    if (list.includes(kind)) return true;
    // 显式只配了 change 时，blur 也跑一遍更安全
  }
  return currentRules.value.some((r) => {
    if (!r || !r.trigger) return false;
    const list = Array.isArray(r.trigger) ? r.trigger : [r.trigger];
    return list.includes(kind);
  });
}

/** 校验过或规则声明了该时机才触发，避免一进页面就一片红 */
function shouldRun(kind) {
  if (touched.value) return true;
  if (hasTrigger(kind)) return true;
  return false;
}

const onBlur = () => {
  if (shouldRun('blur')) validate('blur');
};

const onInput = () => {
  if (shouldRun('change') || shouldRun('input')) validate('change');
};

const onChange = () => {
  if (shouldRun('change')) validate('change');
};

/* ---------------- 手动 error 变化 ---------------- */
watch(
  () => props.error,
  (v) => {
    errorText.value = v || '';
  },
  { immediate: false }
);

/* ---------------- 注册到表单 ---------------- */
const getElement = () => rootRef.value;

onMounted(() => {
  if (ctx && props.prop) {
    if (ctx.registerField) {
      ctx.registerField(props.prop, { validate, clearValidate, getElement });
    }
    // 兼容旧版 bindField 接口
    if (ctx.bindField) ctx.bindField(props.prop, { validate, clearValidate });
  }
  if (props.error) errorText.value = props.error;
});

watch(
  () => props.prop,
  (newProp, oldProp) => {
    if (!ctx) return;
    if (oldProp && ctx.removeField) ctx.removeField(oldProp);
    if (newProp && ctx.registerField) {
      ctx.registerField(newProp, { validate, clearValidate, getElement });
    }
  }
);

onBeforeUnmount(() => {
  if (ctx && props.prop && ctx.removeField) ctx.removeField(props.prop);
});

defineExpose({ validate, clearValidate, prop: props.prop, errorText });
</script>

<style scoped lang="scss">
.pui-form-item {
  display: flex;
  margin-bottom: 22px;
  box-sizing: border-box;

  &--top {
    flex-direction: column;

    .pui-form-item__label {
      text-align: left;
      line-height: 1.5;
      margin-bottom: 6px;
      padding-right: 0;
    }
  }

  &--left .pui-form-item__label {
    text-align: left;
  }

  &.is-inline {
    margin-bottom: 0;
    align-items: center;

    // 行内模式不需要为错误提示预留额外高度
    .pui-form-item__error {
      position: static;
      margin-top: 2px;
    }
  }

  &.is-disabled {
    .pui-form-item__label { opacity: 0.65; }
  }

  &__label {
    flex: none;
    padding-right: 12px;
    line-height: 36px;
    font-size: 14px;
    color: var(--pui-text-sub, #5b6879);
    text-align: right;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__star {
    color: var(--pui-danger, #ec3437);
    margin-right: 3px;
  }

  &__content {
    position: relative;
    flex: 1;
    min-width: 0;
    line-height: 36px;
  }

  &__content :deep(.pui-input-number),
  &__content :deep(input),
  &__content :deep(.t-input) {
    line-height: normal;
  }

  &__error {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 3px;
    font-size: 12px;
    color: var(--pui-danger, #ec3437);
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;

    i {
      font-size: 12px;
      flex: none;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* 错误态：给输入类组件统一加红边，不依赖具体组件类名 */
  &.is-error :deep(input),
  &.is-error :deep(textarea),
  &.is-error :deep(select) {
    border-color: var(--pui-danger, #ec3437) !important;
  }
}

.pui-form-item-err-enter-active,
.pui-form-item-err-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pui-form-item-err-enter-from,
.pui-form-item-err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .pui-form-item-err-enter-active,
  .pui-form-item-err-leave-active {
    transition: none;
  }
}
</style>
