<template>
  <div class="pui-transfer" :class="{ 'is-disabled': disabled }">
    <div class="pui-transfer__panel">
      <div class="pui-transfer__header">
        <label class="pui-transfer__check">
          <input
            type="checkbox"
            :checked="allChecked('left')"
            :indeterminate.prop="indeterminate('left')"
            :disabled="disabled || !leftList.length"
            @change="toggleAll('left')"
          />
        </label>
        <span class="pui-transfer__title">{{ titles[0] }}</span>
        <span class="pui-transfer__count">{{ checked.left.length }}/{{ leftList.length }}</span>
      </div>

      <div v-if="filterable" class="pui-transfer__filter">
        <input v-model="keyword.left" type="text" placeholder="请输入搜索内容" :disabled="disabled" />
      </div>

      <div class="pui-transfer__list">
        <label
          v-for="item in filteredLeft"
          :key="item.key"
          class="pui-transfer__item"
          :class="{ 'is-disabled': item.disabled || disabled }"
        >
          <input
            type="checkbox"
            :checked="checked.left.includes(item.key)"
            :disabled="item.disabled || disabled"
            @change="toggleItem('left', item.key)"
          />
          <span>{{ item.label }}</span>
        </label>
        <div v-if="!filteredLeft.length" class="pui-transfer__empty">暂无数据</div>
      </div>
    </div>

    <div class="pui-transfer__actions">
      <button
        type="button"
        class="pui-transfer__btn"
        :disabled="disabled || !checked.left.length"
        aria-label="移到右侧"
        title="移到右侧"
        @click="move('right')"
      ><i class="iconfont t-icon-arrow-right-bold"></i></button>
      <button
        type="button"
        class="pui-transfer__btn"
        :disabled="disabled || !checked.right.length"
        aria-label="移到左侧"
        title="移到左侧"
        @click="move('left')"
      ><i class="iconfont t-icon-arrow-left-bold"></i></button>
    </div>

    <div class="pui-transfer__panel">
      <div class="pui-transfer__header">
        <label class="pui-transfer__check">
          <input
            type="checkbox"
            :checked="allChecked('right')"
            :indeterminate.prop="indeterminate('right')"
            :disabled="disabled || !rightList.length"
            @change="toggleAll('right')"
          />
        </label>
        <span class="pui-transfer__title">{{ titles[1] }}</span>
        <span class="pui-transfer__count">{{ checked.right.length }}/{{ rightList.length }}</span>
      </div>

      <div v-if="filterable" class="pui-transfer__filter">
        <input v-model="keyword.right" type="text" placeholder="请输入搜索内容" :disabled="disabled" />
      </div>

      <div class="pui-transfer__list">
        <label
          v-for="item in filteredRight"
          :key="item.key"
          class="pui-transfer__item"
          :class="{ 'is-disabled': item.disabled || disabled }"
        >
          <input
            type="checkbox"
            :checked="checked.right.includes(item.key)"
            :disabled="item.disabled || disabled"
            @change="toggleItem('right', item.key)"
          />
          <span>{{ item.label }}</span>
        </label>
        <div v-if="!filteredRight.length" class="pui-transfer__empty">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'tTransfer' };
</script>

<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  data: { type: Array, default: () => [] }, // [{ key, label, disabled }]
  modelValue: { type: Array, default: () => [] }, // 右侧已选项 key 数组
  titles: { type: Array, default: () => ['列表一', '列表二'] },
  filterable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'change']);

const checked = reactive({ left: [], right: [] });
const keyword = reactive({ left: '', right: '' });

const selected = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []));
const leftList = computed(() => props.data.filter((d) => !selected.value.includes(d.key)));
const rightList = computed(() => props.data.filter((d) => selected.value.includes(d.key)));

const match = (item, kw) => !kw || String(item.label).toLowerCase().includes(kw.trim().toLowerCase());
const filteredLeft = computed(() => leftList.value.filter((i) => match(i, keyword.left)));
const filteredRight = computed(() => rightList.value.filter((i) => match(i, keyword.right)));

const allChecked = (side) => {
  const list = side === 'left' ? filteredLeft.value : filteredRight.value;
  const usable = list.filter((i) => !i.disabled);
  return usable.length > 0 && usable.every((i) => checked[side].includes(i.key));
};
const indeterminate = (side) => {
  const list = side === 'left' ? filteredLeft.value : filteredRight.value;
  const hit = list.filter((i) => checked[side].includes(i.key)).length;
  return hit > 0 && !allChecked(side);
};

const toggleAll = (side) => {
  const list = (side === 'left' ? filteredLeft.value : filteredRight.value).filter((i) => !i.disabled);
  if (allChecked(side)) {
    checked[side] = checked[side].filter((k) => !list.some((i) => i.key === k));
  } else {
    const set = new Set(checked[side]);
    list.forEach((i) => set.add(i.key));
    checked[side] = [...set];
  }
};
const toggleItem = (side, key) => {
  const arr = [...checked[side]];
  const i = arr.indexOf(key);
  if (i > -1) arr.splice(i, 1);
  else arr.push(key);
  checked[side] = arr;
};

const move = (to) => {
  if (props.disabled) return;
  const from = to === 'right' ? 'left' : 'right';
  const moving = checked[from];
  if (!moving.length) return;

  const next = to === 'right'
    ? [...selected.value, ...moving.filter((k) => !selected.value.includes(k))]
    : selected.value.filter((k) => !moving.includes(k));

  checked[from] = [];
  emit('update:modelValue', next);
  emit('change', next, to, [...moving]);
};

// 外部值变化时清理越界的勾选项
watch(
  () => props.modelValue,
  () => {
    const keys = new Set(props.data.map((d) => d.key));
    checked.left = checked.left.filter((k) => keys.has(k));
    checked.right = checked.right.filter((k) => keys.has(k));
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.pui-transfer {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--pui-text, #1c2534);
}
.pui-transfer__panel {
  display: flex;
  flex-direction: column;
  width: 220px;
  height: 300px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
  overflow: hidden;
}
.pui-transfer__header {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--pui-border, #e7ecf3);
  background: var(--pui-bg-soft, #f7f9fc);
}
.pui-transfer__title { flex: 1; font-size: 13px; font-weight: 600; }
.pui-transfer__count {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  font-variant-numeric: tabular-nums;
}
.pui-transfer__check,
.pui-transfer__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  input[type='checkbox'] {
    width: 14px;
    height: 14px;
    accent-color: var(--pui-brand, #0e80eb);
    cursor: pointer;
    margin: 0;
  }
}
.pui-transfer__filter {
  padding: 8px 10px 0;

  input {
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    padding: 0 10px;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 8px;
    outline: none;
    font-size: 13px;
    color: var(--pui-text, #1c2534);
    background: var(--pui-bg-elevated, #fff);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus {
      border-color: var(--pui-brand, #0e80eb);
      box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
    }
  }
}
.pui-transfer__list {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
}
.pui-transfer__item {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 7px 8px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover { background: var(--pui-bg-soft, #f7f9fc); }
  &.is-disabled { cursor: not-allowed; opacity: 0.5; }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.pui-transfer__empty {
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  color: var(--pui-text-muted, #8b96a6);
}
.pui-transfer__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pui-transfer__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  border-radius: 8px;
  background: var(--pui-bg-elevated, #fff);
  color: var(--pui-text-sub, #5b6879);
  cursor: pointer;
  transition: all 0.15s ease;

  i { font-size: 13px; }
  &:hover:not(:disabled) {
    color: var(--pui-brand, #0e80eb);
    border-color: var(--pui-brand, #0e80eb);
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
  }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
}
.pui-transfer.is-disabled { opacity: 0.7; }

@media (max-width: 720px) {
  .pui-transfer { flex-direction: column; }
  .pui-transfer__panel { width: 100%; }
  .pui-transfer__actions { flex-direction: row; }
}
</style>
