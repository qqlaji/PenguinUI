// 轻量校验器：不依赖任何第三方库，覆盖常用规则并支持 async 自定义校验
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmpty = (v) =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export async function runRules(value, rules = [], model = {}) {
  const errors = [];
  for (const rule of rules) {
    // required
    if (rule.required && isEmpty(value)) {
      errors.push(rule.message || '该项为必填项');
      continue; // 空值时不再校验其它规则
    }
    if (isEmpty(value)) continue;

    if (rule.type === 'email' && !EMAIL_RE.test(String(value))) {
      errors.push(rule.message || '邮箱格式不正确');
    }
    if (rule.type === 'number' && Number.isNaN(Number(value))) {
      errors.push(rule.message || '必须为数字');
    }
    if (rule.pattern && !(rule.pattern instanceof RegExp ? rule.pattern : new RegExp(rule.pattern)).test(String(value))) {
      errors.push(rule.message || '格式不正确');
    }
    if (rule.min !== undefined || rule.max !== undefined) {
      if (typeof value === 'number' || rule.type === 'number') {
        const num = Number(value);
        if (rule.min !== undefined && num < rule.min) errors.push(rule.message || `不能小于 ${rule.min}`);
        if (rule.max !== undefined && num > rule.max) errors.push(rule.message || `不能大于 ${rule.max}`);
      } else {
        const len = String(value).length;
        if (rule.min !== undefined && len < rule.min) errors.push(rule.message || `至少 ${rule.min} 个字符`);
        if (rule.max !== undefined && len > rule.max) errors.push(rule.message || `至多 ${rule.max} 个字符`);
      }
    }
    if (rule.len !== undefined && String(value).length !== rule.len) {
      errors.push(rule.message || `长度需为 ${rule.len}`);
    }
    if (typeof rule.validator === 'function') {
      try {
        const res = await rule.validator(rule, value, model);
        if (res === false) errors.push(rule.message || '校验失败');
        else if (typeof res === 'string') errors.push(res);
      } catch (e) {
        errors.push(typeof e === 'string' ? e : rule.message || '校验失败');
      }
    }
  }
  return errors;
}
