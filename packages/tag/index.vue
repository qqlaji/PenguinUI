<template>
  <transition name="pui-tag-fade">
    <span
      v-if="visible"
      class="pui-tag"
      :class="classes"
      :style="customStyle"
      :tabindex="clickable || checkable ? 0 : undefined"
      @click="onClick"
      @keydown.enter.prevent="onClick"
    >
      <span v-if="dot" class="pui-tag__dot"></span>
      <i v-if="icon" class="iconfont pui-tag__icon" :class="icon"></i>
      <slot></slot>
      <i
        v-if="closable"
        class="iconfont t-icon-close pui-tag__close"
        role="button"
        aria-label="关闭标签"
        @click.stop="onClose"
      ></i>
    </span>
  </transition>
</template>

<script>
export default { name: 'tTag' };
</script>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  type: { type: String, default: 'default' },     // default | primary | success | warning | danger | info
  size: { type: String, default: 'default' },     // large | default | small
  effect: { type: String, default: 'light' },     // light | dark | plain
  round: { type: Boolean, default: false },
  closable: { type: Boolean, default: false },
  color: { type: String, default: '' },           // 自定义颜色，优先于 type
  bordered: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  checkable: { type: Boolean, default: false },
  checked: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  dot: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'click', 'update:checked', 'change']);

const visible = ref(true);
const innerChecked = ref(props.checked);
watch(() => props.checked, (v) => { innerChecked.value = v; });

const classes = computed(() => [
  `pui-tag--${props.type}`,
  `pui-tag--${props.size}`,
  `pui-tag--${props.effect}`,
  {
    'pui-tag--round': props.round,
    'pui-tag--bordered': props.bordered,
    'pui-tag--clickable': props.clickable && !props.disabled,
    'pui-tag--checkable': props.checkable,
    'is-checked': props.checkable && innerChecked.value,
    'is-disabled': props.disabled,
  },
]);

// 统一通过 --tag-tone 驱动文案 / 背景 / 边框 / 圆点
const customStyle = computed(() => (props.color ? { '--tag-tone': props.color } : {}));

const onClick = (e) => {
  if (props.disabled) return;
  if (props.checkable) {
    innerChecked.value = !innerChecked.value;
    emit('update:checked', innerChecked.value);
    emit('change', innerChecked.value);
  }
  emit('click', e);
};
const onClose = (e) => {
  if (props.disabled) return;
  visible.value = false;
  emit('close', e);
};
</script>

<style scoped lang="scss">
.pui-tag {
  --tag-tone: #909399;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-sizing: border-box;
  padding: 0 9px;
  height: 24px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease,
    transform 0.15s ease, box-shadow 0.15s ease;

  &:focus-visible {
    outline: 2px solid var(--tag-tone);
    outline-offset: 1px;
  }
}
.pui-tag--default { --tag-tone: #909399; }
.pui-tag--primary { --tag-tone: #0e80eb; }
.pui-tag--success { --tag-tone: #09b63d; }
.pui-tag--warning { --tag-tone: #f57b29; }
.pui-tag--danger { --tag-tone: #ec3437; }
.pui-tag--info { --tag-tone: #5b6879; }

/* 三种质感 */
.pui-tag--light {
  color: var(--tag-tone);
  background: color-mix(in srgb, var(--tag-tone) 10%, #fff);
  border-color: color-mix(in srgb, var(--tag-tone) 22%, #fff);
}
.pui-tag--dark {
  color: #fff;
  background: var(--tag-tone);
  border-color: var(--tag-tone);
}
.pui-tag--plain {
  color: var(--tag-tone);
  background: transparent;
  border-color: color-mix(in srgb, var(--tag-tone) 35%, #fff);
}
.pui-tag--bordered { border-color: var(--tag-tone); }

/* 尺寸 */
.pui-tag--large { height: 30px; padding: 0 12px; font-size: 13px; border-radius: 6px; }
.pui-tag--small { height: 20px; padding: 0 7px; font-size: 11px; border-radius: 3px; }

/* 形态 */
.pui-tag--round { border-radius: 999px; }
.pui-tag--clickable {
  cursor: pointer;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(24, 44, 78, 0.14); }
}
.pui-tag--checkable {
  cursor: pointer;
  user-select: none;
  &:hover { border-color: var(--tag-tone); }
  &.is-checked {
    color: #fff;
    background: var(--tag-tone);
    border-color: var(--tag-tone);
  }
}

.pui-tag__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tag-tone);
  flex: none;
}
.pui-tag--dark .pui-tag__dot,
.pui-tag.is-checked .pui-tag__dot { background: currentColor; }
.pui-tag__icon { font-size: 12px; }

.pui-tag__close {
  font-size: 11px;
  cursor: pointer;
  opacity: 0.75;
  border-radius: 50%;
  transition: opacity 0.15s ease, background 0.15s ease;
  &:hover { opacity: 1; background: rgba(0, 0, 0, 0.12); }
}
.pui-tag--dark .pui-tag__close:hover { background: rgba(255, 255, 255, 0.24); }

.pui-tag.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
  .pui-tag__close { cursor: not-allowed; }
}

.pui-tag-fade-enter-active,
.pui-tag-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.pui-tag-fade-enter-from,
.pui-tag-fade-leave-to { opacity: 0; transform: scale(0.85); }

@media (prefers-reduced-motion: reduce) {
  .pui-tag,
  .pui-tag-fade-enter-active,
  .pui-tag-fade-leave-active { transition: none; }
}
</style>
