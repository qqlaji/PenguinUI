<template>
  <div
    class="pui-carousel"
    :class="[`is-${direction}`, `arrow-${arrow}`, `indicator-${indicator}`]"
    :style="boxStyle"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div class="pui-carousel__track">
      <slot />
    </div>

    <button
      v-if="arrow !== 'never'"
      type="button"
      class="pui-carousel__arrow pui-carousel__arrow--prev"
      aria-label="上一张"
      @click.stop="prev"
    >
      <i class="t-icon-arrow-left-filling"></i>
    </button>
    <button
      v-if="arrow !== 'never'"
      type="button"
      class="pui-carousel__arrow pui-carousel__arrow--next"
      aria-label="下一张"
      @click.stop="next"
    >
      <i class="t-icon-arrow-right-filling"></i>
    </button>

    <ul v-if="indicator !== 'never'" class="pui-carousel__indicators">
      <li
        v-for="i in count"
        :key="i"
        class="pui-carousel__dot"
        :class="{ active: i - 1 === activeIndex }"
        @click.stop="go(i - 1)"
      ></li>
    </ul>
  </div>
</template>

<script>
export default { name: 'tCarousel' };
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';

const props = defineProps({
  height: { type: [Number, String], default: 220 },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 3500 },
  arrow: { type: String, default: 'hover' },
  indicator: { type: String, default: 'always' },
  direction: { type: String, default: 'horizontal' },
  initialIndex: { type: Number, default: 0 },
  pauseOnHover: { type: Boolean, default: true },
});

const count = ref(0);
const activeIndex = ref(props.initialIndex);
const timer = ref(null);
const hovering = ref(false);

/** 统一把 220 / "220" / "220px" / "60vh" 归一化为合法 CSS 高度 */
const boxStyle = computed(() => {
  const raw = props.height;
  if (typeof raw === 'number') return { height: `${raw}px` };
  const str = String(raw == null ? '' : raw).trim();
  if (!str) return { height: '220px' };
  // 纯数字字符串 -> 补 px
  if (/^\d+(\.\d+)?$/.test(str)) return { height: `${str}px` };
  return { height: str };
});

provide('puiCarousel', {
  state: { activeIndex },
  // 返回 0 起始索引，与 activeIndex 对齐
  register: () => {
    const index = count.value;
    count.value += 1;
    return index;
  },
  getCount: () => count.value
});

const go = (i) => {
  const total = count.value;
  if (!total) return;
  activeIndex.value = ((i % total) + total) % total;
};
const next = () => go(activeIndex.value + 1);
const prev = () => go(activeIndex.value - 1);

const stop = () => { if (timer.value) { clearInterval(timer.value); timer.value = null; } };
const start = () => {
  stop();
  if (props.autoplay && count.value > 1 && !hovering.value) {
    timer.value = setInterval(next, Math.max(500, props.interval));
  }
};
const onEnter = () => {
  hovering.value = true;
  if (props.pauseOnHover) stop();
};
const onLeave = () => {
  hovering.value = false;
  if (props.pauseOnHover) start();
};

watch(count, (n) => {
  if (activeIndex.value > n - 1) activeIndex.value = 0;
  start();
});
watch(() => props.autoplay, start);
watch(() => props.interval, start);

onMounted(start);
onBeforeUnmount(stop);

defineExpose({ next, prev, go, start, stop });
</script>

<style scoped lang="scss">
.pui-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: var(--pui-bg-soft, #f7f9fc);

  &__track { position: relative; width: 100%; height: 100%; }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.28);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    opacity: 0;
    transition: opacity 0.2s ease, background 0.2s ease;
    z-index: 2;
    &:hover { background: rgba(0, 0, 0, 0.45); }
    &--prev { left: 12px; }
    &--next { right: 12px; }
  }
  &.arrow-always .pui-carousel__arrow { opacity: 1; }
  &.arrow-hover:hover .pui-carousel__arrow { opacity: 1; }

  &__indicators {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 2;
  }
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: all 0.2s ease;
    &.active { width: 22px; background: #fff; }
  }
  &.indicator-hover .pui-carousel__indicators { opacity: 0; transition: opacity 0.2s ease; }
  &.indicator-hover:hover .pui-carousel__indicators { opacity: 1; }
  &.indicator-never .pui-carousel__indicators { display: none; }

  /* 竖向：指示器靠右竖排 */
  &.is-vertical {
    .pui-carousel__indicators {
      top: 50%;
      right: 12px;
      bottom: auto;
      left: auto;
      transform: translateY(-50%);
      flex-direction: column;
      gap: 10px;
    }
    .pui-carousel__dot.active {
      width: 8px;
      height: 22px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-carousel__arrow, .pui-carousel__dot { transition: none; }
}
</style>
