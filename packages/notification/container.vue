<template>
  <div class="pui-notification-host" aria-live="polite">
    <transition-group name="pui-notification">
      <div
        v-for="item in state.list"
        :key="item.id"
        class="pui-notification"
        :class="`is-${item.type}`"
        role="alert"
      >
        <i v-if="item.showIcon" :class="['pui-notification__icon', item.icon]"></i>
        <div class="pui-notification__body">
          <div v-if="item.title" class="pui-notification__title">{{ item.title }}</div>
          <div class="pui-notification__message">{{ item.message }}</div>
        </div>
        <button
          v-if="item.closable"
          type="button"
          class="pui-notification__close"
          aria-label="关闭"
          @click="close(item.id)"
        >
          <i class="t-icon-close"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
defineProps({
  state: { type: Object, required: true },
  close: { type: Function, required: true }
});
</script>

<style scoped lang="scss">
.pui-notification-host {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 340px;
  max-width: calc(100vw - 32px);
  pointer-events: none;
}

.pui-notification {
  pointer-events: auto;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
  border: 1px solid var(--pui-border, #e7ecf3);
  border-left: 4px solid var(--pui-brand, #0e80eb);
  box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.1));

  &.is-success { border-left-color: var(--pui-success, #09b63d); }
  &.is-warning { border-left-color: var(--pui-warning, #f57b29); }
  &.is-error { border-left-color: var(--pui-danger, #ec3437); }

  &__icon {
    font-size: 18px;
    color: var(--pui-brand, #0e80eb);
    margin-top: 1px;
  }
  &.is-success .pui-notification__icon { color: var(--pui-success, #09b63d); }
  &.is-warning .pui-notification__icon { color: var(--pui-warning, #f57b29); }
  &.is-error .pui-notification__icon { color: var(--pui-danger, #ec3437); }

  &__body { flex: 1; min-width: 0; }
  &__title { font-size: 14px; font-weight: 600; color: var(--pui-text, #1c2534); margin-bottom: 3px; }
  &__message { font-size: 13px; color: var(--pui-text-sub, #5b6879); line-height: 1.55; word-break: break-word; }

  &__close {
    flex: none;
    border: none;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    line-height: 1;
    transition: color 0.15s ease;
    &:hover { color: var(--pui-text, #1c2534); }
  }
}

.pui-notification-enter-active,
.pui-notification-leave-active { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.pui-notification-enter-from { opacity: 0; transform: translateX(120%); }
.pui-notification-leave-to { opacity: 0; transform: translateX(120%); }
.pui-notification-leave-active { position: absolute; right: 0; width: 100%; }
</style>
