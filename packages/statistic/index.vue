<template>
  <div class="pui-statistic">
    <div v-if="title || $slots.title" class="pui-statistic__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="pui-statistic__value" :style="valueStyle">
      <span v-if="prefix || $slots.prefix" class="pui-statistic__prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      <span class="pui-statistic__number">{{ display }}</span>
      <span v-if="suffix || $slots.suffix" class="pui-statistic__suffix">
        <slot name="suffix">{{ suffix }}</slot>
      </span>
    </div>
  </div>
</template>

<script>
export default { name: 'tStatistic' };
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  value: { type: Number, default: 0 },
  title: { type: String, default: '' },
  precision: { type: Number, default: 0 },
  separator: { type: Boolean, default: true },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  groupSeparator: { type: String, default: ',' },
  decimalSeparator: { type: String, default: '.' },
  valueStyle: { type: Object, default: () => ({}) },
  countUp: { type: Boolean, default: false },
  duration: { type: Number, default: 1200 },
  formatter: { type: Function, default: null }
});

const current = ref(props.countUp ? 0 : props.value);
let raf = null;
let startTime = 0;
let fromValue = 0;
let toValue = props.value;

function animate(from, to) {
  if (typeof requestAnimationFrame === 'undefined') {
    current.value = to;
    return;
  }
  cancelAnimationFrame(raf);
  fromValue = from;
  toValue = to;
  startTime = 0;
  const dur = Math.max(1, props.duration);
  const step = (t) => {
    if (!startTime) startTime = t;
    const p = Math.min(1, (t - startTime) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    current.value = fromValue + (toValue - fromValue) * eased;
    if (p < 1) {
      raf = requestAnimationFrame(step);
    } else {
      current.value = toValue;
    }
  };
  raf = requestAnimationFrame(step);
}

onMounted(() => {
  if (props.countUp) animate(0, props.value);
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
});

watch(
  () => props.value,
  (v) => {
    if (props.countUp) animate(current.value, v);
    else current.value = v;
  }
);

const display = computed(() => {
  if (props.formatter) return props.formatter(current.value);
  const n = Number(current.value);
  if (!isFinite(n)) return '-';
  let s = n.toFixed(props.precision);
  let neg = false;
  if (s.charAt(0) === '-') {
    neg = true;
    s = s.slice(1);
  }
  const parts = s.split('.');
  let int = parts[0];
  const dec = parts[1];
  if (props.separator) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator);
  let out = dec !== undefined ? int + props.decimalSeparator + dec : int;
  return neg ? '-' + out : out;
});
</script>

<style scoped lang="scss">
.pui-statistic {
  display: inline-block;
  min-width: 0;

  &__title {
    font-size: 14px;
    color: var(--pui-text-sub, #5b6879);
    margin-bottom: 6px;
    line-height: 1.4;
  }

  &__value {
    display: inline-flex;
    align-items: baseline;
    gap: 3px;
    font-size: 26px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--pui-text, #1c2534);
  }

  &__number {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.2px;
  }

  &__prefix,
  &__suffix {
    font-size: 0.72em;
    font-weight: 500;
    color: var(--pui-text-sub, #5b6879);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-statistic * {
    transition: none !important;
  }
}
</style>
