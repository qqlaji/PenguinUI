<template>
  <button
    :class="isClass"
    :style="styles"
    :type="nativeType || undefined"
    :disabled="disabled || isSpinning"
    :aria-busy="isSpinning || undefined"
  >
    <i :class="leftIconClass" v-if="displayLeftIcon"></i>
    <span
      :style="{
        'margin-left':
          $slot['default'] === undefined || circle ? '0px' : displayLeftIcon ? '4px' : '0px',
        'margin-right':
          $slot['default'] === undefined || circle ? '0px' : rightIcon ? '4px' : '0px',
      }"
      ><slot
    /></span>
    <i :class="rightIconClass" v-if="rightIcon"></i>
  </button>
</template>
<script>
export default {
  name: "tButton",
};
</script>
<script setup>
import { computed, useSlots } from "vue";
const props = defineProps({
  type: {
    type: String,
    default: "default",
  },
  disabled: Boolean,
  round: Boolean,
  size: {
    type: String,
    default: "default",
  },
  custotColor: {
    type: String,
    default: "",
  },
  // 拼写修正后的别名，旧写法 custotColor 仍然兼容
  customColor: {
    type: String,
    default: "",
  },
  leftIcon: String,
  rightIcon: String,
  // icon 等价于 leftIcon，兼容早期文档示例里的 icon="t-icon-*"
  icon: String,
  localing: Boolean,
  // 拼写修正后的别名，旧写法 localing 仍然兼容
  loading: Boolean,
  // ===== v1.9 新增 =====
  // 块级按钮：占满父容器宽度
  block: Boolean,
  // 朴素按钮：白底 + 语义色文字/边框
  plain: Boolean,
  // 圆形图标按钮（自动修正内部间距）
  circle: Boolean,
  // 原生 button type，留空时保持原有不设置的行为
  nativeType: { type: String, default: '' },
});
const $slot = useSlots();
const resolvedColor = computed(() => props.customColor || props.custotColor);
const resolvedLeftIcon = computed(() => props.leftIcon || props.icon);
const isSpinning = computed(() => props.loading || props.localing);
// loading 且未指定图标时，自动补一枚旋转图标
const displayLeftIcon = computed(() =>
  resolvedLeftIcon.value || (isSpinning.value ? "t-icon-spinner6" : "")
);
const isClass = computed(() => {
  return [
    props.size === "default"
      ? "penguin-button"
      : props.size === "medium"
      ? "penguin-button-medium"
      : props.size === "small"
      ? "penguin-button-small"
      : props.size === "mini"
      ? "penguin-button-mini"
      : "penguin-button",
    props.type ? (props.disabled ? "" : `penguin-button-${props.type}`) : "",
    props.disabled ? `penguin-button-${props.type}-disabled` : "",
    {
      "penguin-button-round": props.round,
      "penguin-button-circle": props.circle,
      "penguin-button-block": props.block,
      "penguin-button-plain": props.plain,
      "penguin-button-loading": isSpinning.value,
    },
  ];
});
const isLoadingIcon = (name) => /^t-icon-(loading[1-6]|spinner6|round-loading)$/.test(name || "");
// 左右图标分别计算，避免同时设置时右侧错显为左侧图标
const leftIconClass = computed(() => [
  "iconfont",
  displayLeftIcon.value,
  isSpinning.value && isLoadingIcon(displayLeftIcon.value) ? "penguin-icon-loading" : "",
]);
const rightIconClass = computed(() => [
  "iconfont",
  props.rightIcon,
  isSpinning.value && isLoadingIcon(props.rightIcon) ? "penguin-icon-loading" : "",
]);
const styles = computed(() => {
  const color = resolvedColor.value;
  return [
    color === ""
      ? {}
      : props.type === "default"
      ? {}
      : { background: color, border: color, color: "#fff" },
  ];
});
</script>
<style scoped lang="scss">
.penguin-button {
  padding: 10px 20px;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 2px;
  background: #fff;
  transition: all 0.15s ease;
  user-select: none;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  i {
  }
  span {
    display: inline-block;
  }
}
.penguin-button-medium {
  padding: 8px 18px;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 2px;
  background: #fff;
  transition: all 0.15s ease;
  user-select: none;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  i {
    font-size: 14px;
  }
}
.penguin-button-small {
  padding: 7px 13px;
  outline: none;
  cursor: pointer;
  font-size: 13px;
  border-radius: 2px;
  background: #fff;
  transition: all 0.15s ease;
  user-select: none;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  i {
    font-size: 13px;
  }
}
.penguin-button-mini {
  padding: 7px 13px;
  outline: none;
  cursor: pointer;
  font-size: 12px;
  border-radius: 2px;
  background: #fff;
  transition: all 0.15s ease;
  user-select: none;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  i {
    font-size: 12px;
  }
}
.penguin-button-round {
  border-radius: 22px;
}
.penguin-button-default {
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #333;
  &:hover {
    color: #0e80eb;
    border-color: #0e80eb;
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-custom {
  color: #333;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-primary {
  border: 1px solid $primary;
  color: #fff;
  background-color: $primary;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-success {
  border: 1px solid #09b63d;
  color: #fff;
  background-color: #09b63d;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-danger {
  border: 1px solid #ec3437;
  background: #ec3437;
  color: #fff;
  &:hover {
    color: #fff;
    border-color: #ec3437;
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-warning {
  border: 1px solid #f57b29;
  background: #f57b29;
  color: #fff;
  &:hover {
    color: #fff;
    border-color: #f57b29;
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-text {
  border: 1px solid #fff;
  background: none;
  color: #0e80eb;
  &:hover {
    color: #0e80eb;
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.penguin-button-dashed {
  border: 1px dashed #d9d9d9;
  background: #fff;
  color: #333;
  &:hover {
    color: #0e80eb;
    border-color: #0e80eb;
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}

.penguin-button-default-disabled {
  cursor: no-drop;
  border: 1px solid #d9d9d9;
  background: #fff;
  opacity: 0.5;
  color: #333;
}
.penguin-button-primary-disabled {
  cursor: no-drop;
  border: 1px solid #0e80eb;
  background: #0e80eb;
  opacity: 0.5;
  color: #fff;
}
.penguin-button-success-disabled {
  cursor: no-drop;
  border: 1px solid #09b63d;
  background: #09b63d;
  opacity: 0.5;
  color: #fff;
}
.penguin-button-danger-disabled {
  cursor: no-drop;
  border: 1px solid #ec3437;
  background: #ec3437;
  opacity: 0.5;
  color: #fff;
}
.penguin-button-warning-disabled {
  cursor: no-drop;
  border: 1px solid #f57b29;
  background: #f57b29;
  opacity: 0.5;
  color: #fff;
}
.penguin-button-dashed-disabled {
  cursor: no-drop;
  border: 1px solid #d9d9d9;
  background: #fff;
  opacity: 0.5;
  color: #333;
}
.penguin-button-text-disabled {
  cursor: no-drop;
  border: 1px solid #fff;
  background: none;
  opacity: 0.5;
  color: #0e80eb;
}
.penguin-button-custom-disabled {
  cursor: no-drop;
  opacity: 0.5;
}

.penguin-icon-loading {
  animation: icon-loading 1.5s linear infinite;
  -webkit-animation: icon-loading 1.5s linear infinite;
}
@keyframes icon-loading {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ===== v1.9 新增：block / plain / circle / loading ===== */
.penguin-button-block {
  display: block;
  width: 100%;
}
.penguin-button-circle {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  span { margin: 0 !important; }
  i { margin: 0; }
}
.penguin-button-medium.penguin-button-circle { width: 36px; height: 36px; }
.penguin-button-small.penguin-button-circle,
.penguin-button-mini.penguin-button-circle { width: 30px; height: 30px; }
.penguin-button-loading {
  pointer-events: none;
  opacity: 0.78;
  cursor: wait;
}
.penguin-button-plain {
  background: #fff !important;
  &.penguin-button-default { color: $primary; border-color: $primary; }
  &.penguin-button-primary { color: $primary; }
  &.penguin-button-success { color: #09b63d; }
  &.penguin-button-danger { color: #ec3437; }
  &.penguin-button-warning { color: #f57b29; }
  &.penguin-button-text { color: $primary; }
  &:hover { opacity: 0.82; }
}

/* ===== v1.11 视觉统一：圆角 / 高度 / 交互态与新版组件对齐 ===== */
.penguin-button,
.penguin-button-medium,
.penguin-button-small,
.penguin-button-mini {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 10px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.22));
  }
  &:disabled { cursor: not-allowed; }
}
.penguin-button { height: 36px; padding: 0 16px; font-size: 14px; }
.penguin-button-medium { height: 32px; padding: 0 14px; font-size: 13px; border-radius: 9px; }
.penguin-button-small { height: 28px; padding: 0 12px; font-size: 12px; border-radius: 8px; }
.penguin-button-mini { height: 24px; padding: 0 10px; font-size: 12px; border-radius: 7px; }

.penguin-button-round { border-radius: 999px; }
.penguin-button-circle {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
}
.penguin-button-medium.penguin-button-circle { width: 32px; height: 32px; }
.penguin-button-small.penguin-button-circle,
.penguin-button-mini.penguin-button-circle { width: 28px; height: 28px; }

/* 交互态：用颜色变化替代透明度，避免文字发灰 */
.penguin-button-default,
.penguin-button-dashed {
  border-color: var(--pui-border-strong, #d8e0ea);
  color: var(--pui-text, #1c2534);
  background: var(--pui-bg-elevated, #fff);

  &:hover {
    color: var(--pui-brand, #0e80eb);
    border-color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
    opacity: 1;
  }
}
.penguin-button-primary {
  background: var(--pui-brand, #0e80eb);
  border-color: var(--pui-brand, #0e80eb);
  box-shadow: 0 1px 2px rgba(14, 128, 235, 0.24);

  &:hover {
    background: var(--pui-brand-strong, #0a68c4);
    border-color: var(--pui-brand-strong, #0a68c4);
    box-shadow: 0 4px 12px rgba(14, 128, 235, 0.28);
    opacity: 1;
  }
}
.penguin-button-success:hover { background: #089f36; border-color: #089f36; opacity: 1; }
.penguin-button-danger:hover { background: #d32b2e; border-color: #d32b2e; opacity: 1; }
.penguin-button-warning:hover { background: #e06c1c; border-color: #e06c1c; opacity: 1; }
.penguin-button-text {
  border-color: transparent;
  background: transparent;

  &:hover {
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
    opacity: 1;
  }
}
.penguin-button-plain:hover { opacity: 1; }

/* 禁用态统一 */
[class*='penguin-button'][class$='-disabled'] {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;

  &:hover { opacity: 0.5; }
}
</style>