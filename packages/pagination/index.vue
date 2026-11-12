<template>
  <div
    v-if="!(hideOnSinglePage && pageCount <= 1)"
    class="pui-pagination"
    :class="[
      `pui-pagination--${size}`,
      { 'is-disabled': disabled, 'is-bordered': border }
    ]"
    :style="{ justifyContent: alignMap[align] || 'flex-start', ...cssVars }"
  >
    <span v-if="showTotal" class="pui-pagination__total">共 {{ total }} 条</span>

    <!-- 上一页 -->
    <button
      v-if="prevText"
      type="button"
      class="pui-pagination__text-btn"
      :class="{ 'is-disabled': currentPage <= 1 }"
      :disabled="disabled || currentPage <= 1"
      @click="prev"
    >{{ prevText }}</button>
    <button
      v-else
      type="button"
      class="pui-pagination__arrow"
      aria-label="上一页"
      :disabled="disabled || currentPage <= 1"
      @click="prev"
    >
      <i class="t-icon-arrow-left-bold"></i>
    </button>

    <!-- 页码 -->
    <ul class="pui-pagination__pager">
      <li
        v-for="(item, i) in pages"
        :key="i"
        class="pui-pagination__item"
        :class="{
          'is-active': item.type === 'page' && item.value === currentPage,
          'is-more': item.type === 'more'
        }"
      >
        <span
          v-if="item.type === 'more'"
          class="pui-pagination__more"
          :class="`is-${item.dir}`"
          role="button"
          tabindex="0"
          :aria-label="item.dir === 'prev' ? '向前跳转' : '向后跳转'"
          @click="jumpMore(item.dir)"
          @keydown.enter.prevent="jumpMore(item.dir)"
          @keydown.space.prevent="jumpMore(item.dir)"
        >
          <span class="pui-pagination__more-dots">•••</span>
          <i
            class="pui-pagination__more-arrow"
            :class="item.dir === 'prev' ? 't-icon-arrow-double-left' : 't-icon-arrow-double-right'"
          ></i>
        </span>
        <span
          v-else
          class="pui-pagination__page"
          role="button"
          tabindex="0"
          :aria-current="item.value === currentPage ? 'page' : undefined"
          @click="change(item.value)"
          @keydown.enter.prevent="change(item.value)"
          @keydown.space.prevent="change(item.value)"
        >{{ item.value }}</span>
      </li>
    </ul>

    <!-- 下一页 -->
    <button
      v-if="nextText"
      type="button"
      class="pui-pagination__text-btn"
      :class="{ 'is-disabled': currentPage >= pageCount }"
      :disabled="disabled || currentPage >= pageCount"
      @click="next"
    >{{ nextText }}</button>
    <button
      v-else
      type="button"
      class="pui-pagination__arrow"
      aria-label="下一页"
      :disabled="disabled || currentPage >= pageCount"
      @click="next"
    >
      <i class="t-icon-arrow-right-bold"></i>
    </button>

    <!-- 跳页 -->
    <div v-if="jumper" class="pui-pagination__jumper">
      <span>跳至</span>
      <input
        v-model="jumpValue"
        class="pui-pagination__jump-input"
        type="text"
        inputmode="numeric"
        :disabled="disabled"
        @keydown.enter="commitJump"
        @blur="commitJump"
      />
      <span>页</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tPagination'
};
</script>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  total: { type: Number, default: 0 },
  current: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  /** 页码按钮数量（奇数，5 ~ 21），省略号不计入 */
  pagerCount: { type: Number, default: 9 },
  /** 兼容旧版：等同于 pagerCount */
  maxSize: { type: Number, default: 0 },
  align: { type: String, default: 'left' },
  prevText: String,
  nextText: String,
  disabled: Boolean,
  activeColors: {
    type: Object,
    default: () => ({})
  },
  border: { type: Boolean, default: false },
  size: { type: String, default: 'default' },
  showTotal: Boolean,
  jumper: Boolean,
  /** 每次点击省略号跳过的页数 */
  moreStep: { type: Number, default: 5 },
  /** 只有一页时隐藏 */
  hideOnSinglePage: Boolean
});

const emit = defineEmits(['update:current', 'change']);

const alignMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

const pageCount = computed(() => Math.max(1, Math.ceil((props.total || 0) / (props.pageSize || 10))));

const currentPage = ref(clampPage(props.current));

const realPagerCount = computed(() => {
  let n = props.pagerCount || props.maxSize || 9;
  if (n % 2 === 0) n += 1;
  return Math.min(Math.max(n, 5), 21);
});

function clampPage(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.min(Math.max(Math.round(n), 1), pageCount.value);
}

const pages = computed(() => {
  const total = pageCount.value;
  const pc = realPagerCount.value;
  const cur = currentPage.value;
  const list = [];

  if (total <= pc) {
    for (let i = 1; i <= total; i += 1) list.push({ type: 'page', value: i });
    return list;
  }

  const half = (pc - 1) / 2;
  let start = cur - half;
  let end = cur + half;

  if (start < 1) {
    start = 1;
    end = pc;
  }
  if (end > total) {
    end = total;
    start = total - pc + 1;
  }

  let leftMore = start > 2;
  let rightMore = end < total - 1;

  // 只隔 1 页时直接用页码，不显示省略号
  if (leftMore && start === 3) {
    start = 1;
    leftMore = false;
  }
  if (rightMore && end === total - 2) {
    end = total;
    rightMore = false;
  }

  if (leftMore) {
    list.push({ type: 'page', value: 1 });
    list.push({ type: 'more', dir: 'prev' });
  }
  for (let i = start; i <= end; i += 1) list.push({ type: 'page', value: i });
  if (rightMore) {
    list.push({ type: 'more', dir: 'next' });
    list.push({ type: 'page', value: total });
  }
  return list;
});

watch(
  () => props.current,
  (v) => {
    const next = clampPage(v);
    if (next !== currentPage.value) currentPage.value = next;
  }
);

watch(pageCount, () => {
  currentPage.value = clampPage(currentPage.value);
});

/* ---------- 跳页输入 ---------- */
const jumpValue = ref(String(currentPage.value));
watch(currentPage, (v) => {
  jumpValue.value = String(v);
});

function commitJump() {
  if (props.disabled) return;
  const n = parseInt(jumpValue.value, 10);
  if (!Number.isFinite(n)) {
    jumpValue.value = String(currentPage.value);
    return;
  }
  const target = Math.min(Math.max(n, 1), pageCount.value);
  jumpValue.value = String(target);
  change(target);
}

/* ---------- 交互 ---------- */
function setPage(v) {
  currentPage.value = v;
  emit('update:current', v);
  emit('change', v);
}

function change(v) {
  if (props.disabled) return;
  const target = Math.min(Math.max(v, 1), pageCount.value);
  if (target === currentPage.value) return;
  setPage(target);
}

function prev() {
  if (props.disabled || currentPage.value <= 1) return;
  setPage(currentPage.value - 1);
}

function next() {
  if (props.disabled || currentPage.value >= pageCount.value) return;
  setPage(currentPage.value + 1);
}

function jumpMore(dir) {
  if (props.disabled) return;
  const step = Math.max(1, props.moreStep);
  change(dir === 'prev' ? currentPage.value - step : currentPage.value + step);
}

defineExpose({ change, prev, next, jumpMore });

const cssVars = computed(() => {
  const c = props.activeColors || {};
  return {
    '--pui-pager-active': c.hoverColor || c.color || 'var(--pui-primary, #0e80eb)',
    '--pui-pager-border': c.borderColor || 'var(--pui-border, #e5e6eb)',
    '--pui-pager-bg': c.background || 'var(--pui-bg, #fff)',
    '--pui-pager-hover-bg': c.hoverBackground || 'var(--pui-bg-soft, #f2f5fa)',
    '--pui-pager-color': c.color || 'var(--pui-text-1, #303133)',
    '--pui-pager-hover-color': c.hoverColor || 'var(--pui-primary, #0e80eb)',
    '--pui-pager-hover-border': c.hoverBorderColor || 'var(--pui-primary, #0e80eb)'
  };
});
</script>

<style scoped lang="scss">
.pui-pagination {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  color: var(--pui-pager-color);
  user-select: none;

  &__total {
    margin-right: 8px;
    font-size: 14px;
    color: var(--pui-text-2, #505050);
    white-space: nowrap;
  }

  /* ---------- 上下页箭头 ---------- */
  &__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--pui-text-3, #6b7280);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease;
    &:hover:not(:disabled) {
      color: var(--pui-pager-hover-color);
      background: var(--pui-pager-hover-bg);
    }
    &:disabled {
      color: var(--pui-text-4, #c0c4cc);
      cursor: not-allowed;
      background: transparent;
    }
    &:focus-visible {
      outline: 2px solid var(--pui-primary, #0e80eb);
      outline-offset: 1px;
    }
  }

  &__text-btn {
    height: 32px;
    padding: 0 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--pui-text-2, #505050);
    font-size: 14px;
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease;
    &:hover:not(:disabled) {
      color: var(--pui-pager-hover-color);
      background: var(--pui-pager-hover-bg);
    }
    &.is-disabled,
    &:disabled {
      color: var(--pui-text-4, #c0c4cc);
      cursor: not-allowed;
    }
  }

  /* ---------- 页码列表 ---------- */
  &__pager {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: inline-flex;
  }

  &__page {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    color: var(--pui-pager-color);
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    &:hover {
      color: var(--pui-pager-hover-color);
      background: var(--pui-pager-hover-bg);
    }
    &:focus-visible {
      outline: 2px solid var(--pui-primary, #0e80eb);
      outline-offset: 1px;
    }
  }

  &__item.is-active &__page {
    color: var(--pui-pager-active, var(--pui-primary, #0e80eb));
    font-weight: 600;
    cursor: default;
  }

  /* ---------- 省略号 / 快速跳转 ---------- */
  &__more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    border-radius: 8px;
    color: var(--pui-text-3, #6b7280);
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease;
    outline: none;

    &-dots {
      letter-spacing: 1px;
      font-size: 13px;
      line-height: 1;
    }
    &-arrow {
      display: none;
      font-size: 12px;
    }

    &:hover,
    &:focus-visible {
      color: var(--pui-pager-hover-color);
      background: var(--pui-pager-hover-bg);
      .pui-pagination__more-dots { display: none; }
      .pui-pagination__more-arrow { display: inline-block; }
    }
  }

  /* ---------- 跳页 ---------- */
  &__jumper {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: 8px;
    font-size: 14px;
    color: var(--pui-text-2, #505050);
    white-space: nowrap;
  }

  &__jump-input {
    width: 48px;
    height: 32px;
    padding: 0 6px;
    box-sizing: border-box;
    border: 1px solid var(--pui-pager-border, var(--pui-border, #e5e6eb));
    border-radius: 8px;
    background: var(--pui-pager-bg, var(--pui-bg, #fff));
    color: var(--pui-text-1, #303133);
    font-size: 14px;
    text-align: center;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    &:focus {
      border-color: var(--pui-pager-hover-border, var(--pui-primary, #0e80eb));
      box-shadow: 0 0 0 3px rgba(14, 128, 235, 0.12);
    }
    &:disabled {
      background: var(--pui-bg-soft, #f5f7fa);
      color: var(--pui-text-4, #c0c4cc);
      cursor: not-allowed;
    }
  }

  /* ---------- 小型 ---------- */
  &--small {
    font-size: 13px;
    .pui-pagination__arrow,
    .pui-pagination__page,
    .pui-pagination__more,
    .pui-pagination__text-btn {
      height: 28px;
      min-width: 28px;
      font-size: 13px;
    }
    .pui-pagination__jump-input { height: 28px; width: 42px; font-size: 13px; }
    .pui-pagination__total { font-size: 13px; }
  }

  /* ---------- 带边框形态 ---------- */
  &.is-bordered {
    .pui-pagination__page,
    .pui-pagination__arrow,
    .pui-pagination__text-btn,
    .pui-pagination__more {
      border: 1px solid var(--pui-pager-border, var(--pui-border, #e5e6eb));
      background: var(--pui-pager-bg, var(--pui-bg, #fff));
      color: var(--pui-pager-color);
      &:hover {
        border-color: var(--pui-pager-hover-border, var(--pui-primary, #0e80eb));
        color: var(--pui-pager-hover-color);
        background: var(--pui-pager-hover-bg, var(--pui-bg-soft, #f2f5fa));
      }
      &:disabled {
        background: var(--pui-bg-soft, #f5f7fa);
        color: var(--pui-text-4, #c0c4cc);
        border-color: var(--pui-pager-border, var(--pui-border, #e5e6eb));
      }
    }
    .pui-pagination__item.is-active .pui-pagination__page {
      border-color: var(--pui-pager-hover-border, var(--pui-primary, #0e80eb));
      background: var(--pui-pager-hover-bg, var(--pui-bg-soft, #f2f5fa));
      color: var(--pui-pager-active, var(--pui-primary, #0e80eb));
    }
  }

  /* ---------- 禁用 ---------- */
  &.is-disabled {
    cursor: not-allowed;
    .pui-pagination__page,
    .pui-pagination__arrow,
    .pui-pagination__more,
    .pui-pagination__text-btn {
      color: var(--pui-text-4, #c0c4cc) !important;
      cursor: not-allowed;
      background: transparent !important;
      border-color: var(--pui-border, #e5e6eb) !important;
    }
    .pui-pagination__item.is-active .pui-pagination__page {
      color: var(--pui-text-4, #c0c4cc) !important;
      font-weight: 400;
    }
    .pui-pagination__jump-input {
      background: var(--pui-bg-soft, #f5f7fa);
      cursor: not-allowed;
    }
  }
}

.pui-pagination {
  // 自定义颜色通过内联 CSS 变量注入
  --pui-pager-active: var(--pui-primary, #0e80eb);
}

@media (prefers-reduced-motion: reduce) {
  .pui-pagination * { transition: none !important; }
}
</style>
