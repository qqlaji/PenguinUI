<template>
  <div
    ref="wrapEl"
    class="pui-date-picker"
    :class="[
      `pui-date-picker--${size}`,
      {
        'is-disabled': disabled,
        'is-range': range,
        'is-open': visible,
        'is-empty': !hasValue
      }
    ]"
  >
    <div ref="triggerEl" class="pui-date-picker__trigger" @click="onTriggerClick">
      <i class="iconfont t-icon-calendar pui-date-picker__icon"></i>

      <template v-if="range">
        <span class="pui-date-picker__text" :class="{ 'is-placeholder': !displayStart }">
          {{ displayStart || startPlaceholder }}
        </span>
        <span class="pui-date-picker__sep">至</span>
        <span class="pui-date-picker__text" :class="{ 'is-placeholder': !displayEnd }">
          {{ displayEnd || endPlaceholder }}
        </span>
      </template>
      <span v-else class="pui-date-picker__text" :class="{ 'is-placeholder': !displaySingle }">
        {{ displaySingle || placeholder }}
      </span>

      <i
        v-if="clearable && hasValue && !disabled"
        class="iconfont t-icon-close pui-date-picker__clear"
        role="button"
        aria-label="清空"
        @click.stop="clear"
      ></i>
    </div>

    <teleport to="body">
      <transition name="pui-dp-fade">
        <div
          v-if="visible"
          ref="panelEl"
          class="pui-date-picker__panel"
          :style="panelStyle"
          @pointerdown.stop
        >
          <div class="pui-date-picker__main">
            <div class="pui-date-picker__panels">
              <div
                v-for="(p, pi) in panels"
                :key="pi"
                class="pui-date-picker__panel-item"
                :class="{ 'is-second': pi === 1 }"
              >
                <div class="pui-dp__header">
                  <div class="pui-dp__nav">
                    <button
                      v-if="pi === 0"
                      type="button"
                      class="pui-dp__nav-btn"
                      aria-label="上一年"
                      @click="shiftYear(-1)"
                    ><i class="iconfont t-icon-arrow-double-left"></i></button>
                    <button
                      v-if="pi === 0 && viewMode === 'day'"
                      type="button"
                      class="pui-dp__nav-btn"
                      aria-label="上一月"
                      @click="shiftMonth(-1)"
                    ><i class="iconfont t-icon-arrow-left-bold"></i></button>
                  </div>

                  <button type="button" class="pui-dp__label" @click="onLabelClick(pi)">
                    {{ headerLabel(p) }}
                  </button>

                  <div class="pui-dp__nav">
                    <button
                      v-if="pi === panels.length - 1 && viewMode === 'day'"
                      type="button"
                      class="pui-dp__nav-btn"
                      aria-label="下一月"
                      @click="shiftMonth(1)"
                    ><i class="iconfont t-icon-arrow-right-bold"></i></button>
                    <button
                      v-if="pi === panels.length - 1"
                      type="button"
                      class="pui-dp__nav-btn"
                      aria-label="下一年"
                      @click="shiftYear(1)"
                    ><i class="iconfont t-icon-arrow-double-right"></i></button>
                  </div>
                </div>

                <!-- 日视图 -->
                <template v-if="viewMode === 'day'">
                  <div class="pui-dp__week">
                    <span v-for="w in weekLabels" :key="w">{{ w }}</span>
                  </div>
                  <div class="pui-dp__grid" @mouseleave="onGridLeave">
                    <button
                      v-for="cell in daysOf(p)"
                      :key="cell.time"
                      type="button"
                      class="pui-dp__cell"
                      :class="dayClasses(cell)"
                      :disabled="isDisabledDate(cell.date)"
                      @click="pickDay(cell)"
                      @mouseenter="onDayHover(cell)"
                    >
                      <span class="pui-dp__day">{{ cell.date.getDate() }}</span>
                    </button>
                  </div>
                </template>

                <!-- 月视图 -->
                <div v-else-if="viewMode === 'month'" class="pui-dp__grid pui-dp__grid--month">
                  <button
                    v-for="m in 12"
                    :key="m"
                    type="button"
                    class="pui-dp__cell pui-dp__cell--wide"
                    :class="monthClasses(p, m - 1)"
                    :disabled="isDisabledDate(new Date(p.year, m - 1, 1))"
                    @click="onMonthPick(p, m - 1)"
                  >
                    <span class="pui-dp__day">{{ m }} 月</span>
                  </button>
                </div>

                <!-- 年视图 -->
                <div v-else class="pui-dp__grid pui-dp__grid--year">
                  <button
                    v-for="y in 12"
                    :key="y"
                    type="button"
                    class="pui-dp__cell pui-dp__cell--wide"
                    :class="yearClasses(decade + y - 1)"
                    :disabled="isDisabledDate(new Date(decade + y - 1, 0, 1))"
                    @click="onYearPick(decade + y - 1)"
                  >
                    <span class="pui-dp__day">{{ decade + y - 1 }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="showTime" class="pui-date-picker__times">
              <div v-for="idx in timeCount" :key="idx" class="pui-date-picker__time-group">
                <span class="pui-date-picker__time-label">{{ timeLabels[idx - 1] }}</span>
                <t-time-columns
                  :model-value="timeDraft[idx - 1]"
                  @update:model-value="(t) => onTimeUpdate(idx - 1, t)"
                />
              </div>
            </div>
          </div>

          <div v-if="needFooter" class="pui-date-picker__footer">
            <span class="pui-date-picker__preview">{{ footerText }}</span>
            <div class="pui-date-picker__actions">
              <button type="button" class="pui-dp__btn" @click="clear">清空</button>
              <button type="button" class="pui-dp__btn pui-dp__btn--primary" @click="confirm">确定</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default { name: 'tDatePicker' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import tTimeColumns from './timeColumns.vue';

const props = defineProps({
  modelValue: { type: [String, Number, Date, Array], default: null },
  type: { type: String, default: 'date' }, // date | datetime | month | year
  range: { type: Boolean, default: false },
  showTime: { type: Boolean, default: false },
  format: { type: String, default: '' },
  valueFormat: { type: String, default: '' }, // 空=Date 对象；timestamp=时间戳；否则按模式格式化
  placeholder: { type: String, default: '请选择日期' },
  startPlaceholder: { type: String, default: '开始日期' },
  endPlaceholder: { type: String, default: '结束日期' },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'default' },
  disabledDate: { type: Function, default: null },
});

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'visible-change']);

const pad = (n) => String(n).padStart(2, '0');
const mode = computed(() => (props.showTime ? 'datetime' : props.type));
const formatPattern = computed(
  () =>
    props.format ||
    ({
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      month: 'YYYY-MM',
      year: 'YYYY',
    }[mode.value] || 'YYYY-MM-DD')
);

const fmt = (d, pattern) => {
  if (!d) return '';
  return pattern
    .replace('YYYY', String(d.getFullYear()))
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
};

const parse = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : new Date(v);
  if (typeof v === 'number') return new Date(v);
  if (typeof v === 'string') {
    const m = v.match(/(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (m) {
      return new Date(
        Number(m[1]),
        Number(m[2]) - 1,
        m[3] ? Number(m[3]) : 1,
        m[4] ? Number(m[4]) : 0,
        m[5] ? Number(m[5]) : 0,
        m[6] ? Number(m[6]) : 0
      );
    }
    const t = new Date(v).getTime();
    return Number.isNaN(t) ? null : new Date(t);
  }
  return null;
};

const formatOut = (d) => {
  if (!d) return null;
  if (props.valueFormat === 'timestamp') return d.getTime();
  if (props.valueFormat) return fmt(d, props.valueFormat);
  return new Date(d);
};

const rangeValues = computed(() => {
  if (!Array.isArray(props.modelValue)) return [null, null];
  return [parse(props.modelValue[0]), parse(props.modelValue[1])];
});
const singleValue = computed(() => parse(props.modelValue));

const displaySingle = computed(() => (singleValue.value ? fmt(singleValue.value, formatPattern.value) : ''));
const displayStart = computed(() =>
  rangeValues.value[0] ? fmt(rangeValues.value[0], formatPattern.value) : ''
);
const displayEnd = computed(() =>
  rangeValues.value[1] ? fmt(rangeValues.value[1], formatPattern.value) : ''
);
const hasValue = computed(() =>
  props.range ? !!(rangeValues.value[0] || rangeValues.value[1]) : !!singleValue.value
);

/* ---------------- 面板状态 ---------------- */
const wrapEl = ref(null);
const triggerEl = ref(null);
const panelEl = ref(null);
const visible = ref(false);
const pos = reactive({ top: 0, left: 0 });
const panelStyle = computed(() => ({ top: pos.top + 'px', left: pos.left + 'px' }));

const viewYear = ref(new Date().getFullYear());
const viewMonth = ref(new Date().getMonth());
const viewMode = ref('day');
const decade = ref(Math.floor(new Date().getFullYear() / 12) * 12);

const tempStart = ref(null);
const tempEnd = ref(null);
const hoverDate = ref(null);
const timeDraft = ref([
  { h: 0, m: 0, s: 0 },
  { h: 0, m: 0, s: 0 },
]);

const panels = computed(() => {
  const list = [{ year: viewYear.value, month: viewMonth.value }];
  if (props.range) {
    const d = new Date(viewYear.value, viewMonth.value + 1, 1);
    list.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return list;
});

const weekLabels = computed(() => ['一', '二', '三', '四', '五', '六', '日']);
const timeCount = computed(() => (props.range ? 2 : 1));
const timeLabels = computed(() => (props.range ? ['开始时间', '结束时间'] : ['时间']));
const needFooter = computed(() => props.showTime || props.range);

const headerLabel = (p) => {
  if (viewMode.value === 'year') return `${decade.value} - ${decade.value + 11}`;
  if (viewMode.value === 'month') return `${p.year} 年`;
  return `${p.year} 年 ${p.month + 1} 月`;
};

/* ---------------- 单元格计算 ---------------- */
const dayKey = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const sameDay = (a, b) => !!a && !!b && dayKey(a) === dayKey(b);

const daysOf = (p) => {
  const first = new Date(p.year, p.month, 1);
  // 周一为每周第一天
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(p.year, p.month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { date, time: date.getTime(), inMonth: date.getMonth() === p.month };
  });
};

const today = new Date();

const isDisabledDate = (d) => (props.disabledDate ? !!props.disabledDate(new Date(d)) : false);

const isEndpoint = (d) => {
  if (!props.range) return sameDay(d, tempStart.value);
  return sameDay(d, tempStart.value) || sameDay(d, tempEnd.value);
};

const rangeBounds = computed(() => {
  if (!props.range || !tempStart.value) return null;
  const end = tempEnd.value || hoverDate.value;
  if (!end) return { start: tempStart.value, end: tempStart.value };
  return dayKey(tempStart.value) <= dayKey(end)
    ? { start: tempStart.value, end }
    : { start: end, end: tempStart.value };
});

const inRange = (d) => {
  const b = rangeBounds.value;
  if (!b) return false;
  const t = dayKey(d);
  return t > dayKey(b.start) && t < dayKey(b.end);
};

const dayClasses = (cell) => ({
  'is-other': !cell.inMonth,
  'is-today': sameDay(cell.date, today),
  'is-selected': isEndpoint(cell.date),
  'is-in-range': inRange(cell.date),
  'is-range-start':
    props.range && tempEnd.value && rangeBounds.value && dayKey(cell.date) === dayKey(rangeBounds.value.start) && dayKey(rangeBounds.value.start) !== dayKey(rangeBounds.value.end),
  'is-range-end':
    props.range && tempEnd.value && rangeBounds.value && dayKey(cell.date) === dayKey(rangeBounds.value.end) && dayKey(rangeBounds.value.start) !== dayKey(rangeBounds.value.end),
});

const monthClasses = (p, m) => ({
  'is-selected': !!tempStart.value && tempStart.value.getFullYear() === p.year && tempStart.value.getMonth() === m,
});

const yearClasses = (y) => ({
  'is-selected': !!tempStart.value && tempStart.value.getFullYear() === y,
});

/* ---------------- 交互 ---------------- */
const syncTimeDraft = () => {
  const toT = (d) => ({ h: d ? d.getHours() : 0, m: d ? d.getMinutes() : 0, s: d ? d.getSeconds() : 0 });
  timeDraft.value = [toT(tempStart.value), toT(tempEnd.value)];
};

const withDraftTime = (d, idx) => {
  const t = timeDraft.value[idx] || { h: 0, m: 0, s: 0 };
  const nd = new Date(d);
  nd.setHours(t.h, t.m, t.s, 0);
  return nd;
};

const finalizeIfNeeded = () => {
  if (props.showTime || props.range) {
    // 范围模式且未选完整时不自动提交
    if (props.range && (!tempStart.value || !tempEnd.value)) return;
    if (!props.range && !tempStart.value) return;
  }
  if (!props.showTime) {
    commit();
    close();
  }
};

const pickDay = (cell) => {
  if (isDisabledDate(cell.date)) return;
  if (!props.range) {
    tempStart.value = withDraftTime(cell.date, 0);
    if (props.showTime) return;
    commit();
    close();
    return;
  }

  const d = new Date(cell.date);
  if (!tempStart.value || tempEnd.value) {
    tempStart.value = withDraftTime(d, 0);
    tempEnd.value = null;
    hoverDate.value = null;
    if (props.showTime) syncTimeDraft();
    return;
  }
  const end = withDraftTime(d, 1);
  if (dayKey(end) < dayKey(tempStart.value)) {
    tempEnd.value = tempStart.value;
    tempStart.value = end;
  } else {
    tempEnd.value = end;
  }
  hoverDate.value = null;
  if (!props.showTime) {
    commit();
    close();
  }
};

const onDayHover = (cell) => {
  if (!props.range || !tempStart.value || tempEnd.value) return;
  hoverDate.value = cell.date;
};
const onGridLeave = () => { hoverDate.value = null; };

const onMonthPick = (p, m) => {
  if (viewMode.value === 'month') {
    const d = new Date(p.year, m, 1);
    if (props.range) return pickDay({ date: d });
    tempStart.value = d;
    commit();
    close();
    return;
  }
  viewMonth.value = m;
  viewMode.value = 'day';
};

const onYearPick = (y) => {
  if (viewMode.value === 'year') {
    if (props.range) return pickDay({ date: new Date(y, 0, 1) });
    tempStart.value = new Date(y, 0, 1);
    commit();
    close();
    return;
  }
  viewYear.value = y;
  viewMode.value = 'month';
};

const onLabelClick = (pi) => {
  if (props.range || pi !== 0) return;
  if (viewMode.value === 'day') {
    viewMode.value = 'month';
  } else if (viewMode.value === 'month') {
    decade.value = Math.floor(viewYear.value / 12) * 12;
    viewMode.value = 'year';
  }
};

const shiftMonth = (delta) => {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1);
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
};
const shiftYear = (delta) => {
  if (viewMode.value === 'year') {
    decade.value += delta * 12;
    return;
  }
  if (viewMode.value === 'month') {
    viewYear.value += delta;
    return;
  }
  // 日视图：范围模式下推进左侧面板即可，右侧自动 +1 月
  const d = new Date(viewYear.value, viewMonth.value + delta * 12, 1);
  viewYear.value = d.getFullYear();
  viewMonth.value = d.getMonth();
};

const onTimeUpdate = (idx, t) => {
  const next = [...timeDraft.value];
  next[idx] = { ...t };
  timeDraft.value = next;
  const target = idx === 0 ? tempStart : tempEnd;
  if (target.value) {
    const d = new Date(target.value);
    d.setHours(t.h, t.m, t.s, 0);
    target.value = d;
  }
};

const commit = () => {
  if (props.range) {
    if (!tempStart.value || !tempEnd.value) return;
    const a = formatOut(tempStart.value);
    const b = formatOut(tempEnd.value);
    emit('update:modelValue', [a, b]);
    emit('change', [a, b]);
    return;
  }
  if (!tempStart.value) return;
  const v = formatOut(tempStart.value);
  emit('update:modelValue', v);
  emit('change', v);
};

const confirm = () => {
  commit();
  close();
};

const clear = () => {
  const empty = props.range ? [] : null;
  tempStart.value = null;
  tempEnd.value = null;
  emit('update:modelValue', empty);
  emit('change', empty);
  emit('clear');
  close();
};

/* ---------------- 开关与定位 ---------------- */
const placePanel = () => {
  if (!triggerEl.value || !panelEl.value) return;
  const rect = triggerEl.value.getBoundingClientRect();
  const pr = panelEl.value.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (left + pr.width > vw - 8) left = vw - pr.width - 8;
  if (top + pr.height > vh - 8) {
    const above = rect.top - pr.height - 8;
    top = above >= 8 ? above : Math.max(8, vh - pr.height - 8);
  }
  pos.left = Math.max(8, left);
  pos.top = Math.max(8, top);
};

const open = () => {
  if (props.disabled) return;
  if (props.range) {
    tempStart.value = rangeValues.value[0];
    tempEnd.value = rangeValues.value[1];
  } else {
    tempStart.value = singleValue.value;
    tempEnd.value = null;
  }
  syncTimeDraft();
  hoverDate.value = null;
  const base = tempStart.value || new Date();
  viewYear.value = base.getFullYear();
  viewMonth.value = base.getMonth();
  viewMode.value = mode.value === 'month' ? 'month' : mode.value === 'year' ? 'year' : 'day';
  decade.value = Math.floor(viewYear.value / 12) * 12;
  if (triggerEl.value) {
    const r = triggerEl.value.getBoundingClientRect();
    pos.left = r.left;
    pos.top = r.bottom + 8;
  }
  visible.value = true;
  emit('visible-change', true);
  nextTick(placePanel);
};

const close = () => {
  if (!visible.value) return;
  visible.value = false;
  emit('visible-change', false);
};

const onTriggerClick = () => {
  if (props.disabled) return;
  visible.value ? close() : open();
};

const onDocDown = (e) => {
  if (wrapEl.value && wrapEl.value.contains(e.target)) return;
  if (panelEl.value && panelEl.value.contains(e.target)) return;
  close();
};
const onWindowScroll = (e) => {
  if (panelEl.value && panelEl.value.contains(e.target)) return;
  if (visible.value) close();
};
const onResize = () => { if (visible.value) close(); };
const onEsc = (e) => { if (e.key === 'Escape') close(); };

watch(visible, (v) => {
  if (typeof document === 'undefined') return;
  if (v) {
    document.addEventListener('pointerdown', onDocDown, true);
    window.addEventListener('scroll', onWindowScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onEsc);
  } else {
    document.removeEventListener('pointerdown', onDocDown, true);
    window.removeEventListener('scroll', onWindowScroll, true);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onEsc);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocDown, true);
  window.removeEventListener('scroll', onWindowScroll, true);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('keydown', onEsc);
});

/* ---------------- 底部文案 ---------------- */
const footerText = computed(() => {
  if (props.range) {
    const p = props.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    const a = tempStart.value ? fmt(tempStart.value, p) : '开始';
    const b = tempEnd.value ? fmt(tempEnd.value, p) : '结束';
    return `${a} ~ ${b}`;
  }
  return tempStart.value ? fmt(tempStart.value, formatPattern.value) : '请选择日期';
});
</script>

<style scoped lang="scss">
.pui-date-picker {
  display: inline-flex;
  width: 220px;
  height: 36px;
  font-size: 14px;

  &.is-range { width: 380px; }
  &--small { height: 30px; font-size: 13px; }
  &--large { height: 42px; font-size: 14px; }
}

.pui-date-picker__trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  user-select: none;

  &:hover { border-color: var(--pui-brand, #0e80eb); }
}
.pui-date-picker.is-open .pui-date-picker__trigger {
  border-color: var(--pui-brand, #0e80eb);
  box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
}
.pui-date-picker.is-disabled .pui-date-picker__trigger {
  cursor: not-allowed;
  background: var(--pui-bg-soft, #f7f9fc);
  opacity: 0.6;
  border-color: var(--pui-border, #e7ecf3);
}

.pui-date-picker__icon {
  flex: none;
  font-size: 15px;
  color: var(--pui-text-muted, #8b96a6);
}
.pui-date-picker__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--pui-text, #1c2534);
  font-variant-numeric: tabular-nums;

  &.is-placeholder { color: var(--pui-text-muted, #8b96a6); }
}
.pui-date-picker__sep {
  flex: none;
  color: var(--pui-text-muted, #8b96a6);
  font-size: 12px;
}
.pui-date-picker__clear {
  flex: none;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover { color: var(--pui-text-sub, #5b6879); background: rgba(0, 0, 0, 0.06); }
}

/* ---------- 面板 ---------- */
.pui-date-picker__panel {
  position: fixed;
  z-index: 3000;
  padding: 12px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
  box-shadow: 0 18px 48px rgba(24, 44, 78, 0.16);
}
.pui-date-picker__main { display: flex; }
.pui-date-picker__panels { display: flex; }

.pui-date-picker__panel-item {
  width: 264px;

  &.is-second {
    margin-left: 14px;
    padding-left: 14px;
    border-left: 1px solid var(--pui-border, #e7ecf3);
  }
}

.pui-dp__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  margin-bottom: 6px;
}
.pui-dp__nav { display: flex; gap: 2px; min-width: 52px; }
.pui-dp__nav:last-child { justify-content: flex-end; }
.pui-dp__nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--pui-text-sub, #5b6879);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  i { font-size: 12px; }
  &:hover { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); color: var(--pui-brand, #0e80eb); }
}
.pui-dp__label {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 0;
  transition: background 0.15s ease;

  &:hover { background: var(--pui-bg-soft, #f7f9fc); }
}

.pui-dp__week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: 28px;
  align-items: center;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  text-align: center;
}
.pui-dp__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;
}
.pui-dp__grid--month,
.pui-dp__grid--year {
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding-top: 8px;
  min-height: 216px;
  align-content: start;
}

.pui-dp__cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--pui-text, #1c2534);
  border-radius: 8px;

  &.is-other { color: var(--pui-text-muted, #8b96a6); }
  &:disabled { color: var(--pui-text-muted, #8b96a6); opacity: 0.4; cursor: not-allowed; }
  &:not(:disabled):hover .pui-dp__day { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12)); }

  &.is-in-range { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12)); border-radius: 0; }
  &.is-range-start { background: linear-gradient(90deg, transparent 50%, var(--pui-brand-soft, rgba(14, 128, 235, 0.12)) 50%); }
  &.is-range-end { background: linear-gradient(270deg, transparent 50%, var(--pui-brand-soft, rgba(14, 128, 235, 0.12)) 50%); }
}
.pui-dp__cell--wide {
  height: 44px;
  background: var(--pui-bg-soft, #f7f9fc);
  border-radius: 8px;
}

.pui-dp__day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-variant-numeric: tabular-nums;
  transition: background 0.15s ease, color 0.15s ease;
}
.pui-dp__cell--wide .pui-dp__day { width: 100%; height: 100%; border-radius: 8px; }

.pui-dp__cell.is-today .pui-dp__day {
  color: var(--pui-brand, #0e80eb);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px var(--pui-brand, #0e80eb);
}
.pui-dp__cell.is-selected .pui-dp__day,
.pui-dp__cell.is-selected.is-today .pui-dp__day {
  background: var(--pui-brand, #0e80eb);
  color: #fff;
  font-weight: 600;
  box-shadow: none;
}

/* ---------- 时间列 ---------- */
.pui-date-picker__times {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}
.pui-date-picker__time-group { display: flex; flex-direction: column; }
.pui-date-picker__time-label {
  height: 24px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  text-align: center;
}

/* ---------- 底部 ---------- */
.pui-date-picker__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--pui-border, #e7ecf3);
}
.pui-date-picker__preview {
  font-size: 12px;
  color: var(--pui-text-sub, #5b6879);
  font-variant-numeric: tabular-nums;
}
.pui-date-picker__actions { display: flex; gap: 8px; }
.pui-dp__btn {
  height: 30px;
  padding: 0 14px;
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  border-radius: 8px;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text-sub, #5b6879);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { border-color: var(--pui-brand, #0e80eb); color: var(--pui-brand, #0e80eb); }
}
.pui-dp__btn--primary {
  background: var(--pui-brand, #0e80eb);
  border-color: var(--pui-brand, #0e80eb);
  color: #fff;

  &:hover { background: var(--pui-brand-strong, #0a68c4); border-color: var(--pui-brand-strong, #0a68c4); color: #fff; }
}

/* ---------- 动画 ---------- */
.pui-dp-fade-enter-active,
.pui-dp-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.pui-dp-fade-enter-from,
.pui-dp-fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
  .pui-date-picker__trigger,
  .pui-dp-fade-enter-active,
  .pui-dp-fade-leave-active { transition: none; }
}
</style>
