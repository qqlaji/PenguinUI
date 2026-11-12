<template>
  <div class="pui-time-cols">
    <div
      v-for="col in cols"
      :key="col.key"
      :ref="(el) => setColRef(el, col.key)"
      class="pui-time-cols__col"
    >
      <button
        v-for="v in col.items"
        :key="v"
        type="button"
        class="pui-time-cols__item"
        :class="{ 'is-active': Number(modelValue[col.key]) === v }"
        @click="pick(col.key, v)"
      >{{ pad(v) }}</button>
    </div>
    <span class="pui-time-cols__mask pui-time-cols__mask--top"></span>
    <span class="pui-time-cols__mask pui-time-cols__mask--bottom"></span>
  </div>
</template>

<script>
export default { name: 'tTimeColumns' };
</script>

<script setup>
import { computed, nextTick, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, default: () => ({ h: 0, m: 0, s: 0 }) },
  showSeconds: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue']);

const pad = (n) => String(n).padStart(2, '0');

const cols = computed(() => {
  const list = [
    { key: 'h', items: Array.from({ length: 24 }, (_, i) => i) },
    { key: 'm', items: Array.from({ length: 60 }, (_, i) => i) },
  ];
  if (props.showSeconds) list.push({ key: 's', items: Array.from({ length: 60 }, (_, i) => i) });
  return list;
});

const colEls = {};
const setColRef = (el, key) => { if (el) colEls[key] = el; };

const ITEM_H = 28;
const scrollToActive = (key) => {
  const el = colEls[key];
  if (!el) return;
  const idx = Number(props.modelValue[key]) || 0;
  el.scrollTop = Math.max(0, idx * ITEM_H - ITEM_H * 2);
};

const pick = (key, v) => {
  emit('update:modelValue', { ...props.modelValue, [key]: v });
};

onMounted(() => {
  nextTick(() => cols.value.forEach((c) => scrollToActive(c.key)));
});
watch(
  () => props.modelValue,
  () => cols.value.forEach((c) => scrollToActive(c.key))
);
</script>

<style scoped lang="scss">
.pui-time-cols {
  position: relative;
  display: flex;
  gap: 4px;
  height: 168px;
  padding: 4px;
  border-left: 1px solid var(--pui-border, #e7ecf3);
}
.pui-time-cols__col {
  width: 44px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
.pui-time-cols__item {
  display: block;
  width: 100%;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--pui-text-sub, #5b6879);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;

  &:hover { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); color: var(--pui-brand, #0e80eb); }
  &.is-active {
    background: var(--pui-brand, #0e80eb);
    color: #fff;
    font-weight: 600;
  }
}
/* 上下渐隐，暗示可滚动 */
.pui-time-cols__mask {
  position: absolute;
  left: 0;
  right: 0;
  height: 14px;
  pointer-events: none;

  &--top { top: 0; background: linear-gradient(180deg, var(--pui-bg-elevated, #fff), transparent); }
  &--bottom { bottom: 0; background: linear-gradient(0deg, var(--pui-bg-elevated, #fff), transparent); }
}
</style>
