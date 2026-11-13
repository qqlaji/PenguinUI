/**
 * 轻量校验器：不依赖任何第三方库，覆盖常用规则并支持 async 自定义校验。
 *
 * 规则字段：
 *  - required  必填
 *  - type      string / number / integer / boolean / array / email / url / date
 *  - pattern   正则（RegExp 或字符串）
 *  - min / max 数字→值域；字符串/数组→长度
 *  - len       长度精确匹配
 *  - enum      枚举白名单
 *  - validator 自定义校验 (rule, value, model) => boolean|string|Error|Promise
 *  - transform 校验前对值做转换
 *  - message   错误文案
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

/** 空值判定：注意 0 和 false 不算空 */
const isEmpty = (v) => {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (v instanceof Date && Number.isNaN(v.getTime())) return true;
  return false;
};

function matchType(type, value) {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);
    case 'integer':
      return Number.isInteger(value) || (typeof value === 'string' && /^-?\d+$/.test(value));
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'email':
      return EMAIL_RE.test(String(value));
    case 'url':
      return URL_RE.test(String(value));
    case 'date':
      return value instanceof Date ? !Number.isNaN(value.getTime()) : !Number.isNaN(Date.parse(String(value)));
    default:
      return true;
  }
}

const TYPE_MESSAGE = {
  email: '邮箱格式不正确',
  url: 'URL 格式不正确',
  number: '必须为数字',
  integer: '必须为整数',
  array: '必须为数组',
  string: '必须为字符串',
  boolean: '必须为布尔值',
  date: '日期格式不正确'
};

/** 长度：优先数组长度，其次字符串长度 */
const lengthOf = (value) => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'string') return value.length;
  return null;
};

export async function runRules(value, rules = [], model = {}) {
  const errors = [];
  const list = Array.isArray(rules) ? rules : [rules];

  for (const rawRule of list) {
    if (!rawRule || typeof rawRule !== 'object') continue;
    const rule = { ...rawRule };

    // 校验前转换（例如 trim、字符串转数字）
    let v = value;
    if (typeof rule.transform === 'function') {
      try {
        v = rule.transform(value);
      } catch (e) {
        /* transform 出错时按原值继续校验 */
      }
    }

    /* ---------- 必填 ---------- */
    if (rule.required && isEmpty(v)) {
      errors.push(rule.message || '该项为必填项');
      continue; // 空值不再跑后续规则
    }

    // 非必填且为空 → 其余规则全部跳过
    if (isEmpty(v)) continue;

    /* ---------- 类型 ---------- */
    if (rule.type && !matchType(rule.type, v)) {
      errors.push(rule.message || TYPE_MESSAGE[rule.type] || `类型必须为 ${rule.type}`);
      continue; // 类型不符时 min/max 无意义
    }

    /* ---------- 正则 ---------- */
    if (rule.pattern) {
      const re = rule.pattern instanceof RegExp ? rule.pattern : new RegExp(rule.pattern);
      if (!re.test(String(v))) {
        errors.push(rule.message || '格式不正确');
      }
    }

    /* ---------- 枚举 ---------- */
    if (Array.isArray(rule.enum) && rule.enum.length) {
      if (!rule.enum.includes(v)) {
        errors.push(rule.message || `必须是 ${rule.enum.join(' / ')} 之一`);
      }
    }

    /* ---------- 值域 / 长度 ---------- */
    const isNumeric = typeof v === 'number' || rule.type === 'number' || rule.type === 'integer';

    if (rule.min !== undefined || rule.max !== undefined) {
      if (isNumeric) {
        const num = Number(v);
        if (rule.min !== undefined && num < rule.min) {
          errors.push(rule.message || `${rule.label || '值'}不能小于 ${rule.min}`);
        }
        if (rule.max !== undefined && num > rule.max) {
          errors.push(rule.message || `${rule.label || '值'}不能大于 ${rule.max}`);
        }
      } else {
        const len = lengthOf(v);
        if (len !== null) {
          if (rule.min !== undefined && len < rule.min) {
            errors.push(rule.message || `至少 ${rule.min} 个字符`);
          }
          if (rule.max !== undefined && len > rule.max) {
            errors.push(rule.message || `至多 ${rule.max} 个字符`);
          }
        }
      }
    }

    if (rule.len !== undefined) {
      const len = lengthOf(v);
      if (len !== null && len !== rule.len) {
        errors.push(rule.message || `长度需为 ${rule.len}`);
      }
    }

    /* ---------- 自定义校验 ---------- */
    if (typeof rule.validator === 'function') {
      try {
        const res = await rule.validator(rule, v, model);
        if (res === false) errors.push(rule.message || '校验失败');
        else if (typeof res === 'string') errors.push(res);
        else if (res instanceof Error) errors.push(res.message);
      } catch (e) {
        errors.push(typeof e === 'string' ? e : e && e.message ? e.message : rule.message || '校验失败');
      }
    }
  }

  return errors;
}

/** 常用规则预设，减少业务重复书写 */
export const rulePresets = {
  required: (label = '该项', trigger = 'blur') => ({ required: true, message: `${label}为必填项`, trigger }),
  email: (trigger = 'blur') => ({ type: 'email', message: '请输入正确的邮箱地址', trigger }),
  phone: (trigger = 'blur') => ({ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger }),
  url: (trigger = 'blur') => ({ type: 'url', message: '请输入正确的 URL', trigger }),
  range: (min, max, label = '值') => ({
    validator: (_r, v) => {
      if (v === undefined || v === null || v === '') return true;
      const n = Number(v);
      if (Number.isNaN(n)) return '请输入数字';
      if (n < min || n > max) return `${label}需在 ${min} ~ ${max} 之间`;
      return true;
    }
  })
};

export default runRules;
