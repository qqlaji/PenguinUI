<template>
  <span :class="['pui-countdown', customClass, { 'is-finish': finished }]" :style="rootStyle">
    <template v-for="(unit, i) in displayUnits" :key="unit.key">
      <span class="pui-countdown__unit">
        <span v-if="unitLabel" class="pui-countdown__label">{{ unit.label }}</span>
        <span class="pui-countdown__num" :style="numStyle">{{ unit.value }}</span>
      </span>
      <span v-if="i < displayUnits.length - 1" class="pui-countdown__sep">{{ separator }}</span>
    </template>

    <span v-if="finished && finishText" class="pui-countdown__finish">{{ finishText }}</span>
  </span>
</template>

<script>
export default {
  name: 'tCountdown'
};
</script>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 目标时间：Date / 时间戳 / ISO 字符串 */
  value: { type: [Date, Number, String], default: () => Date.now() + 3600 * 1000 },
  /** 单位：天 时 分 秒 */
  format: { type: String, default: 'DD:HH:mm:ss' }, // 出现哪些单位就显示哪些
  /** 分隔符 */
  separator: { type: String, default: ':' },
  /** 是否在数字前显示单位文字（天 / 时 / 分 / 秒） */
  unitLabel: { type: Boolean, default: false },
  /** 数字是否补零 */
  pad: { type: Boolean, default: true },
  /** 到达目标时间后的文案 */
  finishText: { type: String, default: '' },
  /** 数字字号 */
  fontSize: { type: [Number, String], default: '' },
  /** 数字字色 */
  color: { type: String, default: '' },
  /** 数字底板（等宽数字块） */
  bordered: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['finish', 'change']);

const remain = ref(0);
const finished = ref(false);
let timer = null;

const target = computed(() => {
  const v = props.value;
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'number') return v;
  const t = new Date(v).getTime();
  return isNaN(t) ? Date.now() : t;
});

const toPx = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const rootStyle = computed(() => ({
  fontSize: toPx(props.fontSize) || undefined,
  color: props.color || undefined
}));

const numStyle = computed(() => {
  if (!props.bordered) return {};
  return {
    padding: '1px 6px',
    borderRadius: '6px',
    background: 'var(--pui-bg-soft, #f7f9fc)',
    fontVariantNumeric: 'tabular-nums'
  };
});

const pad2 = (n) => (props.pad ? String(n).padStart(2, '0') : String(n));

const units = computed(() => {
  const total = Math.max(0, Math.floor(remain.value / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const f = props.format.toUpperCase();

  return [
    { key: 'd', show: f.includes('D'), label: '天', value: pad2(d) },
    { key: 'h', show: f.includes('H'), label: '时', value: pad2(h) },
    { key: 'm', show: f.includes('M'), label: '分', value: pad2(m) },
    { key: 's', show: f.includes('S'), label: '秒', value: pad2(s) }
  ];
});

/** 只保留 format 里出现过的单位，分隔符数量据此计算才不会错位 */
const displayUnits = computed(() => units.value.filter((u) => u.show));

function tick() {
  const left = target.value - Date.now();
  remain.value = left > 0 ? left : 0;
  emit('change', remain.value);

  if (left <= 0 && !finished.value) {
    finished.value = true;
    stop();
    emit('finish');
  }
}

function start() {
  stop();
  finished.value = false;
  tick();
  if (!finished.value) {
    timer = setInterval(tick, 1000);
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

watch(target, start, { immediate: true });

onBeforeUnmount(stop);

defineExpose({ start, stop });
</script>

<style scoped lang="scss">
.pui-countdown {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--pui-text, #1c2534);
  font-variant-numeric: tabular-nums;

  &__unit {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
  }

  &__num {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  &__label {
    margin-right: 3px;
    font-size: 0.62em;
    font-weight: 500;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__sep {
    margin: 0 2px;
    color: var(--pui-text-muted, #8b96a6);
    font-weight: 500;
  }

  &__finish {
    margin-left: 6px;
    font-size: 0.8em;
    font-weight: 500;
    color: var(--pui-danger, #ec3437);
  }

  &.is-finish &__num {
    color: var(--pui-text-muted, #8b96a6);
  }
}
</style>
