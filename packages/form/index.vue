<template>
  <form
    ref="formRef"
    class="pui-form"
    :class="[
      `pui-form--${labelPosition}`,
      { 'pui-form--inline': inline, 'is-disabled': disabled }
    ]"
    novalidate
    @submit.prevent
  >
    <slot />
  </form>
</template>

<script>
export default { name: 'tForm', inheritAttrs: false };
</script>

<script setup>
import { computed, nextTick, onMounted, provide, reactive, ref, watch } from 'vue';
import { runRules } from './validate.js';

const props = defineProps({
  /** 表单数据对象 */
  model: { type: Object, default: () => ({}) },
  /** 校验规则：{ field: Rule[] } */
  rules: { type: Object, default: () => ({}) },
  /** 标签宽度 */
  labelWidth: { type: [String, Number], default: '' },
  /** 标签位置 */
  labelPosition: { type: String, default: 'right' },
  /** 行内表单 */
  inline: { type: Boolean, default: false },
  /** 禁用整张表单 */
  disabled: { type: Boolean, default: false },
  /** 是否显示错误提示 */
  showMessage: { type: Boolean, default: true },
  /** 校验失败时滚动到第一个错误字段 */
  scrollToError: { type: Boolean, default: false },
  /** scrollToError 时的滚动偏移量（px） */
  scrollOffset: { type: Number, default: 60 }
});

const emit = defineEmits(['validate', 'submit', 'reset']);

const FORM_KEY = 'puiForm';

/** 注册的字段：prop -> { validate, clearValidate, getElement, order } */
const fieldMap = reactive(new Map());
/** 保留原始插入顺序，避免 Map 遍历受增删影响 */
const orderList = ref([]);
let orderSeed = 0;

/* ---------------- 字段注册 ---------------- */
function registerField(prop, instance) {
  if (!prop) return;
  if (!fieldMap.has(prop)) {
    orderList.value.push(prop);
    orderSeed += 1;
  }
  fieldMap.set(prop, { ...instance, order: orderSeed });
}

function updateField(prop, patch) {
  if (!prop || !fieldMap.has(prop)) return;
  fieldMap.set(prop, { ...fieldMap.get(prop), ...patch });
}

function removeField(prop) {
  if (!prop) return;
  fieldMap.delete(prop);
  const i = orderList.value.indexOf(prop);
  if (i > -1) orderList.value.splice(i, 1);
}

/** 当前有效字段（按渲染顺序） */
const fields = computed(() =>
  orderList.value.filter((p) => fieldMap.has(p)).map((p) => ({ prop: p, ...fieldMap.get(p) }))
);

/* ---------------- 初始值快照 ---------------- */
/**
 * 不用 JSON 深拷贝：会丢 Date / File / undefined。
 * 只对对象和数组做浅层克隆，其他类型直接引用。
 */
function cloneValue(v) {
  if (v === null || typeof v !== 'object') return v;
  if (v instanceof Date) return new Date(v.getTime());
  if (Array.isArray(v)) return v.map(cloneValue);
  if (v instanceof File || v instanceof Blob) return v;
  if (typeof v === 'object') {
    const out = {};
    Object.keys(v).forEach((k) => {
      out[k] = cloneValue(v[k]);
    });
    return out;
  }
  return v;
}

let initialSnapshot = cloneValue(props.model || {});

/** 首屏之后 model 结构可能变化，提供手动重置快照的方法 */
function setInitialValues(values) {
  initialSnapshot = cloneValue(values || props.model || {});
}
setInitialValues(props.model);

/* ---------------- 校验 ---------------- */
/**
 * 校验整张表单。
 * 返回 Promise：
 *  - 通过 → resolve(true)
 *  - 失败 → reject({ fields, message })，并（可选）滚动到第一个错误
 * 与主流用法一致，也保留 validateResult() 这种不抛异常的写法。
 */
async function validate() {
  const entries = fields.value.filter((f) => f.prop);
  const results = [];
  const failed = [];

  // 并发执行，避免逐个 await 造成串行等待
  await Promise.all(
    entries.map(async (f) => {
      const r = await f.validate();
      results.push({ prop: f.prop, ...r });
      if (!r.valid) failed.push({ prop: f.prop, errors: r.errors, element: f.getElement ? f.getElement() : null });
    })
  );

  if (failed.length) {
    // 按字段渲染顺序排序，保证「第一个错误」是视觉上的第一个
    const ordered = orderList.value
      .map((p) => failed.find((f) => f.prop === p))
      .filter(Boolean);

    const payload = {
      fields: ordered,
      message: ordered[0] ? String(ordered[0].errors[0] || '') : '校验未通过'
    };

    emit('validate', false, payload);

    if (props.scrollToError) {
      await nextTick();
      scrollToFirstError(ordered[0]);
    }

    // 抛出以便调用方 try/catch 或 .catch()，同时不影响已显示的字段错误
    const err = new Error(payload.message);
    err.fields = payload.fields;
    err.isValidateError = true;
    throw err;
  }

  emit('validate', true, { fields: [] });
  return true;
}

/** 不抛异常的版本，返回布尔 */
async function validateQuietly() {
  try {
    await validate();
    return true;
  } catch (e) {
    return false;
  }
}

function scrollToFirstError(first) {
  if (!first) return;
  let el = first.element;
  if (typeof el === 'function') el = el();
  if (!el || !el.scrollIntoView) return;

  const rect = el.getBoundingClientRect();
  const top = window.scrollY + rect.top - props.scrollOffset;
  window.scrollTo({ top, behavior: 'smooth' });

  // 聚焦第一个可输入元素，方便用户直接改
  const focusable = el.querySelector ? el.querySelector('input, textarea, select') : null;
  if (focusable && focusable.focus) {
    setTimeout(() => focusable.focus({ preventScroll: true }), 260);
  }
}

/** 校验单个字段 */
async function validateField(prop) {
  const target = Array.isArray(prop) ? prop : [prop];
  const out = [];
  for (const p of target) {
    const f = fieldMap.get(p);
    if (f) out.push({ prop: p, ...(await f.validate()) });
  }
  return out;
}

/** 清空校验状态（可传字段数组） */
function clearValidate(propsList) {
  const list = propsList ? (Array.isArray(propsList) ? propsList : [propsList]) : fields.value.map((f) => f.prop);
  list.forEach((p) => {
    const f = fieldMap.get(p);
    if (f && f.clearValidate) f.clearValidate();
  });
}

/** 重置为初始值并清空校验 */
function resetFields() {
  Object.keys(initialSnapshot).forEach((k) => {
    if (props.model && k in props.model) {
      props.model[k] = cloneValue(initialSnapshot[k]);
    }
  });
  clearValidate();
  emit('reset');
}

/** 提交：先校验，通过后抛给父组件 */
async function submit() {
  try {
    await validate();
    emit('submit', props.model);
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------------- 提供给子组件 ---------------- */
provide(FORM_KEY, {
  get model() {
    return props.model;
  },
  get rules() {
    return props.rules;
  },
  get labelWidth() {
    return props.labelWidth;
  },
  get labelPosition() {
    return props.labelPosition;
  },
  get inline() {
    return props.inline;
  },
  get disabled() {
    return props.disabled;
  },
  get showMessage() {
    return props.showMessage;
  },
  get scrollToError() {
    return props.scrollToError;
  },
  registerField,
  updateField,
  removeField,
  runRules
});

const formRef = ref(null);

defineExpose({
  validate,
  validateQuietly,
  validateField,
  resetFields,
  clearValidate,
  setInitialValues,
  submit,
  fields,
  el: formRef
});
</script>

<style scoped lang="scss">
.pui-form {
  &--inline {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px 20px;

    :deep(.pui-form-item) {
      margin-bottom: 0;
      align-items: center;
    }
  }

  &.is-disabled {
    // 只降低交互感的层级，不整体压暗，避免文字不可读
    :deep(.pui-form-item__label) {
      opacity: 0.7;
    }
  }
}
</style>
