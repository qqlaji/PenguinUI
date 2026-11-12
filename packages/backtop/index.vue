<template>
  <transition name="pui-backtop-fade">
    <div
      v-if="backtopShow"
      class="penguin-backtop-box"
      :class="[customClass, { 'is-inline': !fixed, 'has-custom': !!slots.default }]"
      :style="boxStyle"
      role="button"
      tabindex="0"
      aria-label="回到顶部"
      @click="backtop"
      @keydown.enter.prevent="backtop"
      @keydown.space.prevent="backtop"
    >
      <slot>
        <span class="penguin-backtop-default-box">
          <i class="iconfont t-icon-arrow-up-filling"></i>
        </span>
      </slot>
    </div>
  </transition>
</template>

<script>
export default { name: 'tBacktop' };
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';

const props = defineProps({
  // 'body' / 'window' 表示页面滚动；其余为 CSS 选择器，监听指定容器
  target: { type: String, default: 'body' },
  visibilityHeight: { type: Number, default: 240 },
  right: { type: Number, default: 24 },
  bottom: { type: Number, default: 40 },
  // false 时气泡相对最近的定位祖先定位，便于在文档示例中内嵌展示
  fixed: { type: Boolean, default: true },
  customClass: { type: String, default: '' },
});
const emit = defineEmits(['click']);
const slots = useSlots();

const backtopShow = ref(false);
let scroller = null;
let rafId = 0;

const boxStyle = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}));

const isWindow = () => props.target === 'body' || props.target === 'window';

const resolveScroller = () => {
  if (isWindow()) return typeof window !== 'undefined' ? window : null;
  if (typeof document === 'undefined') return null;
  // 选择器写错时不再抛错，只是安静地不显示
  try { return document.querySelector(props.target); } catch { return null; }
};

const getScrollTop = () => {
  if (!scroller) return 0;
  if (isWindow()) {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return scroller.scrollTop || 0;
};

const updateVisible = () => {
  backtopShow.value = getScrollTop() >= props.visibilityHeight;
};

// 用 requestAnimationFrame 做平滑滚动，兼容 window 与普通容器
const backtop = () => {
  emit('click');
  const start = getScrollTop();
  if (start <= 0) return;
  cancelAnimationFrame(rafId);
  const duration = 320;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(start * (1 - eased));
    if (isWindow()) window.scrollTo(0, value);
    else if (scroller) scroller.scrollTop = value;
    if (p < 1) rafId = requestAnimationFrame(step);
    else updateVisible();
  };
  rafId = requestAnimationFrame(step);
};

onMounted(() => {
  scroller = resolveScroller();
  if (scroller) scroller.addEventListener('scroll', updateVisible, { passive: true });
  // 关键：挂载时立即计算一次，文档示例不需要先滚动才能看到按钮
  updateVisible();
  window.addEventListener('resize', updateVisible);
});
onBeforeUnmount(() => {
  if (scroller) scroller.removeEventListener('scroll', updateVisible);
  if (typeof window !== 'undefined') window.removeEventListener('resize', updateVisible);
  cancelAnimationFrame(rafId);
});
</script>

<style lang="scss" scoped>
.penguin-backtop-box {
  position: fixed;
  z-index: 900;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: var(--pui-brand, #0e80eb);
  box-shadow: 0 8px 22px rgba(14, 128, 235, 0.32);
  cursor: pointer;
  outline: none;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.2s ease, background 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(14, 128, 235, 0.42);
  }
  &:focus-visible {
    outline: 2px solid var(--pui-brand, #0e80eb);
    outline-offset: 3px;
  }
  &.is-inline { position: absolute; }
  // 使用自定义插槽时让容器退到幕后，只展示用户自己的图形
  &.has-custom {
    background: transparent;
    box-shadow: none;
    &:hover { transform: none; box-shadow: none; }
  }
}
.penguin-backtop-default-box {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  & i { font-size: 19px; line-height: 1; color: #fff; }
}
.pui-backtop-fade-enter-active,
.pui-backtop-fade-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.pui-backtop-fade-enter-from,
.pui-backtop-fade-leave-to { opacity: 0; transform: translateY(10px) scale(0.9); }

@media (prefers-reduced-motion: reduce) {
  .penguin-backtop-box,
  .pui-backtop-fade-enter-active,
  .pui-backtop-fade-leave-active { transition: none; }
}
</style>
