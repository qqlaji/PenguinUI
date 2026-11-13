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

    <ul
      v-if="indicator !== 'never'"
      class="pui-carousel__indicators"
      :class="`is-${indicatorType}`"
    >
      <li
        v-for="i in count"
        :key="i"
        class="pui-carousel__dot"
        :class="{ active: i - 1 === activeIndex }"
        @click.stop="go(i - 1)"
      >
        <!-- 数字型：直接显示序号 -->
        <template v-if="indicatorType === 'number'">{{ i }}</template>

        <!-- 进度型指示器：激活项内部有一条随时间填满的进度条 -->
        <span
          v-if="indicatorType === 'progress' && i - 1 === activeIndex"
          class="pui-carousel__dot-progress"
          :style="progressStyle"
          :key="`p-${activeIndex}-${progressKey}`"
        ></span>
      </li>
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
  /**
   * 指示器形态：
   *  dot      小圆点（默认）
   *  line     短横线
   *  progress 胶囊形，激活项有填充进度条，可直接看出过渡剩余时间
   *  number   数字 1/5
   */
  indicatorType: { type: String, default: 'dot' },
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

const stop = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  cancelProgress();
};

/* ---------------- 进度指示器 ---------------- */
/*
 * 用 rAF 而不是 CSS 动画，原因：
 * 悬停暂停时进度条要跟着停，恢复时从停下的位置继续。
 * CSS animation 只能 animation-play-state，暂停点与 setInterval 的实际
 * 切换时机容易错位；rAF 自己算比例，和真正切图的时机严格一致。
 */
const progress = ref(0);
const progressKey = ref(0);
let rafId = 0;
let progressStartAt = 0;
/** 暂停时已累积的毫秒数 */
let progressElapsed = 0;

const progressStyle = computed(() => ({ width: `${progress.value * 100}%` }));

function cancelProgress() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

function tickProgress() {
  const total = Math.max(500, props.interval);
  const now = performance.now();
  const elapsed = progressElapsed + (now - progressStartAt);
  progress.value = Math.min(1, elapsed / total);

  if (progress.value >= 1) return;

  rafId = requestAnimationFrame(tickProgress);
}

function runProgress() {
  cancelProgress();
  if (!props.autoplay || count.value <= 1 || hovering.value || props.indicatorType !== 'progress') {
    return;
  }
  progress.value = 0;
  progressElapsed = 0;
  progressStartAt = performance.now();
  rafId = requestAnimationFrame(tickProgress);
}

/** 悬停暂停：记住已走的时间 */
function pauseProgress() {
  if (rafId) {
    progressElapsed += performance.now() - progressStartAt;
    cancelProgress();
  }
}

const start = () => {
  stop();
  if (props.autoplay && count.value > 1 && !hovering.value) {
    timer.value = setInterval(next, Math.max(500, props.interval));
    runProgress();
  }
};
const onEnter = () => {
  hovering.value = true;
  if (props.pauseOnHover) {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
    pauseProgress();
  }
};
const onLeave = () => {
  hovering.value = false;
  if (props.pauseOnHover) {
    start();
  }
};

// 手动切图时重置进度
watch(activeIndex, () => {
  progressKey.value += 1;
  if (!hovering.value) runProgress();
});

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
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    &.active { width: 22px; background: #fff; }
  }

  /* ---------- 指示器：line 短横线 ---------- */
  &__indicators.is-line {
    .pui-carousel__dot {
      width: 18px;
      height: 3px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.42);

      &.active { width: 30px; background: #fff; }
    }
  }

  /* ---------- 指示器：progress 胶囊 + 填充进度 ---------- */
  &__indicators.is-progress {
    gap: 6px;

    .pui-carousel__dot {
      width: 30px;
      height: 5px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.3);
      overflow: hidden;

      &.active {
        width: 46px;
        /* 激活项的底槽比进度条淡，才能看出"已填充"部分 */
        background: rgba(255, 255, 255, 0.28);
      }
    }
  }

  &__dot-progress {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--pui-brand, #0e80eb);
    border-radius: inherit;
    /* 由 rAF 直接写 width，不加 transition 避免和帧更新打架 */
    will-change: width;
  }

  /* ---------- 指示器：number 数字 ---------- */
  &__indicators.is-number {
    align-items: center;

    .pui-carousel__dot {
      width: auto;
      height: auto;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.32);
      color: rgba(255, 255, 255, 0.82);
      font-size: 11px;
      line-height: 1.5;
      font-variant-numeric: tabular-nums;

      &.active {
        width: auto;
        background: var(--pui-brand, #0e80eb);
        color: #fff;
        font-weight: 600;
      }
    }
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

    /* 竖排下 progress / line 的填充方向要变成纵向 */
    .pui-carousel__indicators.is-progress {
      .pui-carousel__dot,
      .pui-carousel__dot.active { width: 5px; height: 30px; }
      .pui-carousel__dot.active { height: 46px; }
    }
    .pui-carousel__dot-progress {
      inset: auto 0 0 0;
      width: 100% !important;
      height: var(--fill, 0%);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-carousel__arrow, .pui-carousel__dot { transition: none; }
}
</style>
