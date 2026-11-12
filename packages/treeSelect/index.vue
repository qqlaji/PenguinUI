<template>
  <div
    ref="wrapEl"
    class="pui-tree-select"
    :class="[
      `pui-tree-select--${size}`,
      { 'is-open': visible, 'is-disabled': disabled, 'is-multiple': multiple }
    ]"
  >
    <div ref="triggerEl" class="pui-tree-select__trigger" @click="toggle">
      <div class="pui-tree-select__value">
        <template v-if="multiple && selectedTags.length">
          <span v-for="tag in selectedTags" :key="tag.value" class="pui-tree-select__tag">
            {{ tag.label }}
            <i class="iconfont t-icon-close" @click.stop="removeTag(tag.value)"></i>
          </span>
        </template>
        <span v-else-if="!multiple && singleLabel" class="pui-tree-select__text">{{ singleLabel }}</span>
        <span v-else class="pui-tree-select__placeholder">{{ placeholder }}</span>
      </div>
      <i
        v-if="clearable && hasValue && !disabled"
        class="iconfont t-icon-close pui-tree-select__clear"
        @click.stop="clear"
      ></i>
      <i class="iconfont t-icon-arrow-down pui-tree-select__arrow"></i>
    </div>

    <teleport to="body">
      <transition name="pui-ts-fade">
        <div
          v-if="visible"
          ref="panelEl"
          class="pui-tree-select__panel"
          :style="panelStyle"
          @pointerdown.stop
        >
          <div v-if="filterable" class="pui-tree-select__search">
            <i class="iconfont t-icon-search"></i>
            <input v-model="keyword" type="text" placeholder="搜索选项" />
          </div>

          <div class="pui-tree-select__list">
            <div
              v-for="row in rows"
              :key="row.value"
              class="pui-tree-select__node"
              :class="{
                'is-selected': isSelected(row.value),
                'is-disabled': row.disabled,
                'is-branch': row.hasChildren
              }"
              :style="{ paddingLeft: 12 + row.level * 18 + 'px' }"
              @click="choose(row)"
            >
              <i
                v-if="row.hasChildren"
                class="iconfont pui-tree-select__expand"
                :class="expanded[row.value] ? 't-icon-arrow-down' : 't-icon-arrow-right'"
                @click.stop="toggleExpand(row)"
              ></i>
              <span v-else class="pui-tree-select__indent"></span>

              <span
                v-if="multiple"
                class="pui-tree-select__checkbox"
                :class="{ 'is-checked': isSelected(row.value) }"
              ></span>

              <span class="pui-tree-select__label">{{ row.label }}</span>
            </div>

            <div v-if="!rows.length" class="pui-tree-select__empty">暂无数据</div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default { name: 'tTreeSelect' };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: null },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '请选择' },
  size: { type: String, default: 'default' },
});
const emit = defineEmits(['update:modelValue', 'change', 'visible-change']);

const wrapEl = ref(null);
const triggerEl = ref(null);
const panelEl = ref(null);
const visible = ref(false);
const keyword = ref('');
const expanded = reactive({});
const pos = reactive({ top: 0, left: 0, width: 0 });
const panelStyle = computed(() => ({
  top: pos.top + 'px',
  left: pos.left + 'px',
  minWidth: pos.width + 'px',
}));

const values = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : [];
  return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
    ? []
    : [props.modelValue];
});
const hasValue = computed(() => values.value.length > 0);

// 扁平化整棵树，便于按 value 找 label
const flatAll = computed(() => {
  const out = [];
  const walk = (list) => {
    (list || []).forEach((n) => {
      out.push(n);
      if (n.children && n.children.length) walk(n.children);
    });
  };
  walk(props.options);
  return out;
});
const labelOf = (val) => {
  const hit = flatAll.value.find((n) => n.value === val);
  return hit ? hit.label : val;
};
const selectedTags = computed(() =>
  values.value.map((v) => ({ value: v, label: labelOf(v) }))
);
const singleLabel = computed(() => (values.value.length ? labelOf(values.value[0]) : ''));

const rows = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (kw) {
    // 搜索时平铺展示命中的节点
    return flatAll.value
      .filter((n) => String(n.label).toLowerCase().includes(kw))
      .map((n) => ({ ...n, level: 0, hasChildren: false }));
  }
  const out = [];
  const walk = (list, level) => {
    (list || []).forEach((n) => {
      const hasChildren = !!(n.children && n.children.length);
      out.push({ ...n, level, hasChildren });
      if (hasChildren && expanded[n.value]) walk(n.children, level + 1);
    });
  };
  walk(props.options, 0);
  return out;
});

const isSelected = (val) => values.value.includes(val);

const emitValue = (next) => {
  emit('update:modelValue', next);
  emit('change', next);
};

const choose = (row) => {
  if (row.disabled) return;
  if (props.multiple) {
    const arr = [...values.value];
    const i = arr.indexOf(row.value);
    if (i > -1) arr.splice(i, 1);
    else arr.push(row.value);
    emitValue(arr);
    return;
  }
  emitValue(row.value);
  close();
};
const removeTag = (val) => {
  emitValue(values.value.filter((v) => v !== val));
};
const clear = () => {
  emitValue(props.multiple ? [] : null);
};

const toggleExpand = (row) => {
  expanded[row.value] = !expanded[row.value];
};

/* 定位 */
const place = () => {
  if (!triggerEl.value || !panelEl.value) return;
  const rect = triggerEl.value.getBoundingClientRect();
  const pr = panelEl.value.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + pr.width > window.innerWidth - 8) left = window.innerWidth - pr.width - 8;
  if (top + pr.height > window.innerHeight - 8) {
    const above = rect.top - pr.height - 6;
    top = above >= 8 ? above : Math.max(8, window.innerHeight - pr.height - 8);
  }
  pos.left = Math.max(8, left);
  pos.top = Math.max(8, top);
  pos.width = rect.width;
};

const open = () => {
  if (props.disabled) return;
  if (triggerEl.value) {
    const r = triggerEl.value.getBoundingClientRect();
    pos.left = r.left;
    pos.top = r.bottom + 6;
    pos.width = r.width;
  }
  // 默认展开已选项的父级路径
  values.value.forEach((v) => {
    const walk = (list, parents) => {
      (list || []).forEach((n) => {
        if (n.value === v) parents.forEach((p) => { expanded[p] = true; });
        if (n.children) walk(n.children, [...parents, n.value]);
      });
    };
    walk(props.options, []);
  });
  visible.value = true;
  emit('visible-change', true);
  nextTick(place);
};
const close = () => {
  if (!visible.value) return;
  visible.value = false;
  keyword.value = '';
  emit('visible-change', false);
};
const toggle = () => (visible.value ? close() : open());

const onDocDown = (e) => {
  if (wrapEl.value && wrapEl.value.contains(e.target)) return;
  if (panelEl.value && panelEl.value.contains(e.target)) return;
  close();
};
const onScroll = (e) => {
  if (panelEl.value && panelEl.value.contains(e.target)) return;
  if (visible.value) close();
};
const onResize = () => { if (visible.value) close(); };
const onEsc = (e) => { if (e.key === 'Escape') close(); };

watch(visible, (v) => {
  if (v) {
    document.addEventListener('pointerdown', onDocDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onEsc);
  } else {
    document.removeEventListener('pointerdown', onDocDown, true);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onEsc);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocDown, true);
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('keydown', onEsc);
});
</script>

<style scoped lang="scss">
.pui-tree-select {
  display: inline-flex;
  width: 240px;
  min-height: 36px;
  font-size: 14px;

  &--small { min-height: 30px; font-size: 13px; }
  &--large { min-height: 42px; }
}
.pui-tree-select__trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  width: 100%;
  min-height: inherit;
  padding: 4px 10px;
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  border-radius: 10px;
  background: var(--pui-bg-elevated, #fff);
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:hover { border-color: var(--pui-brand, #0e80eb); }
}
.pui-tree-select.is-open .pui-tree-select__trigger {
  border-color: var(--pui-brand, #0e80eb);
  box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
}
.pui-tree-select.is-disabled .pui-tree-select__trigger {
  background: var(--pui-bg-soft, #f7f9fc);
  opacity: 0.6;
  cursor: not-allowed;
}
.pui-tree-select__value {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}
.pui-tree-select__text,
.pui-tree-select__placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pui-tree-select__text { color: var(--pui-text, #1c2534); }
.pui-tree-select__placeholder { color: var(--pui-text-muted, #8b96a6); }
.pui-tree-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 6px;
  border-radius: 6px;
  background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  color: var(--pui-brand, #0e80eb);
  font-size: 12px;

  i { font-size: 10px; cursor: pointer; opacity: 0.7; }
  i:hover { opacity: 1; }
}
.pui-tree-select__clear,
.pui-tree-select__arrow {
  flex: none;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
  transition: transform 0.18s ease, color 0.15s ease;
}
.pui-tree-select__clear:hover { color: var(--pui-text-sub, #5b6879); }
.pui-tree-select.is-open .pui-tree-select__arrow { transform: rotate(180deg); }

.pui-tree-select__panel {
  position: fixed;
  z-index: 3000;
  max-width: 360px;
  padding: 6px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
  box-shadow: 0 16px 40px rgba(24, 44, 78, 0.14);
}
.pui-tree-select__search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  margin-bottom: 4px;
  height: 32px;
  border-radius: 8px;
  background: var(--pui-bg-soft, #f7f9fc);

  i { font-size: 13px; color: var(--pui-text-muted, #8b96a6); }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: var(--pui-text, #1c2534);
  }
}
.pui-tree-select__list {
  max-height: 260px;
  overflow-y: auto;
}
.pui-tree-select__node {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding-right: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--pui-text, #1c2534);
  transition: background 0.12s ease;

  &:hover { background: var(--pui-bg-soft, #f7f9fc); }
  &.is-selected { color: var(--pui-brand, #0e80eb); background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); }
  &.is-disabled { color: var(--pui-text-muted, #8b96a6); cursor: not-allowed; background: transparent; }
}
.pui-tree-select__expand {
  width: 14px;
  font-size: 10px;
  color: var(--pui-text-muted, #8b96a6);
  transition: color 0.15s ease;
  &:hover { color: var(--pui-brand, #0e80eb); }
}
.pui-tree-select__indent { width: 14px; flex: none; }
.pui-tree-select__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pui-tree-select__checkbox {
  width: 14px;
  height: 14px;
  flex: none;
  border: 1px solid var(--pui-border-strong, #d8e0ea);
  border-radius: 4px;
  background: #fff;
  position: relative;

  &.is-checked {
    background: var(--pui-brand, #0e80eb);
    border-color: var(--pui-brand, #0e80eb);

    &::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid #fff;
      border-width: 0 1.5px 1.5px 0;
      transform: rotate(45deg);
    }
  }
}
.pui-tree-select__empty {
  padding: 18px 0;
  text-align: center;
  font-size: 13px;
  color: var(--pui-text-muted, #8b96a6);
}

.pui-ts-fade-enter-active,
.pui-ts-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.pui-ts-fade-enter-from,
.pui-ts-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
