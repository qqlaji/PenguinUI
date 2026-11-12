<template>
  <span class="pui-breadcrumb__item" :class="[customClass, { 'is-link': !!to }]">
    <a
      v-if="to"
      class="pui-breadcrumb__link"
      :href="typeof to === 'string' ? to : 'javascript:void(0)'"
      :target="target"
      @click.prevent="onClick"
    >
      <slot />
    </a>
    <span v-else class="pui-breadcrumb__text"><slot /></span>
  </span>
</template>

<script>
export default { name: 'tBreadcrumbItem' };
</script>

<script setup>
import { getCurrentInstance } from 'vue';

const props = defineProps({
  to: { type: [String, Object], default: '' },
  replace: { type: Boolean, default: false },
  target: { type: String, default: '' },
  customClass: String,
});
const emit = defineEmits(['click']);

const instance = getCurrentInstance();
const router = instance && instance.appContext.config.globalProperties.$router;

const onClick = (e) => {
  emit('click', e);
  if (!props.to) return;
  if (props.target === '_blank') {
    const href = typeof props.to === 'string' ? props.to : '';
    if (href) window.open(href, '_blank');
    return;
  }
  if (router) {
    const action = props.replace ? router.replace : router.push;
    Promise.resolve(action.call(router, props.to)).catch(() => {});
    return;
  }
  if (typeof props.to === 'string') window.location.href = props.to;
};
</script>

<style scoped lang="scss">
.pui-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.pui-breadcrumb__link {
  color: var(--pui-text-sub, #5b6879);
  text-decoration: none;
  border-radius: 4px;
  padding: 1px 2px;
  margin: -1px -2px;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
  }
  &:focus-visible {
    outline: 2px solid var(--pui-brand, #0e80eb);
    outline-offset: 2px;
  }
}
.pui-breadcrumb__text {
  color: var(--pui-text-sub, #5b6879);
}

/* 最后一项为当前页：加重、不可点 */
.pui-breadcrumb__item:last-child {
  .pui-breadcrumb__text,
  .pui-breadcrumb__link {
    color: var(--pui-text, #1c2534);
    font-weight: 600;
  }
  .pui-breadcrumb__link:hover {
    color: var(--pui-text, #1c2534);
    background: transparent;
  }
}
</style>
