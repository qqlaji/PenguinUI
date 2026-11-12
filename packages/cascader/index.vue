<template>
  <div ref="rootRef" class="pui-cascader" :class="[`pui-cascader--${size}`, { 'is-disabled': disabled, 'is-open': open }]">
    <div class="pui-cascader__control" @click="toggle">
      <span v-if="displayText" class="pui-cascader__value">{{ displayText }}</span>
      <span v-else class="pui-cascader__placeholder">{{ placeholder }}</span>
      <i
        v-if="clearable && selected.length"
        class="t-icon-close pui-cascader__clear"
        @click.stop="clear"
      ></i>
      <i class="t-icon-arrow-down-filling pui-cascader__arrow"></i>
    </div>

    <teleport to="body">
      <transition name="pui-cascader-fade">
        <div v-if="open" ref="panelRef" class="pui-cascader__panel" :style="panelStyle">
          <div class="pui-cascader__cols">
            <ul
              v-for="(col, ci) in columns"
              :key="ci"
              class="pui-cascader__col"
            >
              <li
                v-for="item in col"
                :key="item.value"
                class="pui-cascader__node"
                :class="{
                  active: activePath[ci] === item.value,
                  'is-leaf': !item.children || !item.children.length
                }"
                @mouseenter="onHover(item, ci)"
                @click="select(item, ci)"
              >
                <span class="pui-cascader__label">{{ item.label }}</span>
                <i v-if="item.children && item.children.length" class="t-icon-arrow-right-filling pui-cascader__expand"></i>
                <i v-else-if="isSelectedLeaf(item, ci)" class="t-icon-success pui-cascader__check"></i>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default { name: 'tCascader' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  size: { type: String, default: 'default' },
  separator: { type: String, default: ' / ' },
  changeOnSelect: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'change']);
const rootRef = ref(null);
const panelRef = ref(null);
const open = ref(false);
const panelStyle = ref({});
const activePath = ref([...props.modelValue]);
const selected = ref([...props.modelValue]);

watch(() => props.modelValue, (v) => { selected.value = [...(v || [])]; activePath.value = [...(v || [])]; });

const columns = computed(() => {
  const cols = [props.options || []];
  let node = (props.options || []).find((o) => o.value === activePath.value[0]);
  let i = 1;
  while (node && node.children && node.children.length) {
    cols.push(node.children);
    node = node.children.find((c) => c.value === activePath.value[i]);
    i++;
  }
  return cols;
});

const labelsOf = (path) => {
  const labels = [];
  let col = props.options || [];
  for (const v of path) {
    const node = col.find((o) => o.value === v);
    if (!node) break;
    labels.push(node.label);
    col = node.children || [];
  }
  return labels;
};
const displayText = computed(() => labelsOf(selected.value).join(props.separator));

const isSelectedLeaf = (item, ci) => {
  // 当前路径最后一级且等于选中路径
  const last = selected.value.length - 1;
  return ci === last && selected.value[ci] === item.value;
};

const onHover = (item, level) => {
  if (item.children && item.children.length) {
    activePath.value = activePath.value.slice(0, level).concat(item.value);
  } else {
    activePath.value = activePath.value.slice(0, level + 1);
  }
};
const select = (item, level) => {
  const path = activePath.value.slice(0, level + 1);
  if (item.children && item.children.length) {
    if (props.changeOnSelect) commit(path);
    return; // 有子级：仅展开，不关闭
  }
  commit(path);
};
const commit = (path) => {
  selected.value = [...path];
  emit('update:modelValue', [...path]);
  emit('change', [...path]);
  closePanel();
};
const clear = () => { selected.value = []; activePath.value = []; emit('update:modelValue', []); emit('change', []); };

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
};
const onDocClick = (e) => {
  if (!open.value || rootRef.value?.contains(e.target) || panelRef.value?.contains(e.target)) return;
  closePanel();
};
const toggle = () => { if (props.disabled) return; open.value ? closePanel() : openPanel(); };
const openPanel = () => { activePath.value = [...selected.value]; open.value = true; place(); document.addEventListener('mousedown', onDocClick); };
const closePanel = () => { open.value = false; document.removeEventListener('mousedown', onDocClick); };
watch(open, (v) => { if (v) place(); });
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));
</script>

<style scoped lang="scss">
.pui-cascader {
  display: inline-block;
  width: 220px;

  &__control {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 10px;
    background: var(--pui-bg-elevated, #fff);
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }
  &.is-open &__control,
  &__control:hover { border-color: var(--pui-brand, #0e80eb); }
  &.is-disabled &__control { opacity: 0.55; cursor: not-allowed; }

  &__value { flex: 1; font-size: 14px; color: var(--pui-text, #1c2534); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__placeholder { flex: 1; font-size: 14px; color: var(--pui-text-muted, #8b96a6); }
  &__arrow { color: var(--pui-text-muted, #8b96a6); font-size: 13px; transition: transform 0.18s ease; }
  &.is-open &__arrow { transform: rotate(180deg); }
  &__clear { color: var(--pui-text-muted, #8b96a6); cursor: pointer; font-size: 13px; &:hover { color: var(--pui-text, #1c2534); } }

  &__panel {
    position: fixed;
    z-index: 2000;
    background: var(--pui-bg-elevated, #fff);
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 12px;
    box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.1));
    padding: 6px;
  }
  &__cols { display: flex; max-height: 240px; }
  &__col {
    list-style: none;
    margin: 0;
    padding: 0;
    min-width: 140px;
    max-height: 240px;
    overflow-y: auto;
    border-right: 1px solid var(--pui-border, #e7ecf3);
    &:last-child { border-right: none; }
  }
  &__node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    font-size: 14px;
    color: var(--pui-text, #1c2534);
    cursor: pointer;
    border-radius: 8px;
    white-space: nowrap;
    &:hover { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); }
    &.active { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12)); color: var(--pui-brand, #0e80eb); font-weight: 600; }
  }
  &__expand { color: var(--pui-text-muted, #8b96a6); font-size: 12px; }
  &__check { color: var(--pui-brand, #0e80eb); font-size: 14px; }
}

.pui-cascader--small { width: 180px; }
.pui-cascader--large { width: 260px; }

.pui-cascader-fade-enter-active, .pui-cascader-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.pui-cascader-fade-enter-from, .pui-cascader-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
