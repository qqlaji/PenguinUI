<template>
  <span ref="triggerRef" class="pui-popconfirm" @click="toggle">
    <slot />
    <teleport to="body">
      <transition name="pui-popconfirm-fade">
        <div
          v-if="visible"
          ref="popRef"
          class="pui-popconfirm__pop"
          :class="`is-${placement}`"
          :style="popStyle"
          @click.stop
        >
          <div class="pui-popconfirm__arrow" :style="arrowStyle"></div>
          <div class="pui-popconfirm__body">
            <i v-if="icon" :class="['pui-popconfirm__icon', icon]"></i>
            <div class="pui-popconfirm__text">
              <div v-if="title" class="pui-popconfirm__title">{{ title }}</div>
              <div v-if="content" class="pui-popconfirm__desc">{{ content }}</div>
            </div>
          </div>
          <div class="pui-popconfirm__footer">
            <t-button size="small" @click="onCancel">{{ cancelText }}</t-button>
            <t-button size="small" :type="confirmType" @click="onConfirm">{{ confirmText }}</t-button>
          </div>
        </div>
      </transition>
    </teleport>
  </span>
</template>

<script>
export default { name: 'tPopconfirm' };
</script>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import tButton from '../button/index.vue';

const props = defineProps({
  title: { type: String, default: '确定要执行此操作吗？' },
  content: { type: String, default: '' },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
  confirmType: { type: String, default: 'primary' },
  icon: { type: String, default: 't-icon-warning' },
  placement: { type: String, default: 'bottom' },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel', 'visible-change']);
const triggerRef = ref(null);
const popRef = ref(null);
const visible = ref(false);
const popStyle = ref({});
const arrowStyle = ref({});

const GAP = 10;

const place = async () => {
  await nextTick();
  const trig = triggerRef.value?.getBoundingClientRect();
  const pop = popRef.value?.getBoundingClientRect();
  if (!trig || !pop) return;
  const [dir, align] = props.placement.split('-');
  let top = 0;
  let left = 0;
  if (dir === 'top') {
    top = trig.top - pop.height - GAP;
    left = trig.left + trig.width / 2 - pop.width / 2;
  } else if (dir === 'bottom') {
    top = trig.bottom + GAP;
    left = trig.left + trig.width / 2 - pop.width / 2;
  } else if (dir === 'left') {
    top = trig.top + trig.height / 2 - pop.height / 2;
    left = trig.left - pop.width - GAP;
  } else if (dir === 'right') {
    top = trig.top + trig.height / 2 - pop.height / 2;
    left = trig.right + GAP;
  }
  if (align === 'start') {
    left = dir === 'top' || dir === 'bottom' ? trig.left : left;
  } else if (align === 'end') {
    left = dir === 'top' || dir === 'bottom' ? trig.right - pop.width : left;
  }
  // 视口边界保护
  left = Math.max(8, Math.min(left, window.innerWidth - pop.width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - pop.height - 8));
  popStyle.value = { top: `${top}px`, left: `${left}px` };
};

const onDocClick = (e) => {
  if (
    !visible.value ||
    triggerRef.value?.contains(e.target) ||
    popRef.value?.contains(e.target)
  ) {
    return;
  }
  close();
};
const onKey = (e) => {
  if (e.key === 'Escape') close();
};

const open = () => {
  if (props.disabled) return;
  visible.value = true;
  emit('visible-change', true);
  place();
  document.addEventListener('mousedown', onDocClick);
  document.addEventListener('keydown', onKey);
};
const close = () => {
  if (!visible.value) return;
  visible.value = false;
  emit('visible-change', false);
  document.removeEventListener('mousedown', onDocClick);
  document.removeEventListener('keydown', onKey);
};
const toggle = () => (visible.value ? close() : open());

const onConfirm = () => {
  emit('confirm');
  close();
};
const onCancel = () => {
  emit('cancel');
  close();
};

watch(visible, (v) => {
  if (v) place();
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
  document.removeEventListener('keydown', onKey);
});
</script>

<style scoped lang="scss">
.pui-popconfirm { display: inline-flex; }

.pui-popconfirm__pop {
  position: fixed;
  z-index: 2000;
  min-width: 220px;
  max-width: 320px;
  padding: 14px 16px 12px;
  background: var(--pui-bg-elevated, #fff);
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.1));
}

.pui-popconfirm__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--pui-bg-elevated, #fff);
  border: 1px solid var(--pui-border, #e7ecf3);
  transform: rotate(45deg);
}
.is-top .pui-popconfirm__arrow { bottom: -6px; left: 50%; margin-left: -5px; border-top: none; border-left: none; }
.is-bottom .pui-popconfirm__arrow { top: -6px; left: 50%; margin-left: -5px; border-bottom: none; border-right: none; }
.is-left .pui-popconfirm__arrow { right: -6px; top: 50%; margin-top: -5px; border-bottom: none; border-left: none; }
.is-right .pui-popconfirm__arrow { left: -6px; top: 50%; margin-top: -5px; border-top: none; border-right: none; }

.pui-popconfirm__body {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.pui-popconfirm__icon {
  font-size: 16px;
  color: var(--pui-warning, #f57b29);
  margin-top: 1px;
}
.pui-popconfirm__title { font-size: 14px; font-weight: 600; color: var(--pui-text, #1c2534); }
.pui-popconfirm__desc { margin-top: 3px; font-size: 13px; color: var(--pui-text-sub, #5b6879); line-height: 1.5; }
.pui-popconfirm__footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.pui-popconfirm-fade-enter-active,
.pui-popconfirm-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.pui-popconfirm-fade-enter-from,
.pui-popconfirm-fade-leave-to { opacity: 0; transform: scale(0.96); }
</style>
