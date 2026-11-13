<template>
  <div :class="['pui-tree', customClass, { 'is-disabled': disabled }]">
    <!-- 搜索框 -->
    <div v-if="filterable" class="pui-tree__search">
      <i class="iconfont t-icon-search pui-tree__search-icon" aria-hidden="true"></i>
      <input
        v-model="keyword"
        class="pui-tree__search-input"
        type="text"
        :placeholder="filterPlaceholder"
        :aria-label="filterPlaceholder"
      />
      <button
        v-if="keyword"
        type="button"
        class="pui-tree__search-clear"
        aria-label="清空搜索"
        @click="keyword = ''"
      >
        <i class="iconfont t-icon-close" aria-hidden="true"></i>
      </button>
    </div>

    <!-- 工具栏：展开/收起全部与勾选统计 -->
    <div v-if="showToolbar" class="pui-tree__toolbar">
      <button type="button" class="pui-tree__tool" @click="expandAll">
        <i class="iconfont t-icon-arrow-down-bold" aria-hidden="true"></i>
        <span>展开全部</span>
      </button>
      <button type="button" class="pui-tree__tool" @click="collapseAll">
        <i class="iconfont t-icon-arrow-up-bold" aria-hidden="true"></i>
        <span>收起全部</span>
      </button>
      <span v-if="checkable" class="pui-tree__count">已选 {{ modelValue.length }} 项</span>
    </div>

    <!-- 树体 -->
    <div ref="bodyRef" class="pui-tree__body" :style="bodyStyle" role="tree">
      <div
        v-for="item in visibleRows"
        :key="item.key"
        :class="[
          'pui-tree__row',
          {
            'is-selected': isSelected(item.key),
            'is-disabled': item.disabled,
            'is-checked': checkedSet.has(item.key),
            'is-half': halfSet.has(item.key),
            'is-filtered': !!item.highlight
          }
        ]"
        :style="{ paddingLeft: `${item.level * indent + 8}px` }"
        role="treeitem"
        :aria-level="item.level + 1"
        :aria-expanded="item.hasChildren ? String(openSet.has(item.key)) : undefined"
        :aria-selected="String(isSelected(item.key))"
        :data-key="item.key"
        @click="onRowClick(item)"
      >
        <!-- 展开箭头：lazy 模式下未加载的节点也要显示（否则点不到） -->
        <span
          class="pui-tree__arrow"
          :class="{
            'is-open': openSet.has(item.key),
            'is-leaf': !item.hasChildren && !(lazy && !item.isLeaf)
          }"
          @click.stop="toggleExpand(item)"
        >
          <i
            v-if="item.hasChildren || (lazy && !item.isLeaf)"
            :class="['iconfont', loadingKeys.has(item.key) ? 't-icon-round-loading' : 't-icon-arrow-right-filling', { 'is-spin': loadingKeys.has(item.key) }]"
            aria-hidden="true"
          ></i>
        </span>

        <!-- 复选框（checkable） -->
        <label
          v-if="checkable"
          class="pui-tree__check"
          @click.stop
        >
          <input
            type="checkbox"
            class="pui-tree__checkbox"
            :checked="checkedSet.has(item.key)"
            :indeterminate.prop="halfSet.has(item.key)"
            :disabled="item.disabled || disabled"
            :aria-label="String(item.label)"
            @change="onCheck(item, $event)"
          />
        </label>

        <!-- 人类可读模式下的 radio（single select） -->
        <span
          v-else-if="selectable"
          class="pui-tree__dot"
          :class="{ 'is-on': isSelected(item.key) }"
        ></span>

        <!-- 图标 -->
        <i
          v-if="nodeIcon(item)"
          :class="['iconfont', nodeIcon(item), 'pui-tree__icon']"
          aria-hidden="true"
        ></i>

        <!-- 标签：支持搜索高亮与自定义插槽 -->
        <slot name="label" :node="item" :data="item.raw">
          <span class="pui-tree__label" v-html="renderLabel(item)"></span>
        </slot>
      </div>

      <div v-if="!visibleRows.length" class="pui-tree__empty">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tTree'
};
</script>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import {
  buildFlatTree,
  collectAncestorKeys,
  computeCheckState,
  filterKeys,
  resolveCheckedKeys
} from './utils';

const props = defineProps({
  /** 树数据：[{ label, children, disabled, key, isLeaf }] */
  options: { type: Array, default: () => [] },
  /** 标签字段名，兼容旧版 labelFiled */
  labelField: { type: String, default: 'label' },
  labelFiled: { type: String, default: '' },
  /** 子节点字段名 */
  childrenField: { type: String, default: 'children' },
  /** 禁用字段名 */
  disabledField: { type: String, default: 'disabled' },

  /** 默认展开的节点 key（路径写法，如 '0-2'） */
  defaultOpenNodes: { type: Array, default: () => [] },
  /** 默认选中的节点 key（兼容旧版；勾选用 modelValue） */
  defaultSelectNodes: { type: Array, default: () => [] },

  /** 多选（显示复选框）—— 旧版语义：multiple=true 即出现选择框 */
  multiple: { type: Boolean, default: false },
  /** 新语义：显式开启勾选，与 multiple 等价但语义更清晰 */
  checkable: { type: Boolean, default: false },
  /** 是否显示为可单选（无复选框时显示圆点） */
  selectable: { type: Boolean, default: false },
  /** 勾选集合（v-model），也用于回传旧版 defaultSelectNodes 的结果 */
  modelValue: { type: Array, default: () => [] },
  /** 选中集合（v-model:selected，单选/高亮用） */
  selected: { type: Array, default: () => [] },
  /** 父子勾选不联动 */
  checkStrictly: { type: Boolean, default: false },
  /** 是否允许勾选父节点（checkStrictly=false 时默认允许级联） */
  onlyLeafCheckable: { type: Boolean, default: false },

  /** 父节点（未展开）图标 */
  icon: { type: String, default: 't-icon-folder-close' },
  /** 父节点展开后的图标 */
  openedIcon: { type: String, default: 't-icon-folder-filling' },
  /** 叶子节点图标 */
  leafIcon: { type: String, default: 't-icon-file' },
  /** 缩进宽度（px） */
  indent: { type: Number, default: 20 },

  /** 搜索过滤 */
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: '搜索节点' },
  /** 搜索是否自动展开命中节点的祖先 */
  expandOnFilter: { type: Boolean, default: true },

  /** 工具栏（展开/收起全部） */
  showToolbar: { type: Boolean, default: false },
  /** 空状态文案 */
  emptyText: { type: String, default: '暂无数据' },
  /** 最大高度，超出滚动 */
  maxHeight: { type: [Number, String], default: '' },
  /** 禁用整棵树 */
  disabled: { type: Boolean, default: false },
  /** 异步加载子节点：(node) => Promise<children[]> */
  loadData: { type: Function, default: null },
  /** 展开时才加载（lazy） */
  lazy: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits([
  'update:modelValue',
  'update:selected',
  'nodeClick',
  'selectClick',
  'check',
  'expand',
  'load',
  'filter'
]);

/* ---------------- 基础数据 ---------------- */
const keyword = ref('');
const bodyRef = ref(null);
const loadingKeys = ref(new Set());

const labelFieldResolved = computed(() => props.labelFiled || props.labelField);

/** 是否显示复选框：multiple 为旧版入口，checkable 为新入口 */
const checkableMode = computed(() => props.checkable || props.multiple);

const flatOpts = computed(() => ({
  labelField: labelFieldResolved.value,
  childrenField: props.childrenField,
  disabledField: props.disabledField
}));

/** 扁平化后的节点表（每次数据变化重建，绝不改原对象） */
const treeData = ref({ flat: [], byKey: new Map() });

/** 异步加载回来的子节点，按父 key 缓存（不改原始 options） */
const extraChildren = ref({});

function rebuild() {
  const merged = injectExtra(props.options);
  treeData.value = buildFlatTree(merged, flatOpts.value);
}

/** 把 extraChildren 合并进一份新数据副本，避免污染 props.options */
function injectExtra(nodes) {
  if (!Object.keys(extraChildren.value).length) return nodes;

  const walk = (list, parentPath) => {
    return (list || []).map((raw, index) => {
      const path = parentPath === '' ? String(index) : `${parentPath}-${index}`;
      const key = raw && raw.key !== undefined && raw.key !== null ? String(raw.key) : path;
      const extra = extraChildren.value[key];

      const base = { ...raw };
      const originChildren = raw ? raw[props.childrenField] : null;

      if (extra) {
        base[props.childrenField] = [
          ...(Array.isArray(originChildren) ? originChildren : []),
          ...extra
        ];
        // 异步节点一旦有子节点就不再是叶子
        base.isLeaf = false;
      }

      if (Array.isArray(base[props.childrenField]) && base[props.childrenField].length) {
        base[props.childrenField] = walk(base[props.childrenField], path);
      }

      return base;
    });
  };

  return walk(nodes, '');
}

/* ---------------- 展开状态 ---------------- */
const openSet = ref(new Set());

/* ---------------- 勾选状态 ---------------- */
const checkedKeys = computed(() => props.modelValue || []);
const checkedState = computed(() =>
  computeCheckState(treeData.value.byKey, checkedKeys.value, props.checkStrictly)
);
const checkedSet = computed(() => checkedState.value.checked);
const halfSet = computed(() => checkedState.value.half);

/* ---------------- 选中（高亮） ---------------- */
const selectedKeys = computed(() => {
  const list = props.selected && props.selected.length ? props.selected : props.defaultSelectNodes;
  return list || [];
});

const isSelected = (key) => selectedKeys.value.includes(key);

/* ---------------- 过滤 ---------------- */
const keepKeys = computed(() => filterKeys(treeData.value.byKey, keyword.value, labelFieldResolved.value));

/** 搜索时自动展开命中节点的祖先 */
watch(keyword, (kw) => {
  if (!props.filterable) return;
  if (!kw.trim()) {
    emit('filter', '');
    return;
  }

  if (props.expandOnFilter && keepKeys.value) {
    const next = new Set(openSet.value);
    keepKeys.value.forEach((k) => {
      const node = treeData.value.byKey.get(k);
      if (node && node.hasChildren) next.add(k);
    });
    openSet.value = next;
  }
  emit('filter', kw);
});

/** 最终渲染的行：过滤隐藏 + 折叠隐藏 */
const visibleRows = computed(() => {
  const { flat, byKey } = treeData.value;
  const out = [];

  // 需要隐藏的 key：祖先被折叠
  const collapsed = new Set();

  flat.forEach((node) => {
    const hiddenByCollapse = node.parentKey !== null && collapsed.has(node.parentKey);
    if (hiddenByCollapse) {
      collapsed.add(node.key);
      return;
    }
    if (keepKeys.value && !keepKeys.value.has(node.key)) {
      // 搜索未命中的节点，其子树也一并隐藏
      collapsed.add(node.key);
      return;
    }
    if (node.parentKey !== null && !openSet.value.has(node.parentKey)) {
      // 父级未展开，隐藏自己与子树
      collapsed.add(node.key);
      return;
    }

    out.push({
      ...node,
      highlight: keyword.value.trim() && String(node.label).toLowerCase().includes(keyword.value.trim().toLowerCase())
    });
  });

  return out;
});

/* ---------------- 渲染标签（搜索高亮） ---------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderLabel(item) {
  const text = escapeHtml(item.label ?? '');
  const kw = keyword.value.trim();
  if (!kw) return text;

  // 大小写不敏感高亮，先转义再替换，避免 XSS
  const safeKw = escapeHtml(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${safeKw})`, 'gi'), '<mark class="pui-tree__mark">$1</mark>');
}

/** 节点图标：父节点展开/收起用不同图标，叶子用 leafIcon */
function nodeIcon(item) {
  // lazy 模式下「未加载但非叶子」的节点也算作目录
  const asFolder = item.hasChildren || (props.lazy && !item.isLeaf);
  if (asFolder) {
    return openSet.value.has(item.key) ? (props.openedIcon || props.icon) : props.icon;
  }
  return props.leafIcon;
}

/* ---------------- 交互 ---------------- */
async function toggleExpand(item) {
  if (props.disabled || item.disabled) return;
  if (!item.hasChildren && !props.lazy) return;

  const next = new Set(openSet.value);
  const willExpand = !next.has(item.key);

  if (willExpand) next.add(item.key);
  else next.delete(item.key);

  // 先落地展开态，再触发加载：否则加载期间节点仍是折叠的，转圈图标显示不出来
  openSet.value = next;
  emit('expand', { key: item.key, expanded: willExpand, node: item.raw });

  // 懒加载：首次展开时拉取子节点（不阻塞展开动画）
  if (willExpand && props.lazy && props.loadData && !item.hasChildren && !extraChildren.value[item.key]) {
    loadChildren(item);
  }
}

/** 异步加载子节点 */
async function loadChildren(item) {
  if (!props.loadData) return;

  const nextLoading = new Set(loadingKeys.value);
  nextLoading.add(item.key);
  loadingKeys.value = nextLoading;

  try {
    const children = await props.loadData(item.raw);
    if (Array.isArray(children)) {
      extraChildren.value = { ...extraChildren.value, [item.key]: children };
      rebuild();
      emit('load', { key: item.key, children });
    }
  } catch (e) {
    emit('load', { key: item.key, error: e });
  } finally {
    const s = new Set(loadingKeys.value);
    s.delete(item.key);
    loadingKeys.value = s;
  }
}

function onRowClick(item) {
  if (props.disabled || item.disabled) return;

  // 点击行：目录节点（含 lazy 待加载节点）则展开/收起，同时派发选中
  if (item.hasChildren || (props.lazy && !item.isLeaf)) {
    toggleExpand(item);
  }

  const nextSelected = [item.key];
  emit('update:selected', nextSelected);
  emit('selectClick', item.raw);
  emit('nodeClick', item.raw);
}

function onCheck(item, e) {
  if (props.disabled || item.disabled) return;
  if (props.onlyLeafCheckable && !item.isLeaf && item.hasChildren) {
    // 只允许勾叶子：父节点点击时按全选处理，但不算勾自己
    return;
  }

  const nextChecked = e.target.checked;
  const nextKeys = resolveCheckedKeys(
    treeData.value.byKey,
    checkedKeys.value,
    item.key,
    nextChecked,
    props.checkStrictly
  );

  emit('update:modelValue', nextKeys);

  // 兼容旧版事件：selectClick 回传节点，nodeClick 回传当前勾选的节点数组
  const nodes = nextKeys.map((k) => treeData.value.byKey.get(k)).filter(Boolean).map((n) => n.raw);
  emit('check', { key: item.key, checked: nextChecked, keys: nextKeys, nodes });
  emit('selectClick', item.raw);
  emit('nodeClick', nodes);
}

/* ---------------- 展开 / 收起全部 ---------------- */
function expandAll() {
  const next = new Set();
  treeData.value.flat.forEach((n) => {
    if (n.hasChildren) next.add(n.key);
  });
  openSet.value = next;
}

function collapseAll() {
  openSet.value = new Set();
}

/* ---------------- 样式 ---------------- */
const bodyStyle = computed(() => {
  if (props.maxHeight === '' || props.maxHeight === undefined) return {};
  const h = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
  return { maxHeight: h, overflowY: 'auto' };
});

/* ---------------- 初始化与同步 ---------------- */
function initOpenState() {
  const next = new Set();
  const { byKey } = treeData.value;

  (props.defaultOpenNodes || []).forEach((k) => {
    next.add(String(k));
    // 展开某节点时，其祖先必须一起展开，否则节点不可见
    collectAncestorKeys(byKey, String(k)).forEach((a) => next.add(a));
  });

  // 已勾选 / 已选中的节点也自动展开祖先，保证可见
  [...checkedKeys.value, ...selectedKeys.value].forEach((k) => {
    collectAncestorKeys(byKey, String(k)).forEach((a) => next.add(a));
  });

  openSet.value = next;
}

rebuild();
initOpenState();

onMounted(() => {
  // 懒加载模式下，默认展开的节点若有 loadData 需要拉一次
  if (props.lazy && props.loadData) {
    const pending = [...openSet.value]
      .map((k) => treeData.value.byKey.get(k))
      .filter((n) => n && !n.hasChildren && !extraChildren.value[n.key]);
    pending.forEach((n) => loadChildren(n));
  }
});

watch(
  () => [props.options, props.labelField, props.labelFiled, props.childrenField],
  () => {
    rebuild();
  },
  { deep: false }
);

defineExpose({
  expandAll,
  collapseAll,
  expand: (key) => {
    const node = treeData.value.byKey.get(String(key));
    if (node) toggleExpand(node);
  },
  getCheckedKeys: () => checkedKeys.value,
  setCheckedKeys: (keys) => emit('update:modelValue', keys),
  getFlatNodes: () => treeData.value.flat
});
</script>

<style scoped lang="scss">
.pui-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--pui-text, #1c2534);
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;

  /* ---------- 搜索 ---------- */
  &__search {
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 30px 0 30px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 9px;
    background: var(--pui-bg-elevated, #fff);
    transition: border-color 0.16s ease, box-shadow 0.16s ease;

    &:focus-within {
      border-color: var(--pui-brand, #0e80eb);
      box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
    }
  }

  &__search-icon {
    position: absolute;
    left: 10px;
    font-size: 12px;
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

  &__search-clear {
    position: absolute;
    right: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: var(--pui-bg-soft, #f0f3f8);
    color: var(--pui-text-muted, #8b96a6);
    font-size: 10px;
    cursor: pointer;

    &:hover { color: var(--pui-text, #1c2534); }
  }

  /* ---------- 工具栏 ---------- */
  &__toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__tool {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 7px;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text-sub, #5b6879);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--pui-brand, #0e80eb);
      color: var(--pui-brand, #0e80eb);
    }

    i { font-size: 9px; }
  }

  &__count {
    margin-left: auto;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    font-variant-numeric: tabular-nums;
  }

  /* ---------- 树体 ---------- */
  &__body {
    min-width: 0;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 30px;
    padding-right: 8px;
    border-radius: 7px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.12s ease;

    &:hover { background: var(--pui-bg-soft, #f7f9fc); }

    &.is-selected {
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
      color: var(--pui-brand, #0e80eb);
    }

    &.is-disabled {
      cursor: not-allowed;
      color: var(--pui-text-muted, #8b96a6);

      &:hover { background: transparent; }
    }
  }

  &__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex: none;
    color: var(--pui-text-muted, #8b96a6);

    i {
      font-size: 10px;
      transition: transform 0.16s ease;
    }

    &.is-open i { transform: rotate(90deg); }
    &.is-leaf { visibility: hidden; }
  }

  &__check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    padding: 0 2px;
  }

  &__checkbox {
    width: 14px;
    height: 14px;
    margin: 0;
    accent-color: var(--pui-brand, #0e80eb);
    cursor: pointer;

    &:disabled { cursor: not-allowed; }
  }

  &__dot {
    width: 6px;
    height: 6px;
    flex: none;
    margin: 0 4px;
    border-radius: 50%;
    background: var(--pui-border-strong, #d8e0ea);
    transition: all 0.15s ease;

    &.is-on {
      background: var(--pui-brand, #0e80eb);
      box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.16));
    }
  }

  &__icon {
    flex: none;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.5;
  }

  &__mark {
    padding: 0 1px;
    border-radius: 3px;
    background: rgba(255, 196, 60, 0.42);
    color: inherit;
  }

  &__loading {
    flex: none;
    font-size: 12px;
    color: var(--pui-brand, #0e80eb);
  }

  &__empty {
    padding: 24px 12px;
    text-align: center;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

/* 加载中的箭头图标旋转 */
.is-spin {
  animation: pui-tree-spin 0.9s linear infinite;
  display: inline-block;
}

@keyframes pui-tree-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .is-spin { animation: none; }
  .pui-tree__arrow i { transition: none; }
}
</style>
