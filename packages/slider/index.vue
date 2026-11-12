<template>
  <div
    class="pui-slider"
    :class="{
      'is-disabled': disabled,
      'pui-slider--vertical': vertical,
      'pui-slider--range': range,
      'pui-slider--with-input': showInput,
      'pui-slider--with-marks': hasMarks
    }"
  >
    <div class="pui-slider__body">
      <div
        ref="railEl"
        class="pui-slider__rail"
        :style="vertical ? { height: height + 'px' } : {}"
        @pointerdown="onRailDown"
      >
        <div class="pui-slider__fill" :style="fillStyle"></div>

        <template v-if="showStops">
          <span
            v-for="stop in stops"
            :key="'s' + stop"
            class="pui-slider__stop"
            :style="stopStyle(stop)"
          ></span>
        </template>

        <template v-if="hasMarks">
          <span
            v-for="m in markList"
            :key="'m' + m.value"
            class="pui-slider__mark-dot"
            :style="stopStyle(m.value)"
          ></span>
        </template>

        <button
          v-for="(val, i) in values"
          :key="'h' + i"
          :ref="(el) => setHandleRef(el, i)"
          type="button"
          class="pui-slider__handle"
          :style="handleStyle(val)"
          role="slider"
          :aria-valuenow="val"
          :aria-valuemin="i === 0 ? min : values[0]"
          :aria-valuemax="i === values.length - 1 ? max : values[values.length - 1]"
          :aria-disabled="disabled"
          :aria-orientation="vertical ? 'vertical' : 'horizontal'"
          :aria-valuetext="formatValue(val)"
          @pointerdown.stop="onHandleDown($event, i)"
          @pointerenter="showTip(i)"
          @pointerleave="hideTip"
          @focus="showTip(i)"
          @blur="hideTip"
          @keydown.left.prevent="onKey(i, -step)"
          @keydown.down.prevent="onKey(i, -step)"
          @keydown.right.prevent="onKey(i, step)"
          @keydown.up.prevent="onKey(i, step)"
          @keydown.home.prevent="onKeyTo(i, min)"
          @keydown.end.prevent="onKeyTo(i, max)"
        ></button>
      </div>

      <div v-if="hasMarks" class="pui-slider__marks">
        <span
          v-for="m in markList"
          :key="'ml' + m.value"
          class="pui-slider__mark"
          :class="{ 'is-active': isMarkActive(m.value) }"
          :style="marksStyle(m.value)"
          @click="onMarkClick(m.value)"
        >{{ m.label }}</span>
      </div>
    </div>

    <div v-if="showInput" class="pui-slider__inputs">
      <t-input-number
        v-for="(val, i) in values"
        :key="'in' + i"
        class="pui-slider__input"
        :model-value="val"
        :min="i === 0 ? min : values[0]"
        :max="i === values.length - 1 ? max : values[values.length - 1]"
        :step="step"
        size="small"
        :disabled="disabled"
        @update:model-value="(v) => onInputUpdate(i, v)"
      />
    </div>

    <teleport to="body">
      <div
        v-if="tip.visible"
        class="pui-slider__tooltip"
        :class="{ 'is-vertical': vertical }"
        :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
      >
        {{ tip.text }}
      </div>
    </teleport>
  </div>
</template>

<script>
export default { name: 'tSlider' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import tInputNumber from '../inputNumber/index.vue';

const props = defineProps({
  modelValue: { type: [Number, Array], default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  range: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showInput: { type: Boolean, default: false },
  showStops: { type: Boolean, default: false },
  marks: { type: Object, default: null },
  vertical: { type: Boolean, default: false },
  height: { type: Number, default: 200 },
  formatTooltip: { type: Function, default: null },
});

const emit = defineEmits(['update:modelValue', 'change', 'input']);

const railEl = ref(null);
const handleEls = [];
const setHandleRef = (el, i) => { if (el) handleEls[i] = el; };
const dragging = ref(false);
const dragIndex = ref(0);

const span = computed(() => props.max - props.min || 1);

const decimals = computed(() => {
  const s = String(props.step);
  return s.includes('.') ? s.split('.')[1].length : 0;
});
const round = (v) => Number(v.toFixed(decimals.value));
const clamp = (v) => Math.min(props.max, Math.max(props.min, v));
const snap = (v) => {
  const c = clamp(v);
  return round(clamp(props.min + Math.round((c - props.min) / props.step) * props.step));
};
const pct = (v) => ((v - props.min) / span.value) * 100;

// 统一的取值数组：单值 [v]，范围 [start, end]
const values = computed(() => {
  if (props.range) {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : [props.min, props.max];
    const a = typeof arr[0] === 'number' ? arr[0] : props.min;
    const b = typeof arr[1] === 'number' ? arr[1] : props.max;
    return [Math.min(a, b), Math.max(a, b)];
  }
  return [typeof props.modelValue === 'number' ? props.modelValue : props.min];
});

const fillStyle = computed(() => {
  // 单值：从最小值画到当前值；范围：从起点画到终点
  const from = props.range ? pct(values.value[0]) : 0;
  const to = pct(values.value[values.value.length - 1]);
  return props.vertical
    ? { bottom: from + '%', height: to - from + '%', left: 0, width: '100%' }
    : { left: from + '%', width: to - from + '%', top: 0, height: '100%' };
});

const handleStyle = (val) =>
  props.vertical
    ? { bottom: pct(val) + '%', left: '50%' }
    : { left: pct(val) + '%', top: '50%' };

const stops = computed(() => {
  if (props.step <= 0) return [];
  const count = Math.floor(span.value / props.step);
  if (count > 200) return [];
  const arr = [];
  for (let i = 1; i < count; i++) arr.push(round(props.min + i * props.step));
  return arr;
});
const stopStyle = (val) => {
  const p = pct(val);
  return props.vertical
    ? { bottom: p + '%', left: '50%' }
    : { left: p + '%', top: '50%' };
};

// ---- marks ----
const hasMarks = computed(() => !!props.marks && Object.keys(props.marks).length > 0);
const markList = computed(() => {
  if (!hasMarks.value) return [];
  return Object.keys(props.marks)
    .map((k) => {
      const v = Number(k);
      const raw = props.marks[k];
      const label = raw && typeof raw === 'object' ? raw.label : raw;
      return { value: v, label: label === undefined || label === null ? String(v) : label };
    })
    .filter((m) => !Number.isNaN(m.value) && m.value >= props.min && m.value <= props.max)
    .sort((a, b) => a.value - b.value);
});
const marksStyle = (val) => {
  const p = pct(val);
  return props.vertical
    ? { bottom: p + '%', left: '100%' }
    : { left: p + '%', top: '100%' };
};
const isMarkActive = (val) => {
  const lo = props.range ? values.value[0] : props.min;
  const hi = values.value[values.value.length - 1];
  return val <= hi && val >= lo;
};
const onMarkClick = (val) => {
  if (props.disabled) return;
  if (!props.range) return setValue(0, val, true);
  // 范围模式下点击刻度：把较近的端点移过去
  const i = Math.abs(val - values.value[0]) <= Math.abs(val - values.value[1]) ? 0 : 1;
  setValue(i, val, true);
};

// ---- 数值写入 ----
const emitValue = (arr) => {
  const next = props.range ? arr : arr[0];
  emit('update:modelValue', next);
  emit('input', next);
};
const setValue = (index, val, fireChange = false) => {
  const next = snap(val);
  const arr = [...values.value];
  if (next === arr[index]) return;
  arr[index] = next;
  // 保证 start <= end
  if (arr[0] > arr[1]) {
    if (index === 0) arr[1] = arr[0];
    else arr[0] = arr[1];
  }
  emitValue(arr);
  if (fireChange) emit('change', props.range ? arr : arr[0]);
};
const onInputUpdate = (i, v) => {
  if (typeof v !== 'number' || Number.isNaN(v)) return;
  setValue(i, v, true);
};

// ---- 指针交互 ----
const valueFromEvent = (e) => {
  const rect = railEl.value.getBoundingClientRect();
  let ratio;
  if (props.vertical) ratio = 1 - (e.clientY - rect.top) / rect.height;
  else ratio = (e.clientX - rect.left) / rect.width;
  ratio = Math.min(1, Math.max(0, ratio));
  return props.min + ratio * span.value;
};
const nearestIndex = (val) => {
  if (!props.range) return 0;
  return Math.abs(val - values.value[0]) <= Math.abs(val - values.value[1]) ? 0 : 1;
};

const onRailDown = (e) => {
  if (props.disabled) return;
  const val = valueFromEvent(e);
  const i = nearestIndex(val);
  setValue(i, val, false);
  onHandleDown(e, i);
};
const onHandleDown = (e, i) => {
  if (props.disabled) return;
  dragIndex.value = i;
  dragging.value = true;
  showTip(i);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
};
const onMove = (e) => {
  if (!dragging.value) return;
  setValue(dragIndex.value, valueFromEvent(e));
  showTip(dragIndex.value);
};
const onUp = () => {
  if (!dragging.value) return;
  dragging.value = false;
  emit('change', props.range ? [...values.value] : values.value[0]);
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
  hideTip();
};

// ---- 键盘 ----
const onKey = (i, delta) => {
  if (props.disabled) return;
  setValue(i, values.value[i] + delta, true);
  showTip(i);
};
const onKeyTo = (i, target) => {
  if (props.disabled) return;
  setValue(i, target, true);
  showTip(i);
};

// ---- tooltip（teleport 到 body，避免被示例容器裁切/遮挡）----
const tip = reactive({ visible: false, x: 0, y: 0, text: '' });
const formatValue = (v) => (props.formatTooltip ? props.formatTooltip(v) : v);
let tipSeq = 0;

const showTip = (i) => {
  const seq = ++tipSeq;
  // 等父组件回传新的 modelValue、手柄位置更新后再读值定位
  nextTick(() => {
    if (seq !== tipSeq) return;
    const el = handleEls[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    tip.text = formatValue(values.value[i]);
    if (props.vertical) {
      tip.x = rect.right + 10;
      tip.y = rect.top + rect.height / 2;
    } else {
      tip.x = rect.left + rect.width / 2;
      tip.y = rect.top - 8;
    }
    tip.visible = true;
  });
};
const hideTip = () => {
  tipSeq++;
  tip.visible = false;
};

watch(
  () => props.disabled,
  (v) => { if (v) hideTip(); }
);

// 页面滚动时固定定位的 tooltip 会失准，直接隐藏
const onScrollHide = () => { if (tip.visible) hideTip(); };
watch(
  () => tip.visible,
  (v) => {
    if (v) window.addEventListener('scroll', onScrollHide, true);
    else window.removeEventListener('scroll', onScrollHide, true);
  }
);
onBeforeUnmount(() => window.removeEventListener('scroll', onScrollHide, true));
</script>

<style scoped lang="scss">
.pui-slider {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 6px 0;

  &--with-input { max-width: 460px; }
  &--vertical { width: auto; height: auto; align-items: flex-end; }
  &--with-marks { padding-bottom: 2px; }
}
.pui-slider__body {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}
.pui-slider--vertical .pui-slider__body { flex: none; }
.pui-slider--with-marks .pui-slider__body { padding-bottom: 22px; }

.pui-slider__rail {
  position: relative;
  flex: 1;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--pui-border, #e7ecf3);
  cursor: pointer;
  touch-action: none;
}
.pui-slider--vertical .pui-slider__rail {
  width: 6px;
  flex: none;
  margin: 0 auto;
}

.pui-slider__fill {
  position: absolute;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--pui-brand, #0e80eb), var(--pui-brand-strong, #0a68c4));
}
.pui-slider--vertical .pui-slider__fill {
  background: linear-gradient(0deg, var(--pui-brand, #0e80eb), var(--pui-brand-strong, #0a68c4));
}

.pui-slider__stop,
.pui-slider__mark-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
}
.pui-slider__stop {
  background: var(--pui-bg-elevated, #fff);
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  transform: translate(-50%, -50%);
  z-index: 1;
}
.pui-slider__mark-dot {
  width: 8px;
  height: 8px;
  background: var(--pui-border-strong, #d8e0ea);
  transform: translate(-50%, -50%);
  z-index: 1;
}
.pui-slider--vertical .pui-slider__stop { transform: translate(-50%, 50%); }
.pui-slider--vertical .pui-slider__mark-dot { transform: translate(-50%, 50%); }

.pui-slider__handle {
  position: absolute;
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 50%;
  background: var(--pui-bg-elevated, #fff);
  border: 2px solid var(--pui-brand, #0e80eb);
  box-shadow: var(--pui-shadow-sm, 0 2px 10px rgba(24, 44, 78, 0.06));
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 2;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover { box-shadow: 0 0 0 6px var(--pui-brand-soft, rgba(14, 128, 235, 0.12)); }
  &:focus-visible { outline: none; box-shadow: 0 0 0 6px var(--pui-brand-soft, rgba(14, 128, 235, 0.18)); }
  &:active { cursor: grabbing; }
}
.pui-slider--vertical .pui-slider__handle { transform: translate(-50%, 50%); }

.pui-slider__marks {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 18px;
  pointer-events: none;
}
.pui-slider__mark {
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  color: var(--pui-text-muted, #8b96a6);
  pointer-events: auto;
  cursor: pointer;
  transition: color 0.15s ease;

  &.is-active { color: var(--pui-brand, #0e80eb); }
  &:hover { color: var(--pui-brand, #0e80eb); }
}
.pui-slider--vertical .pui-slider__marks {
  left: auto;
  right: auto;
  bottom: 0;
  top: 0;
  width: 0;
}
.pui-slider--vertical .pui-slider__mark {
  transform: translateY(50%);
  line-height: 1;
  padding-left: 4px;
}

.pui-slider__inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
.pui-slider__input { width: 104px; }

.pui-slider.is-disabled {
  .pui-slider__rail { cursor: not-allowed; opacity: 0.5; }
  .pui-slider__handle { cursor: not-allowed; border-color: var(--pui-text-muted, #8b96a6); box-shadow: none; }
  .pui-slider__mark { cursor: not-allowed; }
}

/* tooltip 挂载在 body 上（仍带 scoped 属性），定位由 JS 计算 */
.pui-slider__tooltip {
  position: fixed;
  z-index: 3000;
  padding: 4px 9px;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  color: #fff;
  background: rgba(28, 37, 52, 0.92);
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(24, 44, 78, 0.18);
  pointer-events: none;
  transform: translate(-50%, -100%);

  &.is-vertical { transform: translate(0, -50%); }
}

@media (prefers-reduced-motion: reduce) {
  .pui-slider__handle, .pui-slider__mark { transition: none; }
}
</style>
