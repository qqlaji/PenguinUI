<template>
  <div :class="['pui-float-button-wrap', { 'is-fixed': fixed }]" :style="wrapStyle">
    <component
      :is="href ? 'a' : 'button'"
      :class="[
        'pui-float-button',
        `pui-float-button--${type}`,
        `pui-float-button--${shape}`,
        `pui-float-button--${size}`,
        customClass,
        {
          'has-label': !!label,
          'is-disabled': disabled,
          'is-fixed': fixed
        }
      ]"
      :type="href ? undefined : 'button'"
      :href="href || undefined"
      :target="href ? target : undefined"
      :rel="href && target === '_blank' ? 'noopener noreferrer' : undefined"
      :disabled="href ? undefined : disabled"
      :title="tooltip || label || undefined"
      :aria-label="tooltip || label || undefined"
      @click="onClick"
    >
      <span class="pui-float-button__icon">
        <i v-if="icon" :class="['iconfont', icon]" aria-hidden="true"></i>
        <slot></slot>
        <span v-if="dot" class="pui-float-button__dot" aria-hidden="true"></span>
      </span>

      <span v-if="label" class="pui-float-button__label">{{ label }}</span>
      <span v-if="badge !== '' && badge !== null" class="pui-float-button__badge">{{ badgeText }}</span>
    </component>
  </div>
</template>

<script>
export default {
  name: 'tFloatButton'
};
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** 图标类名 */
  icon: { type: String, default: '' },
  /** 文案，传入后变成胶囊按钮 */
  label: { type: String, default: '' },
  /** 主题：default / primary */
  type: { type: String, default: 'default' },
  /** 形状：circle / square */
  shape: { type: String, default: 'circle' },
  size: { type: String, default: 'default' }, // small | default | large
  /** 徽标数字，0 不显示 */
  badge: { type: [Number, String], default: '' },
  /** 只显示小红点 */
  dot: { type: Boolean, default: false },
  /** 固定在视口右下角 */
  fixed: { type: Boolean, default: true },
  right: { type: [Number, String], default: 32 },
  bottom: { type: [Number, String], default: 96 },
  zIndex: { type: [Number, String], default: 1200 },
  /** 链接地址，传入后渲染为 a 标签 */
  href: { type: String, default: '' },
  target: { type: String, default: '_blank' },
  tooltip: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['click']);

const toPx = (v) => {
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const wrapStyle = computed(() => {
  if (!props.fixed) return {};
  return {
    right: toPx(props.right),
    bottom: toPx(props.bottom),
    zIndex: props.zIndex
  };
});

const badgeText = computed(() => {
  const n = Number(props.badge);
  if (!isNaN(n) && n > 99) return '99+';
  return props.badge;
});

function onClick(e) {
  if (props.disabled) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  emit('click', e);
}
</script>

<style scoped lang="scss">
.pui-float-button-wrap {
  display: inline-flex;

  &.is-fixed {
    position: fixed;
  }
}

.pui-float-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 48px;
  height: 48px;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 50%;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text, #1c2534);
  font-family: inherit;
  font-size: 18px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.16));
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--pui-shadow-lg, 0 24px 60px rgba(24, 44, 78, 0.2));
    color: var(--pui-brand, #0e80eb);
    border-color: var(--pui-brand, #0e80eb);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--pui-brand, #0e80eb);
    outline-offset: 3px;
  }

  /* ---------- 形状 ---------- */
  &--square {
    border-radius: 14px;
  }

  &.has-label {
    width: auto;
    min-width: 48px;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 14px;
  }

  /* ---------- 尺寸 ---------- */
  &--small { width: 40px; height: 40px; font-size: 16px; }
  &--large { width: 56px; height: 56px; font-size: 20px; }

  &--small.has-label { height: 36px; padding: 0 14px; font-size: 13px; }
  &--large.has-label { height: 52px; padding: 0 22px; font-size: 15px; }

  /* ---------- 主题 ---------- */
  &--primary {
    border-color: transparent;
    background: var(--pui-brand, #0e80eb);
    color: #fff;
    box-shadow: 0 10px 24px var(--pui-brand-glow, rgba(14, 128, 235, 0.28));

    &:hover {
      background: var(--pui-brand-strong, #0a68c4);
      color: #fff;
      border-color: transparent;
    }
  }

  /* ---------- 内容 ---------- */
  &__icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  &__label {
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
  }

  &--small &__label { font-size: 13px; }
  &--large &__label { font-size: 15px; }

  &__dot {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--pui-danger, #ec3437);
    border: 1.5px solid var(--pui-bg-elevated, #fff);
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--pui-danger, #ec3437);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    border: 1.5px solid var(--pui-bg-elevated, #fff);
  }

  &.has-label &__badge {
    top: -4px;
    right: 6px;
  }

  /* ---------- 禁用 ---------- */
  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: none;

    &:hover {
      transform: none;
      color: var(--pui-text, #1c2534);
      border-color: var(--pui-border, #e7ecf3);
    }
  }

  &--primary.is-disabled:hover {
    background: var(--pui-brand, #0e80eb);
    color: #fff;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-float-button { transition: none; }
  .pui-float-button:hover { transform: none; }
}
</style>
