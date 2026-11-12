<template>
  <div class="pui-calendar" :class="{ 'is-small': size === 'small' }">
    <!-- 头部 -->
    <div class="pui-calendar__header">
      <div class="pui-calendar__title">
        <button type="button" class="pui-calendar__nav" aria-label="上一年" @click="shiftYear(-1)">
          <i class="t-icon-arrow-double-left"></i>
        </button>
        <button type="button" class="pui-calendar__nav" aria-label="上一月" @click="shiftMonth(-1)">
          <i class="t-icon-arrow-left-bold"></i>
        </button>
        <span class="pui-calendar__label">{{ viewYear }} 年 {{ viewMonth + 1 }} 月</span>
        <button type="button" class="pui-calendar__nav" aria-label="下一月" @click="shiftMonth(1)">
          <i class="t-icon-arrow-right-bold"></i>
        </button>
        <button type="button" class="pui-calendar__nav" aria-label="下一年" @click="shiftYear(1)">
          <i class="t-icon-arrow-double-right"></i>
        </button>
      </div>
      <div class="pui-calendar__actions">
        <slot name="header" :date="selectedDate" />
        <button v-if="showToday" type="button" class="pui-calendar__today" @click="goToday">今天</button>
      </div>
    </div>

    <!-- 星期 -->
    <div class="pui-calendar__weekdays">
      <span v-for="w in weekLabels" :key="w" class="pui-calendar__weekday">{{ w }}</span>
    </div>

    <!-- 日期网格 -->
    <div class="pui-calendar__grid">
      <div
        v-for="cell in days"
        :key="cell.key"
        class="pui-calendar__cell"
        :class="{
          'is-other': cell.isOther,
          'is-today': cell.isToday,
          'is-selected': cell.isSelected,
          'is-disabled': cell.isDisabled,
          'is-weekend': cell.isWeekend
        }"
        role="button"
        :tabindex="cell.isDisabled ? -1 : 0"
        :aria-selected="cell.isSelected"
        :aria-disabled="cell.isDisabled"
        @click="pick(cell)"
        @keydown.enter.prevent="pick(cell)"
        @keydown.space.prevent="pick(cell)"
      >
        <span class="pui-calendar__day">
          <slot name="cell" :cell="cell" :date="cell.date">
            {{ cell.day }}
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'tCalendar' };
</script>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  /** 选中日期，支持 Date 或 'YYYY-MM-DD' */
  modelValue: { type: [Date, String], default: null },
  /** 每周第一天：0 周日，1 周一 */
  firstDayOfWeek: { type: Number, default: 1 },
  showToday: { type: Boolean, default: true },
  /** 禁用日期，返回 true 表示禁用 */
  disabledDate: { type: Function, default: null },
  size: { type: String, default: 'default' }
});

const emit = defineEmits(['update:modelValue', 'change', 'select']);

const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

const pad = (n) => String(n).padStart(2, '0');
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function parse(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : startOfDay(value);
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

const selectedDate = ref(parse(props.modelValue));
const today = startOfDay(new Date());

const viewYear = ref((selectedDate.value || today).getFullYear());
const viewMonth = ref((selectedDate.value || today).getMonth());

watch(
  () => props.modelValue,
  (v) => {
    const next = parse(v);
    selectedDate.value = next;
    if (next) {
      viewYear.value = next.getFullYear();
      viewMonth.value = next.getMonth();
    }
  }
);

const weekLabels = computed(() => {
  const start = ((props.firstDayOfWeek % 7) + 7) % 7;
  return Array.from({ length: 7 }, (_, i) => WEEK[(start + i) % 7]);
});

const days = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const startOffset = ((first.getDay() - props.firstDayOfWeek) % 7 + 7) % 7;
  const gridStart = new Date(viewYear.value, viewMonth.value, 1 - startOffset);
  const selectedKey = selectedDate.value ? toKey(selectedDate.value) : null;
  const todayKey = toKey(today);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const key = toKey(date);
    const isDisabled = props.disabledDate ? !!props.disabledDate(date) : false;
    return {
      key,
      date,
      day: date.getDate(),
      isOther: date.getMonth() !== viewMonth.value,
      isToday: key === todayKey,
      isSelected: key === selectedKey,
      isDisabled,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    };
  });
});

function shiftMonth(delta) {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1);
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
}

function shiftYear(delta) {
  viewYear.value += delta;
}

function goToday() {
  const d = startOfDay(new Date());
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
  pick({ date: d, isDisabled: false });
}

function pick(cell) {
  if (!cell || cell.isDisabled) return;
  selectedDate.value = startOfDay(cell.date);
  viewYear.value = cell.date.getFullYear();
  viewMonth.value = cell.date.getMonth();
  const key = toKey(selectedDate.value);
  emit('update:modelValue', key);
  emit('change', key, selectedDate.value);
  emit('select', selectedDate.value);
}

defineExpose({ goToday, shiftMonth, shiftYear });
</script>

<style scoped lang="scss">
.pui-calendar {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 12px;
  background: var(--pui-bg, #fff);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__label {
    min-width: 108px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--pui-text-1, #1f2329);
  }

  &__nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--pui-text-3, #6b7280);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease;
    &:hover {
      color: var(--pui-primary, #0e80eb);
      background: var(--pui-bg-soft, #f2f5fa);
    }
    &:focus-visible {
      outline: 2px solid var(--pui-primary, #0e80eb);
      outline-offset: 1px;
    }
  }

  &__actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  &__today {
    height: 28px;
    padding: 0 12px;
    border: 1px solid var(--pui-border, #e5e6eb);
    border-radius: 8px;
    background: var(--pui-bg, #fff);
    color: var(--pui-text-2, #505050);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      border-color: var(--pui-primary, #0e80eb);
      color: var(--pui-primary, #0e80eb);
    }
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    margin-bottom: 4px;
  }

  &__weekday {
    padding: 6px 0;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--pui-text-3, #8a9099);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
  }

  &__cell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
    outline: none;

    &:hover:not(.is-disabled):not(.is-selected) {
      background: var(--pui-bg-soft, #f2f5fa);
    }
    &:focus-visible {
      outline: 2px solid var(--pui-primary, #0e80eb);
      outline-offset: -2px;
    }
  }

  &__day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    border-radius: 8px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: var(--pui-text-1, #303133);
    transition: all 0.18s ease;
  }

  &__cell.is-weekend &__day {
    color: var(--pui-text-2, #6b7280);
  }

  &__cell.is-other {
    .pui-calendar__day {
      color: var(--pui-text-4, #c0c4cc);
    }
  }

  &__cell.is-today &__day {
    color: var(--pui-primary, #0e80eb);
    font-weight: 700;
    box-shadow: inset 0 0 0 1px var(--pui-primary, #0e80eb);
  }

  &__cell.is-selected {
    background: var(--pui-primary-soft, #e8f3ff);
    .pui-calendar__day {
      color: #fff;
      background: var(--pui-primary, #0e80eb);
      font-weight: 600;
      box-shadow: none;
    }
  }

  &__cell.is-disabled {
    cursor: not-allowed;
    background: transparent;
    .pui-calendar__day {
      color: var(--pui-text-4, #d4d7de);
      text-decoration: line-through;
    }
  }

  &.is-small {
    padding: 12px;
    .pui-calendar__cell { min-height: 34px; }
    .pui-calendar__day { min-width: 24px; height: 24px; font-size: 12px; }
    .pui-calendar__label { font-size: 14px; min-width: 96px; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-calendar * { transition: none !important; }
}
</style>
