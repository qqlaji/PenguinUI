<template>
  <transition name="pui-alert-fade">
    <div v-if="visible" class="pui-alert" :class="classes" role="alert">
      <span v-if="showIcon" class="pui-alert__icon">
        <slot name="icon"><i class="iconfont" :class="iconClass"></i></slot>
      </span>
      <div class="pui-alert__content">
        <div v-if="title || $slots.title" class="pui-alert__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="description || $slots.default" class="pui-alert__desc">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button v-if="closable" class="pui-alert__close" type="button" aria-label="关闭" @click="close">
        <i class="iconfont t-icon-close"></i>
      </button>
    </div>
  </transition>
</template>

<script>
export default { name: 'tAlert' };
</script>

<script setup>
import { computed, ref, useSlots } from 'vue';

const props = defineProps({
  type: { type: String, default: 'info' },       // info | success | warning | danger | primary
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  showIcon: { type: Boolean, default: false },
  closable: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
  effect: { type: String, default: 'light' },   // light | dark
  round: { type: Boolean, default: false },
});
const emit = defineEmits(['close']);
const $slots = useSlots();
const visible = ref(true);

const iconMap = {
  info: 't-icon-prompt',
  success: 't-icon-success',
  warning: 't-icon-warning',
  danger: 't-icon-error',
  primary: 't-icon-explain',
};
const iconClass = computed(() => iconMap[props.type] || iconMap.info);
const classes = computed(() => [
  `pui-alert--${props.type}`,
  `pui-alert--${props.effect}`,
  {
    'pui-alert--center': props.center,
    'pui-alert--round': props.round,
    'pui-alert--with-title': !!(props.title || $slots.title),
  },
]);
const close = () => {
  visible.value = false;
  emit('close');
};
</script>

<style scoped lang="scss">
.pui-alert {
  --alert-info: #0e80eb;
  --alert-success: #09b63d;
  --alert-warning: #f57b29;
  --alert-danger: #ec3437;
  --alert-primary: #6b53e8;
  --alert-tone: var(--alert-info);
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #f2f8ff;
  color: #3c4658;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
}
.pui-alert--info { --alert-tone: var(--alert-info); }
.pui-alert--success { --alert-tone: var(--alert-success); }
.pui-alert--warning { --alert-tone: var(--alert-warning); }
.pui-alert--danger { --alert-tone: var(--alert-danger); }
.pui-alert--primary { --alert-tone: var(--alert-primary); }

.pui-alert--light {
  background: color-mix(in srgb, var(--alert-tone) 8%, #fff);
  border-color: color-mix(in srgb, var(--alert-tone) 22%, #fff);
  color: #3c4658;
  .pui-alert__icon, .pui-alert__title { color: var(--alert-tone); }
}
.pui-alert--dark {
  background: var(--alert-tone);
  border-color: var(--alert-tone);
  color: #fff;
  .pui-alert__icon, .pui-alert__title, .pui-alert__desc, .pui-alert__close { color: #fff; }
}
.pui-alert__icon {
  flex: none;
  display: inline-flex;
  align-items: center;
  height: 22px;
  font-size: 18px;
}
.pui-alert__content { flex: 1; min-width: 0; }
.pui-alert__title { font-weight: 650; font-size: 14px; line-height: 22px; }
.pui-alert__desc { font-size: 13px; line-height: 22px; opacity: 0.9; }
.pui-alert--with-title .pui-alert__icon { font-size: 20px; }
.pui-alert--center { justify-content: center; text-align: center; .pui-alert__content { flex: none; } }
.pui-alert--round { border-radius: 14px; }
.pui-alert__close {
  flex: none;
  border: 0;
  background: transparent;
  color: #98a2b3;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  padding: 0 2px;
  &:hover { color: var(--alert-tone); }
}
.pui-alert-fade-enter-active, .pui-alert-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease, max-height 0.22s ease, padding 0.22s ease;
  max-height: 200px;
}
.pui-alert-fade-enter-from, .pui-alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
