<template>
  <div
    :class="['pui-config-provider', { 'is-dark': merged.theme === 'dark' }]"
    :style="cssVars"
    :data-theme="merged.theme"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tConfigProvider'
};
</script>

<script setup>
import { computed, provide, reactive, toRef } from 'vue';
import { CONFIG_KEY, defaultConfig } from './config';

const props = defineProps({
  /** 组件默认尺寸：large / default / small */
  size: { type: String, default: '' },
  /** 主色 */
  primaryColor: { type: String, default: '' },
  /** 圆角基准（px） */
  radius: { type: [Number, String], default: '' },
  /** 主题：light / dark */
  theme: { type: String, default: '' },
  /** 空状态文案 */
  emptyText: { type: String, default: '' },
  /** 加载中文案 */
  loadingText: { type: String, default: '' },
  /** 分页默认每页条数 */
  pageSize: { type: Number, default: 0 },
  /** 分页可选条数 */
  pageSizes: { type: Array, default: () => [] },
  /** 日期格式 */
  dateFormat: { type: String, default: '' },
  /** 额外配置，会浅合并到默认值上 */
  config: { type: Object, default: () => ({}) }
});

const merged = computed(() => {
  const src = {
    size: props.size,
    primaryColor: props.primaryColor,
    radius: props.radius,
    theme: props.theme,
    emptyText: props.emptyText,
    loadingText: props.loadingText,
    pageSize: props.pageSize,
    pageSizes: props.pageSizes,
    dateFormat: props.dateFormat
  };

  const out = { ...defaultConfig, ...props.config };
  Object.keys(src).forEach((k) => {
    const v = src[k];
    if (v !== '' && v !== 0 && !(Array.isArray(v) && !v.length)) out[k] = v;
  });
  return out;
});

// 提供给子组件的是响应式引用，父级改动 prop 后子组件能立刻拿到新值
provide(CONFIG_KEY, toRef(merged));

/* 把配置映射成 CSS 变量，让样式层也能用上 */
const cssVars = computed(() => {
  const c = merged.value;
  const vars = {};
  if (c.primaryColor) {
    vars['--pui-brand'] = c.primaryColor;
  }
  if (c.radius !== '' && c.radius !== undefined) {
    const r = typeof c.radius === 'number' || /^\d+$/.test(String(c.radius)) ? `${c.radius}px` : c.radius;
    vars['--pui-radius'] = r;
  }
  return vars;
});

defineExpose({ merged });
</script>

<style scoped lang="scss">
.pui-config-provider {
  display: contents;
}
</style>
