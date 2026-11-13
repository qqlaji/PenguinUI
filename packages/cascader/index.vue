<template>
  <div
    ref="rootRef"
    class="pui-cascader"
    :class="[`pui-cascader--${size}`, { 'is-disabled': disabled, 'is-open': open, 'is-multiple': multiple, 'is-filterable': filterable }]"
  >
    <div class="pui-cascader__control" @click="toggle">
      <!-- 多选：标签列表 -->
      <div v-if="multiple && tags.length" class="pui-cascader__tags">
        <span
          v-for="(tag, i) in visibleTags"
          :key="i"
          class="pui-cascader__tag"
          :title="tag.label"
        >
          <span class="pui-cascader__tag-text">{{ tag.label }}</span>
          <i
            v-if="!disabled"
            class="t-icon-close pui-cascader__tag-close"
            @click.stop="removeTag(tag)"
          ></i>
        </span>
        <span v-if="tags.length > maxTagCount" class="pui-cascader__tag-more">
          +{{ tags.length - maxTagCount }}
        </span>
      </div>

      <!-- 单选：文本 -->
      <template v-else>
        <span v-if="displayText" class="pui-cascader__value">{{ displayText }}</span>
        <span v-else class="pui-cascader__placeholder">{{ placeholder }}</span>
      </template>

      <i
        v-if="clearable && hasValue"
        class="t-icon-close pui-cascader__clear"
        @click.stop="clear"
      ></i>
      <i class="t-icon-arrow-down-filling pui-cascader__arrow"></i>
    </div>

    <teleport to="body">
      <transition name="pui-cascader-fade">
        <div v-if="open" ref="panelRef" class="pui-cascader__panel" :style="panelStyle">
          <!-- 搜索框 -->
          <div v-if="filterable" class="pui-cascader__search">
            <i class="iconfont t-icon-search pui-cascader__search-icon" aria-hidden="true"></i>
            <input
              ref="searchRef"
              v-model="keyword"
              class="pui-cascader__search-input"
              type="text"
              :placeholder="filterPlaceholder"
              @keydown.down.prevent="moveActive(1)"
              @keydown.up.prevent="moveActive(-1)"
              @keydown.enter.prevent="confirmActive"
            />
          </div>

          <!-- 搜索结果模式：平铺多条路径 -->
          <ul v-if="searchResults" class="pui-cascader__results">
            <li
              v-for="(item, i) in searchResults"
              :key="item.value"
              class="pui-cascader__result"
              :class="{ 'is-active': i === activeResultIndex, 'is-disabled': item.disabled }"
              @mouseenter="activeResultIndex = i"
              @click="pickSearchResult(item)"
            >
              <span class="pui-cascader__result-text" v-html="item.highlighted"></span>
              <i
                v-if="isCheckedNode(item.value)"
                class="t-icon-success pui-cascader__result-check"
              ></i>
            </li>
            <li v-if="!searchResults.length" class="pui-cascader__no-result">
              {{ noResultText }}
            </li>
          </ul>

          <!-- 列模式 -->
          <div v-else class="pui-cascader__cols">
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
                  'is-leaf': !hasChildrenOf(item),
                  'is-checked': multiple ? checkedSet.has(item.value) : false,
                  'is-half': multiple ? halfSet.has(item.value) : false,
                  'is-disabled': isDisabledNode(item)
                }"
                @mouseenter="onHover(item, ci)"
                @click="onNodeClick(item, ci)"
              >
                <!-- 多选复选框 -->
                <span
                  v-if="multiple"
                  class="pui-cascader__check"
                  :class="{ 'is-on': checkedSet.has(item.value), 'is-half': halfSet.has(item.value) }"
                >
                  <input
                    type="checkbox"
                    class="pui-cascader__checkbox"
                    :checked="checkedSet.has(item.value)"
                    :indeterminate.prop="halfSet.has(item.value)"
                    :disabled="isDisabledNode(item) || disabled"
                    :aria-label="String(item[labelField])"
                    @click.stop
                    @change="onCheck(item, ci)"
                  />
                </span>

                <span class="pui-cascader__label">{{ item[labelField] }}</span>

                <i
                  v-if="hasChildrenOf(item)"
                  class="t-icon-arrow-right-filling pui-cascader__expand"
                ></i>
                <i
                  v-else-if="!multiple && isSelectedLeaf(item, ci)"
                  class="t-icon-success pui-cascader__check-icon"
                ></i>
                <i
                  v-if="loadingValues.has(item.value)"
                  class="iconfont t-icon-round-loading pui-cascader__loading is-spin"
                  aria-hidden="true"
                ></i>
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
import {
  collectDescendantValues,
  computeMultiState,
  indexOptions,
  pathToLabel,
  resolveMultiPaths,
  resolvePath
} from './utils';

const props = defineProps({
  /** 单选：路径数组 ['zj','hz']；多选：二维数组 [['zj','hz'],['fj','xm']] */
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  size: { type: String, default: 'default' },
  separator: { type: String, default: ' / ' },
  /** 允许选择任意层级（非叶子也可提交） */
  changeOnSelect: { type: Boolean, default: false },

  /* ---------- 新增能力 ---------- */
  /** 多选 */
  multiple: { type: Boolean, default: false },
  /** 父子勾选不联动（仅多选生效） */
  checkStrictly: { type: Boolean, default: false },
  /** 多选时最多显示的标签数，超出显示 +N */
  maxTagCount: { type: Number, default: 2 },
  /** 显示已选标签的层级：'leaf' 叶子路径全名 / 'parent' 只显示「全选」的父级 */
  showCheckedStrategy: { type: String, default: 'leaf' },

  /** 字段名 */
  valueField: { type: String, default: 'value' },
  labelField: { type: String, default: 'label' },
  childrenField: { type: String, default: 'children' },
  disabledField: { type: String, default: 'disabled' },
  isLeafField: { type: String, default: 'isLeaf' },

  /** 搜索 */
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: '搜索选项' },
  noResultText: { type: String, default: '无匹配结果' },

  /** 异步加载 */
  lazyLoad: { type: Function, default: null },
  /** 触发异步加载的层级：默认「展开即加载」 */
  emptyText: { type: String, default: '暂无数据' }
});

const emit = defineEmits(['update:modelValue', 'change', 'expand-change', 'load']);

const rootRef = ref(null);
const panelRef = ref(null);
const searchRef = ref(null);
const open = ref(false);
const panelStyle = ref({});
const keyword = ref('');
const activeResultIndex = ref(0);
const loadingValues = ref(new Set());
/** 异步加载回来的子节点，按父 value 缓存，不污染原 options */
const extraChildren = ref({});

/* ---------------- 数据索引 ---------------- */
/** 把 extraChildren 合并成新 options（不改 props） */
const mergedOptions = computed(() => {
  if (!Object.keys(extraChildren.value).length) return props.options;

  const walk = (list) => {
    return (list || []).map((raw) => {
      const extra = extraChildren.value[raw[props.valueField]];
      const base = { ...raw };
      const origin = raw[props.childrenField];

      if (extra) {
        base[props.childrenField] = [...(Array.isArray(origin) ? origin : []), ...extra];
        base[props.isLeafField] = false;
      }
      if (Array.isArray(base[props.childrenField]) && base[props.childrenField].length) {
        base[props.childrenField] = walk(base[props.childrenField]);
      }
      return base;
    });
  };

  return walk(props.options);
});

const indexOpts = computed(() => ({
  valueField: props.valueField,
  labelField: props.labelField,
  childrenField: props.childrenField,
  disabledField: props.disabledField,
  isLeafField: props.isLeafField
}));

const treeIndex = computed(() => indexOptions(mergedOptions.value, indexOpts.value));

/* ---------------- 多选状态 ---------------- */
const multiPaths = computed(() => {
  if (!props.multiple) return [];
  return (props.modelValue || []).filter(Array.isArray);
});

const multiState = computed(() =>
  computeMultiState(treeIndex.value, multiPaths.value, props.checkStrictly)
);
const checkedSet = computed(() => multiState.value.checked);
const halfSet = computed(() => multiState.value.half);

const hasValue = computed(() => {
  if (props.multiple) return multiPaths.value.length > 0;
  return (props.modelValue || []).length > 0;
});

/* ---------------- 单选状态 ---------------- */
const selected = ref([...(props.modelValue || [])]);
const activePath = ref([...(props.modelValue || [])]);

watch(
  () => props.modelValue,
  (v) => {
    if (props.multiple) return;
    selected.value = [...(v || [])];
    activePath.value = [...(v || [])];
  },
  { deep: true }
);

/* ---------------- 列表渲染 ---------------- */
const hasChildrenOf = (item) => {
  const children = item[props.childrenField];
  if (Array.isArray(children) && children.length) return true;
  // 已异步加载过（以缓存为准，item 可能是重算前的旧快照）
  if (extraChildren.value[item[props.valueField]]) return true;
  // lazyLoad 场景：isLeaf=false 表示还有子节点未加载
  if (props.lazyLoad && item[props.isLeafField] === false) return true;
  return false;
};

const isDisabledNode = (item) => props.disabled || !!(item && item[props.disabledField]);

/** 列数据：根据 activePath 逐级展开 */
const columns = computed(() => {
  const cols = [mergedOptions.value || []];
  let list = mergedOptions.value || [];
  let node = list.find((o) => o[props.valueField] === activePath.value[0]);

  let i = 1;
  while (node) {
    const children = node[props.childrenField];
    if (!Array.isArray(children) || !children.length) break;
    cols.push(children);
    node = children.find((c) => c[props.valueField] === activePath.value[i]);
    i += 1;
  }
  return cols;
});

/* ---------------- 显示文本 ---------------- */
const displayText = computed(() => {
  if (props.multiple) return '';
  return pathToLabel(treeIndex.value, selected.value, props.separator);
});

/* ---------------- 多选标签 ---------------- */
const tags = computed(() => {
  if (!props.multiple) return [];

  // 'parent' 策略：只显示「子孙全选」的顶级父级，减少标签数量
  if (props.showCheckedStrategy === 'parent') {
    const result = [];
    const covered = new Set();

    [...treeIndex.value.map.values()]
      .sort((a, b) => a.level - b.level)
      .forEach((entry) => {
        if (!entry.hasChildren) return;
        if (covered.has(entry.value)) return;
        if (!checkedSet.value.has(entry.value)) return;

        // 只保留「最上层」的全选父级
        const ancestors = entry.path.slice(0, -1);
        if (ancestors.some((a) => covered.has(a))) {
          covered.add(entry.value);
          return;
        }
        result.push({ value: entry.value, label: pathToLabel(treeIndex.value, entry.path, props.separator), path: entry.path });
        collectDescendantValues(treeIndex.value, entry.value).forEach((v) => covered.add(v));
        covered.add(entry.value);
      });

    return result;
  }

  return multiPaths.value.map((p) => ({
    value: p[p.length - 1],
    label: pathToLabel(treeIndex.value, p, props.separator),
    path: p
  }));
});

const visibleTags = computed(() => tags.value.slice(0, props.maxTagCount));

function removeTag(tag) {
  if (props.disabled) return;
  const next = multiPaths.value.filter((p) => p.join('>') !== tag.path.join('>'));
  commitMulti(next);
}

/* ---------------- 交互：单选 ---------------- */
const isSelectedLeaf = (item, ci) => {
  const last = selected.value.length - 1;
  return ci === last && selected.value[ci] === item[props.valueField];
};

const onHover = (item, level) => {
  if (isDisabledNode(item)) return;

  if (hasChildrenOf(item)) {
    activePath.value = activePath.value.slice(0, level).concat(item[props.valueField]);
    maybeLazyLoad(item);
  } else {
    activePath.value = activePath.value.slice(0, level + 1);
  }
};

const onNodeClick = (item, ci) => {
  if (isDisabledNode(item)) return;

  const value = item[props.valueField];
  const entry = treeIndex.value.map.get(value);
  // 用索引里的完整路径，避免 activePath 在跨列时缺级
  const path = entry ? [...entry.path] : activePath.value.slice(0, ci).concat(value);

  // 多选：点击行也切换勾选（更符合直觉）
  if (props.multiple) {
    if (hasChildrenOf(item) && !props.changeOnSelect) {
      // 有子级：点行是展开，勾选交给复选框
      activePath.value = path;
      maybeLazyLoad(item);
      return;
    }
    toggleCheckByPath(path);
    return;
  }

  if (hasChildrenOf(item)) {
    activePath.value = path;
    maybeLazyLoad(item);
    if (props.changeOnSelect) commitSingle(path);
    return;
  }
  commitSingle(path);
};

const commitSingle = (path) => {
  selected.value = [...path];
  emit('update:modelValue', [...path]);
  emit('change', [...path]);
  closePanel();
};

/* ---------------- 交互：多选 ---------------- */
function toggleCheckByPath(path, forceNext) {
  const value = path[path.length - 1];
  const entry = treeIndex.value.map.get(value);
  if (entry && entry.disabled) return;

  // forceNext 明确给出时以它为准；否则按当前勾选状态取反
  const nextChecked = forceNext !== undefined ? !!forceNext : !checkedSet.value.has(value);
  const nextPaths = resolveMultiPaths(
    treeIndex.value,
    multiPaths.value,
    path,
    nextChecked,
    props.checkStrictly
  );

  commitMulti(nextPaths);
}

function onCheck(item, e) {
  if (isDisabledNode(item)) return;
  const value = item[props.valueField];
  const entry = treeIndex.value.map.get(value);
  const path = entry ? [...entry.path] : [value];

  // 以复选框自身的勾选状态为准，避免依赖 computed 的异步更新
  const nextChecked = e && e.target ? !!e.target.checked : !checkedSet.value.has(value);
  toggleCheckByPath(path, nextChecked);
}

function commitMulti(paths) {
  emit('update:modelValue', paths);
  emit('change', paths);
}

const isCheckedNode = (value) => checkedSet.value.has(value);

/* ---------------- 搜索 ---------------- */
const allSearchable = computed(() => {
  const out = [];
  treeIndex.value.map.forEach((entry) => {
    if (entry.disabled) return;
    out.push(entry);
  });
  return out;
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const searchResults = computed(() => {
  const kw = keyword.value.trim();
  if (!props.filterable || !kw) return null;

  const lower = kw.toLowerCase();
  const safeKw = escapeHtml(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return allSearchable.value
    .filter((entry) => {
      // 命中自身标签，或命中路径上任意一级标签
      const inSelf = String(entry.label ?? '').toLowerCase().includes(lower);
      const inPath = resolvePath(treeIndex.value, entry.path).some((n) =>
        String(n.label ?? '').toLowerCase().includes(lower)
      );
      return inSelf || inPath;
    })
    .slice(0, 50)
    .map((entry) => {
      const full = pathToLabel(treeIndex.value, entry.path, ' / ');
      const highlighted = escapeHtml(full).replace(
        new RegExp(`(${safeKw})`, 'gi'),
        '<mark class="pui-cascader__mark">$1</mark>'
      );
      return { ...entry, full, highlighted };
    });
});

function pickSearchResult(item) {
  if (isDisabledNode(item.raw)) return;

  if (props.multiple) {
    toggleCheckByPath(item.path);
    return;
  }
  commitSingle(item.path);
}

function moveActive(step) {
  if (!searchResults.value || !searchResults.value.length) return;
  const len = searchResults.value.length;
  activeResultIndex.value = (activeResultIndex.value + step + len) % len;
}

function confirmActive() {
  if (!searchResults.value || !searchResults.value.length) return;
  const item = searchResults.value[activeResultIndex.value];
  if (item) pickSearchResult(item);
}

watch(keyword, () => {
  activeResultIndex.value = 0;
});

/* ---------------- 异步加载 ---------------- */
async function maybeLazyLoad(item) {
  if (!props.lazyLoad) return;
  const value = item[props.valueField];

  // 已在请求中：直接忽略，避免 hover 反复触发造成重复请求
  if (loadingValues.value.has(value)) return;

  // 已有子节点，或该父级已加载过（查缓存而不是查 item.children，
  // 因为 item 可能来自 mergedOptions 重算前的旧快照）
  const hasChildren = Array.isArray(item[props.childrenField]) && item[props.childrenField].length;
  if (hasChildren || extraChildren.value[value]) return;

  const next = new Set(loadingValues.value);
  next.add(value);
  loadingValues.value = next;

  try {
    const children = await props.lazyLoad(item);
    if (Array.isArray(children) && children.length) {
      extraChildren.value = { ...extraChildren.value, [value]: children };
      emit('load', { value, children });
    }
  } catch (e) {
    emit('load', { value, error: e });
  } finally {
    const s = new Set(loadingValues.value);
    s.delete(value);
    loadingValues.value = s;
  }
}

/* ---------------- 面板定位与开关 ---------------- */
const place = async () => {
  await nextTick();
  const trig = rootRef.value ? rootRef.value.getBoundingClientRect() : null;
  const panel = panelRef.value ? panelRef.value.getBoundingClientRect() : null;
  if (!trig || !panel) return;

  let top = trig.bottom + 6;
  if (top + panel.height > window.innerHeight - 8) {
    top = Math.max(8, trig.top - panel.height - 6);
  }
  let left = trig.left;
  if (left + panel.width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - panel.width - 8);
  }
  panelStyle.value = { top: `${top}px`, left: `${left}px` };
};

const onDocClick = (e) => {
  if (!open.value) return;
  if (rootRef.value && rootRef.value.contains(e.target)) return;
  if (panelRef.value && panelRef.value.contains(e.target)) return;
  closePanel();
};

const toggle = () => {
  if (props.disabled) return;
  if (open.value) closePanel();
  else openPanel();
};

const openPanel = async () => {
  if (!props.multiple) activePath.value = [...selected.value];
  open.value = true;
  await place();
  // 聚焦搜索框
  if (props.filterable) {
    await nextTick();
    if (searchRef.value) searchRef.value.focus();
  }
  document.addEventListener('mousedown', onDocClick);
  window.addEventListener('resize', place);
};

const closePanel = () => {
  open.value = false;
  keyword.value = '';
  document.removeEventListener('mousedown', onDocClick);
  window.removeEventListener('resize', place);
};

const clear = () => {
  if (props.disabled) return;
  if (props.multiple) {
    commitMulti([]);
  } else {
    selected.value = [];
    activePath.value = [];
    emit('update:modelValue', []);
    emit('change', []);
  }
};

watch(open, (v) => {
  if (v) place();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
  window.removeEventListener('resize', place);
});

defineExpose({
  open: () => openPanel(),
  close: closePanel,
  clear,
  getCheckedPaths: () => multiPaths.value
});
</script>

<style scoped lang="scss">
.pui-cascader {
  display: inline-block;
  width: 220px;
  max-width: 100%;
  box-sizing: border-box;

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
    box-sizing: border-box;
  }

  &.is-multiple &__control {
    min-height: 36px;
    padding-top: 3px;
    padding-bottom: 3px;
  }

  &.is-open &__control,
  &__control:hover {
    border-color: var(--pui-brand, #0e80eb);
  }

  &.is-open &__control {
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  }

  &.is-disabled &__control {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &__value {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: var(--pui-text, #1c2534);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__placeholder {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: var(--pui-text-muted, #8b96a6);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    flex: none;
    color: var(--pui-text-muted, #8b96a6);
    font-size: 13px;
    transition: transform 0.18s ease;
  }

  &.is-open &__arrow { transform: rotate(180deg); }

  &__clear {
    flex: none;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;
    font-size: 13px;
    &:hover { color: var(--pui-text, #1c2534); }
  }

  /* ---------- 多选标签 ---------- */
  &__tags {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    max-width: 120px;
    padding: 1px 4px 1px 7px;
    border-radius: 5px;
    background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
    color: var(--pui-brand, #0e80eb);
    font-size: 12px;
    line-height: 18px;
  }

  &__tag-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tag-close {
    flex: none;
    font-size: 9px;
    cursor: pointer;
    opacity: 0.7;
    &:hover { opacity: 1; }
  }

  &__tag-more {
    flex: none;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    padding-left: 2px;
  }

  /* ---------- 面板 ---------- */
  &__panel {
    position: fixed;
    z-index: 2000;
    background: var(--pui-bg-elevated, #fff);
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 12px;
    box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.14));
    padding: 6px;
    box-sizing: border-box;
    max-width: calc(100vw - 16px);
  }

  /* ---------- 搜索 ---------- */
  &__search {
    position: relative;
    display: flex;
    align-items: center;
    height: 30px;
    margin-bottom: 6px;
    padding: 0 8px 0 26px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 8px;
    background: var(--pui-bg-soft, #f7f9fc);
  }

  &__search-icon {
    position: absolute;
    left: 8px;
    font-size: 11px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__search-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 13px;
    color: inherit;

    &::placeholder { color: var(--pui-text-muted, #8b96a6); }
  }

  /* ---------- 搜索结果 ---------- */
  &__results {
    list-style: none;
    margin: 0;
    padding: 0;
    min-width: 200px;
    max-width: 320px;
    max-height: 240px;
    overflow-y: auto;
  }

  &__result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 7px;
    font-size: 13px;
    color: var(--pui-text, #1c2534);
    cursor: pointer;

    &:hover,
    &.is-active {
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
    }

    &.is-disabled {
      cursor: not-allowed;
      color: var(--pui-text-muted, #8b96a6);
    }
  }

  &__result-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__result-check {
    flex: none;
    color: var(--pui-brand, #0e80eb);
    font-size: 13px;
  }

  &__mark {
    padding: 0 1px;
    border-radius: 3px;
    background: rgba(255, 196, 60, 0.42);
    color: inherit;
  }

  &__no-result {
    padding: 18px 10px;
    text-align: center;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }

  /* ---------- 列 ---------- */
  &__cols {
    display: flex;
    max-height: 240px;
    overflow-x: auto;
  }

  &__col {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: none;
    /* 列宽随内容自适应：短文案不低于 140px，长文案撑开到 240px 后省略 */
    min-width: 140px;
    width: max-content;
    max-width: 240px;
    max-height: 240px;
    overflow-y: auto;
    border-right: 1px solid var(--pui-border, #e7ecf3);

    &:last-child { border-right: none; }
  }

  &__node {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    font-size: 13px;
    color: var(--pui-text, #1c2534);
    cursor: pointer;
    border-radius: 7px;
    white-space: nowrap;

    &:hover { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08)); }

    &.active {
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
      color: var(--pui-brand, #0e80eb);
      font-weight: 600;
    }

    &.is-disabled {
      cursor: not-allowed;
      color: var(--pui-text-muted, #8b96a6);
      &:hover { background: transparent; }
    }
  }

  &__label {
    /* 允许按内容撑开（auto 基准），超出列宽时才省略 */
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__expand {
    flex: none;
    color: var(--pui-text-muted, #8b96a6);
    font-size: 11px;
  }

  &__check-icon {
    flex: none;
    color: var(--pui-brand, #0e80eb);
    font-size: 13px;
  }

  &__loading {
    flex: none;
    font-size: 11px;
    color: var(--pui-brand, #0e80eb);
  }

  /* ---------- 多选复选框 ---------- */
  &__check {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__checkbox {
    width: 14px;
    height: 14px;
    margin: 0;
    accent-color: var(--pui-brand, #0e80eb);
    cursor: pointer;

    &:disabled { cursor: not-allowed; }
  }
}

.pui-cascader--small { width: 180px; }
.pui-cascader--large { width: 260px; }

.pui-cascader-fade-enter-active,
.pui-cascader-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.pui-cascader-fade-enter-from,
.pui-cascader-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.is-spin {
  animation: pui-cascader-spin 0.9s linear infinite;
  display: inline-block;
}

@keyframes pui-cascader-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .is-spin { animation: none; }
  .pui-cascader-fade-enter-active,
  .pui-cascader-fade-leave-active { transition: none; }
}
</style>
