<template>
  <div ref="rootRef" class="pui-time-picker" :class="{ 'is-disabled': disabled, 'is-open': open }">
    <div class="pui-time-picker__control" @click="toggle">
      <i class="t-icon-time pui-time-picker__icon"></i>
      <span v-if="modelValue" class="pui-time-picker__value">{{ modelValue }}</span>
      <span v-else class="pui-time-picker__placeholder">{{ placeholder }}</span>
      <i
        v-if="clearable && modelValue"
        class="t-icon-close pui-time-picker__clear"
        @click.stop="clear"
      ></i>
    </div>

    <teleport to="body">
      <transition name="pui-tp-fade">
        <div v-if="open" ref="panelRef" class="pui-time-picker__panel" :style="panelStyle">
          <div class="pui-time-picker__cols">
            <div class="pui-time-picker__col" ref="hourCol">
              <div
                v-for="h in 24"
                :key="'h' + h"
                class="pui-time-picker__cell"
                :class="{ active: parts.h === h - 1 }"
                @click="pick('h', h - 1)"
              >{{ pad(h - 1) }}</div>
            </div>
            <div class="pui-time-picker__col" ref="minCol">
              <div
                v-for="m in 60"
                :key="'m' + m"
                class="pui-time-picker__cell"
                :class="{ active: parts.m === m - 1 }"
                @click="pick('m', m - 1)"
              >{{ pad(m - 1) }}</div>
            </div>
            <div v-if="withSeconds" class="pui-time-picker__col" ref="secCol">
              <div
                v-for="s in 60"
                :key="'s' + s"
                class="pui-time-picker__cell"
                :class="{ active: parts.s === s - 1 }"
                @click="pick('s', s - 1)"
              >{{ pad(s - 1) }}</div>
            </div>
          </div>
          <div class="pui-time-picker__footer">
            <span class="pui-time-picker__now" @click="now">此刻</span>
            <span class="pui-time-picker__ok" @click="closePanel">确定</span>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default { name: 'tTimePicker' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  format: { type: String, default: 'HH:mm' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  placeholder: { type: String, default: '选择时间' },
});
const emit = defineEmits(['update:modelValue', 'change']);
const rootRef = ref(null);
const panelRef = ref(null);
const open = ref(false);
const panelStyle = ref({});

const withSeconds = computed(() => props.format.includes('ss'));

const parse = (str) => {
  if (!str) return { h: 0, m: 0, s: 0 };
  const [h, m, s] = str.split(':').map(Number);
  return { h: h || 0, m: m || 0, s: s || 0 };
};
const parts = ref(parse(props.modelValue));

watch(() => props.modelValue, (v) => { parts.value = parse(v); });

const pad = (n) => String(n).padStart(2, '0');
const build = () =>
  withSeconds.value
    ? `${pad(parts.value.h)}:${pad(parts.value.m)}:${pad(parts.value.s)}`
    : `${pad(parts.value.h)}:${pad(parts.value.m)}`;

const pick = (k, val) => {
  parts.value[k] = val;
  const next = build();
  emit('update:modelValue', next);
  emit('change', next);
};
const now = () => {
  const d = new Date();
  parts.value = { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
  const next = build();
  emit('update:modelValue', next);
  emit('change', next);
};
const clear = () => { emit('update:modelValue', ''); emit('change', ''); };

const place = async () => {
  await nextTick();
  const trig = rootRef.value?.getBoundingClientRect();
  const panel = panelRef.value?.getBoundingClientRect();
  if (!trig || !panel) return;
  let top = trig.bottom + 6;
  if (top + panel.height > window.innerHeight - 8) top = trig.top - panel.height - 6;
  let left = trig.left;
  if (left + panel.width > window.innerWidth - 8) left = window.innerWidth - panel.width - 8;
  panelStyle.value = { top: `${top}px`, left: `${left}px` };
  // 滚动到已选位置
  nextTick(() => {
    scrollTo('hourCol', parts.value.h);
    scrollTo('minCol', parts.value.m);
    if (withSeconds.value) scrollTo('secCol', parts.value.s);
  });
};
const scrollTo = (colRef, idx) => {
  const el = panelRef.value?.querySelectorAll('.pui-time-picker__col')[colRef === 'hourCol' ? 0 : colRef === 'minCol' ? 1 : 2];
  const cell = el?.children[idx];
  if (cell) el.scrollTop = cell.offsetTop - el.clientHeight / 2 + cell.clientHeight / 2;
};

const onDocClick = (e) => {
  if (!open.value || rootRef.value?.contains(e.target) || panelRef.value?.contains(e.target)) return;
  closePanel();
};
const toggle = () => {
  if (props.disabled) return;
  open.value ? closePanel() : openPanel();
};
const openPanel = () => {
  open.value = true;
  place();
  document.addEventListener('mousedown', onDocClick);
};
const closePanel = () => {
  open.value = false;
  document.removeEventListener('mousedown', onDocClick);
};
watch(open, (v) => { if (v) place(); });
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));
</script>

<style scoped lang="scss">
.pui-time-picker {
  display: inline-block;
  width: 180px;

  &__control {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 10px;
    background: var(--pui-bg-elevated, #fff);
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }
  &.is-open &__control,
  &__control:hover {
    border-color: var(--pui-brand, #0e80eb);
  }
  &.is-disabled &__control { opacity: 0.55; cursor: not-allowed; }

  &__icon { color: var(--pui-text-muted, #8b96a6); font-size: 15px; }
  &__value { flex: 1; font-size: 14px; color: var(--pui-text, #1c2534); font-variant-numeric: tabular-nums; }
  &__placeholder { flex: 1; font-size: 14px; color: var(--pui-text-muted, #8b96a6); }
  &__clear { color: var(--pui-text-muted, #8b96a6); cursor: pointer; font-size: 13px; &:hover { color: var(--pui-text, #1c2534); } }

  &__panel {
    position: fixed;
    z-index: 2000;
    width: 200px;
    padding: 8px;
    background: var(--pui-bg-elevated, #fff);
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 12px;
    box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.1));
  }
  &__cols { display: flex; height: 200px; }
  &__col {
    flex: 1;
    overflow-y: auto;
    text-align: center;
    scroll-behavior: smooth;
    &::-webkit-scrollbar { width: 0; }
  }
  &__cell {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: var(--pui-text, #1c2534);
    cursor: pointer;
    border-radius: 6px;
    font-variant-numeric: tabular-nums;
    &:hover { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); }
    &.active { background: var(--pui-brand, #0e80eb); color: #fff; font-weight: 600; }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--pui-border, #e7ecf3);
    font-size: 13px;
  }
  &__now { color: var(--pui-brand, #0e80eb); cursor: pointer; }
  &__ok { color: var(--pui-text-sub, #5b6879); cursor: pointer; }
}

.pui-tp-fade-enter-active, .pui-tp-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.pui-tp-fade-enter-from, .pui-tp-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
