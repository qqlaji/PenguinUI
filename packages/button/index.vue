<template>
  <button :class="isClass" :style="styles">
    <i :class="leftIconClass" v-if="resolvedLeftIcon"></i>
    <span
      :style="{
        'margin-left':
          $slot['default'] === undefined ? '0px' : resolvedLeftIcon ? '4px' : '0px',
        'margin-right':
          $slot['default'] === undefined ? '0px' : rightIcon ? '4px' : '0px',
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
});
const $slot = useSlots();
const resolvedColor = computed(() => props.customColor || props.custotColor);
const resolvedLeftIcon = computed(() => props.leftIcon || props.icon);
const isSpinning = computed(() => props.loading || props.localing);
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
    },
  ];
});
const isLoadingIcon = (name) => /^t-icon-(loading[1-6]|spinner6|round-loading)$/.test(name || "");
// 左右图标分别计算，避免同时设置时右侧错显为左侧图标
const leftIconClass = computed(() => [
  "iconfont",
  resolvedLeftIcon.value,
  isSpinning.value && isLoadingIcon(resolvedLeftIcon.value) ? "penguin-icon-loading" : "",
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
</style>