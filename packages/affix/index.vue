<template>
  <div ref="wrapRef" class="pui-affix" :style="wrapStyle">
    <div
      ref="contentRef"
      class="pui-affix__content"
      :class="{ 'is-affixed': affixed }"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default { name: 'tAffix' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  offsetTop: { type: Number, default: 0 },
  offsetBottom: { type: Number, default: 0 },
  target: { type: String, default: '' }, // 滚动容器选择器，默认 window
  zIndex: { type: Number, default: 100 }
});

const emit = defineEmits(['change']);

const wrapRef = ref(null);
const contentRef = ref(null);
const affixed = ref(false);
const width = ref(0);
const left = ref(0);
const wrapHeight = ref(0);

const wrapStyle = computed(() => (affixed.value ? { height: wrapHeight.value + 'px' } : {}));

const contentStyle = computed(() => {
  if (!affixed.value) return {};
  if (props.offsetBottom > 0) {
    return {
      position: 'fixed',
      bottom: props.offsetBottom + 'px',
      left: left.value + 'px',
      width: width.value + 'px',
      zIndex: props.zIndex
    };
  }
  return {
    position: 'fixed',
    top: props.offsetTop + 'px',
    left: left.value + 'px',
    width: width.value + 'px',
    zIndex: props.zIndex
  };
});

let scrollTarget = null;
let raf = null;

// 未显式指定 target 时，自动向上查找最近的可滚动祖先，找不到则回退到 window
function findScrollParent(el) {
  let p = el && el.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const style = getComputedStyle(p);
    const oy = style.overflowY;
    if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return window;
}

function getScrollTarget() {
  if (props.target && typeof document !== 'undefined') {
    try {
      return document.querySelector(props.target) || window;
    } catch (e) {
      return window;
    }
  }
  return findScrollParent(wrapRef.value);
}

function update() {
  if (typeof window === 'undefined') return;
  const wrap = wrapRef.value;
  const content = contentRef.value;
  if (!wrap || !content) return;
  const rect = wrap.getBoundingClientRect();
  const vh = window.innerHeight;

  if (props.offsetBottom > 0) {
    const should = rect.bottom >= vh - props.offsetBottom;
    if (should && !affixed.value) {
      width.value = rect.width;
      left.value = rect.left;
      wrapHeight.value = content.offsetHeight;
      affixed.value = true;
      emit('change', true);
    } else if (should && affixed.value) {
      width.value = rect.width;
      left.value = rect.left;
    } else if (!should && affixed.value) {
      affixed.value = false;
      emit('change', false);
    }
    return;
  }

  const shouldAffix = rect.top <= props.offsetTop;
  if (shouldAffix && !affixed.value) {
    width.value = rect.width;
    left.value = rect.left;
    wrapHeight.value = content.offsetHeight;
    affixed.value = true;
    emit('change', true);
  } else if (shouldAffix && affixed.value) {
    width.value = rect.width;
    left.value = rect.left;
  } else if (!shouldAffix && affixed.value) {
    affixed.value = false;
    emit('change', false);
  }
}

function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = null;
    update();
  });
}

function bind() {
  scrollTarget = getScrollTarget();
  if (scrollTarget) scrollTarget.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}
function unbind() {
  if (scrollTarget) scrollTarget.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
}

onMounted(async () => {
  await nextTick();
  bind();
  update();
});

onBeforeUnmount(() => {
  unbind();
  if (raf) cancelAnimationFrame(raf);
});

watch(
  () => props.target,
  () => {
    unbind();
    bind();
    update();
  }
);

defineExpose({ update });
</script>

<style scoped lang="scss">
.pui-affix {
  position: relative;
  &__content {
    box-sizing: border-box;
    &.is-affixed {
      box-shadow: var(--pui-shadow-sm, 0 2px 10px rgba(24, 44, 78, 0.06));
    }
  }
}
</style>
