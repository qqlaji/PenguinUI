<template>
  <div class="pui-result">
    <div class="pui-result__icon" :class="`is-${status}`">
      <span v-if="isCode" class="pui-result__code">{{ status }}</span>
      <i v-else :class="iconClass" :style="{ color: statusColor }"></i>
    </div>

    <div v-if="title || $slots.title" class="pui-result__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="subTitle || $slots.subTitle" class="pui-result__subtitle">
      <slot name="subTitle">{{ subTitle }}</slot>
    </div>

    <div v-if="$slots.extra || $slots.default" class="pui-result__extra">
      <slot name="extra" />
      <slot />
    </div>
  </div>
</template>

<script>
export default { name: 'tResult' };
</script>

<script setup>
import { computed } from 'vue';

const STATUS = {
  success: { icon: 't-icon-success-filling', color: 'var(--pui-success, #09b63d)' },
  error: { icon: 't-icon-error', color: 'var(--pui-danger, #ec3437)' },
  warning: { icon: 't-icon-warning-circle', color: 'var(--pui-warning, #f57b29)' },
  info: { icon: 't-icon-info-circle', color: 'var(--pui-brand, #0e80eb)' }
};
const CODES = ['403', '404', '500'];

const props = defineProps({
  status: { type: String, default: 'info' }, // success | error | warning | info | 403 | 404 | 500
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  icon: { type: String, default: '' } // 自定义图标类名，覆盖内置
});

const isCode = computed(() => CODES.indexOf(props.status) > -1);
const iconClass = computed(
  () => props.icon || (STATUS[props.status] && STATUS[props.status].icon) || 't-icon-info-circle'
);
const statusColor = computed(
  () => (STATUS[props.status] && STATUS[props.status].color) || 'var(--pui-brand, #0e80eb)'
);
</script>

<style scoped lang="scss">
.pui-result {
  padding: 44px 20px;
  text-align: center;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 72px;
    margin-bottom: 16px;

    i {
      font-size: 64px;
      line-height: 1;
    }
    &.is-404 .pui-result__code,
    &.is-403 .pui-result__code,
    &.is-500 .pui-result__code {
      font-size: 68px;
      font-weight: 700;
      letter-spacing: 2px;
      line-height: 1;
      color: var(--pui-text-muted, #8b96a6);
    }
  }

  &__title {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--pui-text, #1c2534);
  }

  &__subtitle {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--pui-text-sub, #5b6879);
  }

  &__extra {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-result * {
    transition: none !important;
  }
}
</style>
