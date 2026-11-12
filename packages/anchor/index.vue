<template>
  <nav ref="rootEl" class="pui-anchor" aria-label="锚点导航">
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="pui-anchor__link"
      :class="{ 'is-active': active === link.href }"
      @click.prevent="go(link)"
    >
      <span class="pui-anchor__dot"></span>
      <span class="pui-anchor__text">{{ link.title }}</span>
    </a>
  </nav>
</template>

<script>
export default { name: 'tAnchor' };
</script>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  links: { type: Array, default: () => [] }, // [{ title, href }]
  offsetTop: { type: Number, default: 80 },
  bounds: { type: Number, default: 5 },
  container: { type: String, default: '' }, // 滚动容器选择器，留空自动向上查找
});

const rootEl = ref(null);
const active = ref(props.links.length ? props.links[0].href : '');
let scroller = null;
let ticking = false;

const findScroller = () => {
  if (props.container) {
    return document.querySelector(props.container) || window;
  }
  let el = rootEl.value ? rootEl.value.parentElement : null;
  while (el && el !== document.body) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 2) return el;
    el = el.parentElement;
  }
  return window;
};

const getScrollTop = () => (scroller === window ? window.scrollY : scroller.scrollTop);
const getScrollerTop = () => (scroller === window ? 0 : scroller.getBoundingClientRect().top);

const update = () => {
  if (!props.links.length) return;
  const base = getScrollerTop() + props.offsetTop + props.bounds;
  let current = props.links[0].href;
  props.links.forEach((link) => {
    const el = document.querySelector(link.href);
    if (!el) return;
    if (el.getBoundingClientRect().top <= base) current = link.href;
  });

  // 滚动到底部时，强制命中最后一项
  if (scroller === window) {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = props.links[props.links.length - 1].href;
    }
  } else if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
    current = props.links[props.links.length - 1].href;
  }
  active.value = current;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    update();
  });
};

const go = (link) => {
  const el = document.querySelector(link.href);
  if (!el || !scroller) return;
  const top =
    scroller === window
      ? el.getBoundingClientRect().top + window.scrollY - props.offsetTop
      : el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - props.offsetTop;
  if (scroller.scrollTo) {
    scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  } else {
    scroller.scrollTop = Math.max(0, top);
  }
  active.value = link.href;
};

onMounted(() => {
  scroller = findScroller();
  if (scroller && scroller.addEventListener) scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
});

onBeforeUnmount(() => {
  if (scroller && scroller.removeEventListener) scroller.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', update);
});
</script>

<style scoped lang="scss">
.pui-anchor {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 12px;
  font-size: 13px;

  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 4px;
    bottom: 4px;
    width: 2px;
    border-radius: 2px;
    background: var(--pui-border, #e7ecf3);
  }
}
.pui-anchor__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  color: var(--pui-text-sub, #5b6879);
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
  }
  &.is-active {
    color: var(--pui-brand, #0e80eb);
    font-weight: 600;

    .pui-anchor__dot {
      background: var(--pui-brand, #0e80eb);
      transform: scale(1.15);
    }
  }
}
.pui-anchor__dot {
  position: absolute;
  left: -12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pui-border-strong, #d8e0ea);
  transition: background 0.15s ease, transform 0.15s ease;
}
.pui-anchor__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
