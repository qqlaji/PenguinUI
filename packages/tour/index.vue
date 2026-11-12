<template>
  <teleport to="body">
    <div v-if="visible && step" class="pui-tour" :style="{ zIndex: Number(zIndex) }" @keydown="onKeydown">
      <template v-if="mask">
        <div class="pui-tour__mask" :style="maskStyles.top" @click="onMaskClick"></div>
        <div class="pui-tour__mask" :style="maskStyles.bottom" @click="onMaskClick"></div>
        <div class="pui-tour__mask" :style="maskStyles.left" @click="onMaskClick"></div>
        <div class="pui-tour__mask" :style="maskStyles.right" @click="onMaskClick"></div>
      </template>
      <div v-else class="pui-tour__mask pui-tour__mask--full" @click="onMaskClick"></div>

      <div v-if="hasTarget" class="pui-tour__spotlight" :style="spotlightStyle"></div>

      <div
        ref="cardRef"
        class="pui-tour__card"
        :class="{ 'is-centered': !hasTarget }"
        :style="cardStyle"
        role="dialog"
        aria-modal="true"
        :aria-label="step.title"
      >
        <div class="pui-tour__head">
          <span v-if="step.icon" class="pui-tour__icon">
            <i :class="['iconfont', step.icon]" aria-hidden="true"></i>
          </span>
          <div class="pui-tour__titles">
            <h4 class="pui-tour__title">{{ step.title }}</h4>
            <span class="pui-tour__counter">{{ current + 1 }} / {{ steps.length }}</span>
          </div>
          <button v-if="closable" type="button" class="pui-tour__close" aria-label="关闭" @click="close">
            <i class="iconfont t-icon-close" aria-hidden="true"></i>
          </button>
        </div>

        <div v-if="step.description || $slots.description || $slots.default" class="pui-tour__body">
          <slot name="description" :step="step" :index="current">{{ step.description }}</slot>
          <slot :step="step" :index="current"></slot>
        </div>

        <div class="pui-tour__footer">
          <div v-if="showIndicator" class="pui-tour__dots">
            <span
              v-for="(s, i) in steps"
              :key="i"
              class="pui-tour__dot"
              :class="{ 'is-active': i === current, 'is-done': i < current }"
              role="button"
              :aria-label="`第 ${i + 1} 步`"
              @click="goTo(i)"
            ></span>
          </div>
          <span v-else></span>

          <div class="pui-tour__actions">
            <button v-if="current > 0" type="button" class="pui-tour__btn" @click="prev">
              {{ prevText }}
            </button>
            <button type="button" class="pui-tour__btn pui-tour__btn--primary" @click="next">
              {{ isLast ? finishText : nextText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'tTour'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 是否显示 */
  modelValue: { type: Boolean, default: false },
  /** 步骤：{ target, title, description, placement, icon } */
  steps: { type: Array, default: () => [] },
  /** 当前步骤（支持 v-model:current） */
  current: { type: Number, default: null },
  /** 是否显示遮罩 */
  mask: { type: Boolean, default: true },
  /** 点击遮罩关闭 */
  maskClosable: { type: Boolean, default: false },
  closable: { type: Boolean, default: true },
  /** 显示步骤指示点 */
  showIndicator: { type: Boolean, default: true },
  /** 高亮区域外扩距离 */
  gap: { type: Number, default: 8 },
  zIndex: { type: [Number, String], default: 2100 },
  /** 切换步骤时把目标滚动到视口 */
  scrollIntoView: { type: Boolean, default: true },
  nextText: { type: String, default: '下一步' },
  prevText: { type: String, default: '上一步' },
  finishText: { type: String, default: '完成' },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'update:current', 'change', 'finish', 'close']);

const cardRef = ref(null);
const inner = ref(0);
const rect = ref(null);
const cardStyle = ref({});
const targetEl = ref(null);

const visible = computed(() => props.modelValue && props.steps.length > 0);

const current = computed(() => {
  const c = props.current === null || props.current === undefined ? inner.value : props.current;
  if (!props.steps.length) return 0;
  return Math.min(Math.max(0, c), props.steps.length - 1);
});

const step = computed(() => props.steps[current.value] || null);
const isLast = computed(() => current.value >= props.steps.length - 1);
const hasTarget = computed(() => {
  if (!rect.value) return false;
  return rect.value.width > 0 || rect.value.height > 0;
});

/* ---------------- 遮罩与高亮 ---------------- */
const maskStyles = computed(() => {
  const r = rect.value;
  if (!r || !hasTarget.value) {
    return {
      top: { inset: '0px' },
      bottom: { display: 'none' },
      left: { display: 'none' },
      right: { display: 'none' }
    };
  }
  const g = props.gap;
  const top = Math.max(0, r.top - g);
  const bottom = r.bottom + g;
  const left = Math.max(0, r.left - g);
  const right = r.right + g;
  return {
    top: { top: '0px', left: '0px', right: '0px', height: `${top}px` },
    bottom: { top: `${bottom}px`, left: '0px', right: '0px', bottom: '0px' },
    left: { top: `${top}px`, left: '0px', width: `${left}px`, height: `${Math.max(0, bottom - top)}px` },
    right: { top: `${top}px`, left: `${right}px`, right: '0px', height: `${Math.max(0, bottom - top)}px` }
  };
});

const spotlightStyle = computed(() => {
  const r = rect.value;
  if (!r) return { display: 'none' };
  const g = props.gap;
  return {
    top: `${r.top - g}px`,
    left: `${r.left - g}px`,
    width: `${r.width + g * 2}px`,
    height: `${r.height + g * 2}px`
  };
});

/* ---------------- 目标解析 ---------------- */
function resolveTarget(target) {
  if (!target) return null;
  if (typeof target === 'function') return resolveTarget(target());
  if (typeof target === 'string') return document.querySelector(target);
  if (target instanceof Element) return target;
  if (target.$el) return target.$el;
  return null;
}

function measure() {
  const el = targetEl.value;
  if (!el || !document.body.contains(el)) {
    rect.value = null;
  } else {
    const r = el.getBoundingClientRect();
    rect.value = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  }
  nextTick(place);
}

/* ---------------- 卡片定位 ---------------- */
const OFFSET = 14;

function place() {
  const card = cardRef.value;
  if (!card || !step.value) return;

  const cw = card.offsetWidth;
  const ch = card.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 12;

  const r = rect.value;
  if (!r || !hasTarget.value) {
    cardStyle.value = {
      left: `${Math.max(margin, (vw - cw) / 2)}px`,
      top: `${Math.max(margin, (vh - ch) / 2)}px`
    };
    return;
  }

  let placement = step.value.placement || 'bottom';
  const spaceBottom = vh - r.bottom;
  const spaceTop = r.top;

  if (placement === 'bottom' && r.bottom + OFFSET + ch > vh - margin && spaceTop > spaceBottom) placement = 'top';
  if (placement === 'top' && r.top - OFFSET - ch < margin && spaceBottom > spaceTop) placement = 'bottom';
  if (placement === 'right' && r.right + OFFSET + cw > vw - margin) placement = 'left';
  if (placement === 'left' && r.left - OFFSET - cw < margin) placement = 'right';

  let left = 0;
  let top = 0;

  if (placement === 'top') {
    left = r.left + r.width / 2 - cw / 2;
    top = r.top - OFFSET - ch;
  } else if (placement === 'left') {
    left = r.left - OFFSET - cw;
    top = r.top + r.height / 2 - ch / 2;
  } else if (placement === 'right') {
    left = r.right + OFFSET;
    top = r.top + r.height / 2 - ch / 2;
  } else {
    left = r.left + r.width / 2 - cw / 2;
    top = r.bottom + OFFSET;
  }

  left = Math.max(margin, Math.min(left, vw - cw - margin));
  top = Math.max(margin, Math.min(top, vh - ch - margin));

  cardStyle.value = { left: `${left}px`, top: `${top}px` };
}

/* ---------------- 生命周期 ---------------- */
let rafId = null;
function onViewportChange() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    measure();
  });
}

function bindGlobal() {
  window.addEventListener('scroll', onViewportChange, true);
  window.addEventListener('resize', onViewportChange);
  document.addEventListener('keydown', onKeydown);
}

function unbindGlobal() {
  window.removeEventListener('scroll', onViewportChange, true);
  window.removeEventListener('resize', onViewportChange);
  document.removeEventListener('keydown', onKeydown);
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

async function update() {
  if (!visible.value) return;
  targetEl.value = resolveTarget(step.value && step.value.target);

  if (targetEl.value && props.scrollIntoView) {
    const r = targetEl.value.getBoundingClientRect();
    const inView = r.top >= 0 && r.bottom <= window.innerHeight;
    if (!inView) {
      targetEl.value.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    }
  }

  await nextTick();
  measure();
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.current === null || props.current === undefined) inner.value = 0;
      bindGlobal();
      nextTick(update);
    } else {
      unbindGlobal();
    }
  }
);

watch(current, (val, old) => {
  if (val === old) return;
  emit('change', val);
  if (visible.value) nextTick(update);
});

watch(
  () => props.current,
  (val) => {
    if (val !== null && val !== undefined) inner.value = val;
  }
);

onBeforeUnmount(unbindGlobal);

/* ---------------- 交互 ---------------- */
function goTo(index) {
  if (index < 0 || index >= props.steps.length) return;
  inner.value = index;
  emit('update:current', index);
}

function next() {
  if (isLast.value) {
    emit('finish');
    close();
    return;
  }
  goTo(current.value + 1);
}

function prev() {
  if (current.value > 0) goTo(current.value - 1);
}

function close() {
  emit('update:modelValue', false);
  emit('close', current.value);
}

function onMaskClick() {
  if (props.maskClosable) close();
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    close();
  } else if (e.key === 'ArrowRight') {
    next();
  } else if (e.key === 'ArrowLeft') {
    prev();
  }
}

defineExpose({ next, prev, goTo, close, update });
</script>

<style scoped lang="scss">
.pui-tour {
  position: fixed;
  inset: 0;
  pointer-events: none;

  &__mask {
    position: fixed;
    background: var(--pui-mask, rgba(18, 28, 45, 0.55));
    pointer-events: auto;
    transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1);

    &--full {
      inset: 0;
    }
  }

  &__spotlight {
    position: fixed;
    border-radius: 12px;
    box-shadow: 0 0 0 2px var(--pui-brand, #0e80eb), 0 0 0 6px var(--pui-brand-soft, rgba(14, 128, 235, 0.16));
    pointer-events: none;
    transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__card {
    position: fixed;
    width: 320px;
    box-sizing: border-box;
    padding: 16px 16px 14px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 14px;
    background: var(--pui-bg-elevated, #fff);
    box-shadow: var(--pui-shadow-lg, 0 24px 60px rgba(24, 44, 78, 0.24));
    pointer-events: auto;
    transition: top 0.24s cubic-bezier(0.4, 0, 0.2, 1), left 0.24s cubic-bezier(0.4, 0, 0.2, 1);

    &.is-centered {
      width: 360px;
    }
  }

  &__head {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  &__icon {
    flex: none;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
    color: var(--pui-brand, #0e80eb);
    font-size: 15px;
  }

  &__titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
    color: var(--pui-text, #1c2534);
  }

  &__counter {
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    font-variant-numeric: tabular-nums;
  }

  &__close {
    flex: none;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;

    &:hover {
      color: var(--pui-text, #1c2534);
      background: var(--pui-bg-soft, #f7f9fc);
    }
  }

  &__body {
    margin-top: 10px;
    font-size: 13px;
    line-height: 1.75;
    color: var(--pui-text-sub, #5b6879);
    word-break: break-word;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 16px;
  }

  &__dots {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--pui-border-strong, #d8e0ea);
    cursor: pointer;
    transition: all 0.2s ease;

    &.is-done {
      background: var(--pui-brand-glow, rgba(14, 128, 235, 0.4));
    }
    &.is-active {
      width: 16px;
      background: var(--pui-brand, #0e80eb);
    }
  }

  &__actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  &__btn {
    height: 30px;
    padding: 0 14px;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 9px;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text, #1c2534);
    font-family: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.16s ease;

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
      color: var(--pui-brand, #0e80eb);
    }

    &--primary {
      border-color: transparent;
      background: var(--pui-brand, #0e80eb);
      color: #fff;

      &:hover {
        background: var(--pui-brand-strong, #0a68c4);
        color: #fff;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-tour__card,
  .pui-tour__mask,
  .pui-tour__spotlight {
    transition: none;
  }
}
</style>
