<template>
  <form class="pui-form" :class="[`pui-form--${labelPosition}`, { 'pui-form--inline': inline }]" @submit.prevent>
    <slot />
  </form>
</template>

<script>
export default { name: 'tForm', inheritAttrs: false };
</script>

<script setup>
import { provide, reactive, ref } from 'vue';
import { runRules } from './validate.js';

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  labelWidth: { type: [String, Number], default: '' },
  labelPosition: { type: String, default: 'right' },
  inline: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showMessage: { type: Boolean, default: true },
});

const FORM_KEY = 'puiForm';
const fields = reactive([]);
const initialModel = JSON.parse(JSON.stringify(props.model || {}));

const registerField = (prop) => { if (prop && !fields.includes(prop)) fields.push(prop); };
const removeField = (prop) => { const i = fields.indexOf(prop); if (i > -1) fields.splice(i, 1); };

const validate = async () => {
  let valid = true;
  const errors = {};
  for (const prop of fields) {
    const item = fieldRefs[prop];
    if (!item) continue;
    const r = await item.validate();
    if (!r.valid) {
      valid = false;
      errors[prop] = r.errors;
    }
  }
  return { valid, errors };
};

// 子组件在 mounted 时把自身 validate 方法注册进来
const fieldRefs = {};
const bindField = (prop, inst) => { if (prop) fieldRefs[prop] = inst; };

const validateField = async (prop) => {
  const item = fieldRefs[prop];
  return item ? item.validate() : { valid: true, errors: [] };
};

const resetFields = () => {
  Object.keys(initialModel).forEach((k) => {
    if (props.model && k in props.model) props.model[k] = JSON.parse(JSON.stringify(initialModel[k]));
  });
  fields.forEach((prop) => fieldRefs[prop] && fieldRefs[prop].clearValidate());
};

const clearValidate = (propsList) => {
  const list = propsList || fields;
  list.forEach((prop) => fieldRefs[prop] && fieldRefs[prop].clearValidate());
};

provide(FORM_KEY, {
  model: props.model,
  rules: props.rules,
  labelWidth: props.labelWidth,
  labelPosition: props.labelPosition,
  inline: props.inline,
  disabled: props.disabled,
  showMessage: props.showMessage,
  registerField,
  removeField,
  bindField,
  runRules
});

defineExpose({ validate, resetFields, clearValidate, validateField });
</script>

<style scoped lang="scss">
.pui-form {
  &--inline {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px 20px;
  }
}
</style>
