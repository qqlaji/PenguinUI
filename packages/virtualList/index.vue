<template>
  <div
    ref="wrapRef"
    :class="['pui-virtual-list', customClass]"
    :style="wrapStyle"
    @scroll.passive="onScroll"
  >
    <div class="pui-virtual-list__spacer" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="item in visibleItems"
        :key="item.key"
        class="pui-virtual-list__item"
        :data-index="item.index"
        :style="itemStyle(item.index)"
      >
        <slot :item="item.data" :index="item.index">
          {{ item.data }}
        </slot>
      </div>
    </div>

    <div v-if="!data.length" class="pui-virtual-list__empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tVirtualList'
};
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  /** 数据源 */
  data: { type: Array, default: () => [] },
  /**
   * 单项高度（px）。传数字为定高模式（性能最好）；
   * 传 0 或 null 则按 itemSize 估算并开启动态测量
   */
  itemHeight: { type: [Number, String], default: 40 },
  /** 可视区域高度，不传则取容器自身高度 */
  height: { type: [Number, String], default: 320 },
  /** 上下额外渲染的缓冲条数 */
  buffer: { type: Number, default: 4 },
  /** 取唯一值的字段名，缺省用索引 */
  itemKey: { type: String, default: '' },
  /** 空状态文案 */
  emptyText: { type: String, default: '暂无数据' },
  /** 滚动到底部阈值（px），用于触发 load-more */
  distance: { type: Number, default: 40 },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['scroll', 'load-more', 'change']);

const wrapRef = ref(null);
const scrollTop = ref(0);

/** 动态高度模式下实测到的真实高度，index -> height */
const measured = reactive({});

const toPx = (v) => {
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const baseHeight = computed(() => {
  const h = Number(props.itemHeight);
  return h > 0 ? h : 40;
});

/** 是否开启动态测量 */
const dynamic = computed(() => !(Number(props.itemHeight) > 0));

const wrapStyle = computed(() => ({ height: toPx(props.height) }));

const itemStyle = (index) => {
  // 每项绝对定位到自己的偏移位置，避免「holder 位移 + 文档流」双重叠加
  const top = offsets.value[index] || 0;
  if (!dynamic.value) {
    return { position: 'absolute', top: `${top}px`, left: '0', right: '0', height: `${baseHeight.value}px` };
  }
  // 动态模式用 min-height 而非 height，否则内容会被裁掉、永远测不出真实高度
  return {
    position: 'absolute',
    top: `${top}px`,
    left: '0',
    right: '0',
    minHeight: `${baseHeight.value}px`
  };
};

const offsets = computed(() => {
  const n = props.data.length;
  const out = new Array(n + 1).fill(0);
  if (!dynamic.value) {
    for (let i = 0; i <= n; i += 1) out[i] = i * baseHeight.value;
    return out;
  }
  for (let i = 0; i < n; i += 1) {
    out[i + 1] = out[i] + (measured[i] || baseHeight.value);
  }
  return out;
});

const totalHeight = computed(() => {
  if (!dynamic.value) return props.data.length * baseHeight.value;
  return offsets.value[props.data.length] || 0;
});

const viewport = computed(() => {
  const h = Number(props.height);
  if (h > 0) return h;
  return wrapRef.value ? wrapRef.value.clientHeight : 320;
});

/** 二分查找：找到第一个 bottom > scrollTop 的项 */
function findStart(top) {
  const arr = offsets.value;
  let lo = 0;
  let hi = props.data.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid + 1] <= top) lo = mid + 1;
    else hi = mid;
  }
  return Math.min(lo, props.data.length);
}

const visibleItems = computed(() => {
  const n = props.data.length;
  if (!n) return [];

  const start = Math.max(0, findStart(scrollTop.value) - props.buffer);
  const end = Math.min(n, findStart(scrollTop.value + viewport.value) + props.buffer + 1);

  const out = [];
  for (let i = start; i < end; i += 1) {
    const raw = props.data[i];
    const key = props.itemKey && raw && typeof raw === 'object' ? raw[props.itemKey] : i;
    out.push({ index: i, data: raw, key });
  }
  return out;
});

/* ---------------- 滚动 ---------------- */
let rafId = null;
function onScroll(e) {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const el = wrapRef.value;
    if (!el) return;
    scrollTop.value = el.scrollTop;
    emit('scroll', e);
    emit('change', visibleItems.value.map((v) => v.index));

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - props.distance) {
      emit('load-more');
    }
  });
}

/* ---------------- 动态高度测量 ---------------- */
let ro = null;

function measure() {
  const el = wrapRef.value;
  if (!el || !dynamic.value) return;
  const nodes = el.querySelectorAll('.pui-virtual-list__item');
  let changed = false;
  nodes.forEach((node) => {
    const index = Number(node.dataset.index);
    const h = node.offsetHeight;
    if (h > 0 && measured[index] !== h) {
      measured[index] = h;
      changed = true;
    }
  });
  // 已滚出视口的项也要保留已测高度，否则回滚时会跳动；
  // 只清理超出数据范围的脏数据
  Object.keys(measured).forEach((k) => {
    if (Number(k) >= props.data.length) delete measured[k];
  });
  return changed;
}

onMounted(async () => {
  await nextTick();
  measure();
  if (dynamic.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => measure());
    if (wrapRef.value) ro.observe(wrapRef.value);
  }
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
});

watch(
  () => props.data.length,
  async () => {
    await nextTick();
    measure();
  }
);

watch(visibleItems, async () => {
  if (!dynamic.value) return;
  await nextTick();
  const changed = measure();
  if (changed) {
    // 高度变化会让后续项下移，需按新的总高度重算一次，避免抖动
    await nextTick();
  }
});

/* ---------------- 对外方法 ---------------- */
function scrollToIndex(index) {
  const el = wrapRef.value;
  if (!el) return;
  const top = offsets.value[Math.max(0, Math.min(index, props.data.length - 1))] || 0;
  el.scrollTop = top;
  scrollTop.value = top;
}

function scrollToTop() {
  scrollToIndex(0);
}

function scrollToBottom() {
  const el = wrapRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
  scrollTop.value = el.scrollTop;
}

defineExpose({ scrollToIndex, scrollToTop, scrollToBottom, wrapRef });
</script>

<style scoped lang="scss">
.pui-virtual-list {
  position: relative;
  overflow-y: auto;
  box-sizing: border-box;
  overscroll-behavior: contain;

  &__spacer {
    position: relative;
    width: 100%;
  }

  &__item {
    box-sizing: border-box;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }
}
</style>
