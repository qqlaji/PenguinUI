<template>
  <div :class="[`penguin-table-${size}`, customClass, 'pui-table', { 'is-striped': striped, 'is-bordered': bordered }]">
    <!-- 顶部工具栏：选中统计 + 自定义操作 -->
    <div v-if="showToolbar" class="pui-table__toolbar">
      <div class="pui-table__toolbar-left">
        <span v-if="selectable" class="pui-table__selection">
          已选 <b>{{ selectedKeys.length }}</b> 项
          <button
            v-if="selectedKeys.length"
            type="button"
            class="pui-table__clear"
            @click="clearSelection"
          >清空</button>
        </span>
        <slot name="toolbar" :selected="selectedRows"></slot>
      </div>
      <div class="pui-table__toolbar-right">
        <slot name="toolbar-extra"></slot>
      </div>
    </div>

    <div :class="['pui-table__body', { 'is-fixed-head': fixedHeader }]" :style="bodyStyle">
      <table>
        <thead v-if="showHeader">
          <tr>
            <!-- 选择列 -->
            <th v-if="selectable" class="pui-table__cell--check" :style="headStyle">
              <input
                type="checkbox"
                class="pui-table__checkbox"
                :checked="allSelected"
                :indeterminate.prop="indeterminate"
                :disabled="!selectableRows.length"
                :aria-label="'全选'"
                @change="toggleAll"
              />
            </th>

            <th
              v-for="(col, n) in columns"
              :key="col.field || n"
              :style="[headStyle, { 'text-align': col.align, width: col.width }]"
              :class="[
                'pui-table__th',
                { 'is-sortable': col.sortable, 'is-sorted': sortState.field === col.field && sortState.order }
              ]"
              @click="col.sortable ? toggleSort(col, $event) : null"
            >
              <slot :name="'head-' + col.field" :scope="col" v-if="$slots['head-' + col.field]"></slot>
              <div v-else class="pui-table__th-inner">
                <span class="pui-table__th-text">{{ col.title }}</span>

                <!-- 排序箭头 -->
                <span v-if="col.sortable" class="pui-table__sorter" aria-hidden="true">
                  <i
                    class="iconfont t-icon-arrow-up-bold pui-table__sorter-up"
                    :class="{ 'is-active': sortState.field === col.field && sortState.order === 'asc' }"
                  ></i>
                  <i
                    class="iconfont t-icon-arrow-down-bold pui-table__sorter-down"
                    :class="{ 'is-active': sortState.field === col.field && sortState.order === 'desc' }"
                  ></i>
                </span>

                <!-- 列筛选 -->
                <span v-if="col.filters && col.filters.length" class="pui-table__filter" @click.stop>
                  <button
                    type="button"
                    class="pui-table__filter-btn"
                    :class="{ 'is-active': (filterState[col.field] || []).length }"
                    :aria-label="`筛选 ${col.title}`"
                    @click="toggleFilter(col.field)"
                  >
                    <i class="iconfont t-icon-filter" aria-hidden="true"></i>
                  </button>

                  <transition name="pui-table-fade">
                    <div v-if="openFilter === col.field" class="pui-table__filter-pop">
                      <label
                        v-for="opt in col.filters"
                        :key="String(opt.value)"
                        class="pui-table__filter-item"
                      >
                        <input
                          type="checkbox"
                          class="pui-table__checkbox"
                          :checked="(filterState[col.field] || []).includes(opt.value)"
                          @change="toggleFilterValue(col.field, opt.value)"
                        />
                        <span>{{ opt.label !== undefined ? opt.label : opt.value }}</span>
                      </label>
                      <div class="pui-table__filter-foot">
                        <button type="button" class="pui-table__link" @click="resetFilter(col.field)">重置</button>
                        <button type="button" class="pui-table__link pui-table__link--primary" @click="openFilter = ''">确定</button>
                      </div>
                    </div>
                  </transition>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, i) in pagedRows"
            :key="keyOfRow(row)"
            :class="[
              'pui-table__tr',
              { 'is-selected': selectable && isSelected(row), 'is-clickable': clickableRow }
            ]"
            @click="onRowClick(row, i, $event)"
          >
            <td v-if="selectable" class="pui-table__cell--check" :style="rowStyle">
              <input
                type="checkbox"
                class="pui-table__checkbox"
                :checked="isSelected(row)"
                :aria-label="'选择本行'"
                @change="toggleRow(row, $event)"
                @click.stop
              />
            </td>

            <td
              v-for="(col, j) in columns"
              :key="col.field || j"
              :style="[rowStyle, { width: col.width, 'text-align': col.align }]"
            >
              <slot
                :name="col.field"
                :scope="{ rowIndex: i, cellIndex: j, row, value: row[col.field] }"
                v-if="$slots[col.field]"
              ></slot>
              <div v-else>{{ row[col.field] }}</div>
            </td>
          </tr>

          <!-- 空状态 -->
          <tr v-if="!pagedRows.length" class="pui-table__empty-row">
            <td :colspan="colspan">
              <div class="pui-table__empty">
                <slot name="empty">{{ loading ? loadingText : emptyText }}</slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 加载遮罩 -->
      <div v-if="loading" class="pui-table__loading">
        <span class="pui-table__spinner"></span>
        <span>{{ loadingText }}</span>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="pagination" class="pui-table__pager">
      <span class="pui-table__pager-total">共 {{ totalRows }} 条</span>
      <div class="pui-table__pager-btns">
        <button
          type="button"
          class="pui-table__pager-btn"
          :disabled="innerPage <= 1"
          @click="goPage(innerPage - 1)"
        >上一页</button>
        <span class="pui-table__pager-current">{{ innerPage }} / {{ totalPages }}</span>
        <button
          type="button"
          class="pui-table__pager-btn"
          :disabled="innerPage >= totalPages"
          @click="goPage(innerPage + 1)"
        >下一页</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tTable'
};
</script>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  /**
   * 兼容原有写法：{ fileds: [...], datas: [...] }
   * 列上新增可选字段：sortable / filters / sorter
   */
  options: {
    type: Object,
    default: () => ({ fileds: [], datas: [] })
  },
  size: { type: String, default: 'default' },
  showHeader: { type: Boolean, default: true },
  headStyle: { type: Object, default: () => ({}) },
  rowStyle: { type: Object, default: () => ({}) },
  customClass: String,

  /* ---------- 以下为增强能力，全部可选，默认行为与旧版一致 ---------- */

  /** 行选择 */
  selectable: { type: Boolean, default: false },
  /** 已选行的 key 集合（v-model:selectedKeys） */
  selectedKeys: { type: Array, default: () => [] },
  /** 行唯一字段名，缺省用索引 */
  rowKeyField: { type: String, default: '' },

  /** 加载中 */
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '加载中...' },
  emptyText: { type: String, default: '暂无数据' },

  /** 斑马纹 */
  striped: { type: Boolean, default: false },
  /** 带边框（旧版默认就有边框，这里只控制外框圆角显隐） */
  bordered: { type: Boolean, default: true },

  /** 固定表头（配合 maxHeight 生效） */
  fixedHeader: { type: Boolean, default: false },
  /** 表格主体最大高度 */
  maxHeight: { type: [Number, String], default: '' },

  /** 显示工具栏 */
  showToolbar: { type: Boolean, default: false },

  /** 启用内置分页 */
  pagination: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },

  /** 点击行 */
  clickableRow: { type: Boolean, default: false }
});

const emit = defineEmits([
  'update:selectedKeys',
  'update:page',
  'sort-change',
  'filter-change',
  'row-click',
  'selection-change',
  'page-change'
]);

/* ---------------- 列与数据 ---------------- */
const columns = computed(() => props.options.fileds || []);
const rawRows = computed(() => props.options.datas || []);

/** 取行 key：优先用 rowKeyField，否则回退到该行在原始数据里的索引 */
const keyOfRow = (row) => {
  if (props.rowKeyField && row && row[props.rowKeyField] !== undefined) {
    return row[props.rowKeyField];
  }
  return rawRows.value.indexOf(row);
};

/* ---------------- 排序 ---------------- */
const sortState = ref({ field: '', order: '' }); // asc | desc | ''

function toggleSort(col, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const field = col.field;
  const cur = sortState.value;

  if (cur.field !== field) {
    sortState.value = { field, order: col.sortDirections ? col.sortDirections[0] : 'asc' };
  } else if (cur.order === 'asc') {
    sortState.value = { field, order: 'desc' };
  } else if (cur.order === 'desc') {
    sortState.value = { field: '', order: '' };
  } else {
    sortState.value = { field, order: 'asc' };
  }

  emit('sort-change', { ...sortState.value });
}

/* ---------------- 筛选 ---------------- */
const filterState = ref({});
const openFilter = ref('');

function toggleFilter(field) {
  openFilter.value = openFilter.value === field ? '' : field;
}

function toggleFilterValue(field, value) {
  const cur = filterState.value[field] ? [...filterState.value[field]] : [];
  const idx = cur.indexOf(value);
  if (idx === -1) cur.push(value);
  else cur.splice(idx, 1);
  filterState.value = { ...filterState.value, [field]: cur };
  emit('filter-change', { ...filterState.value });
  innerPage.value = 1;
}

function resetFilter(field) {
  const next = { ...filterState.value };
  delete next[field];
  filterState.value = next;
  emit('filter-change', next);
  innerPage.value = 1;
}

function onDocDown(e) {
  if (!e.target.closest || !e.target.closest('.pui-table__filter')) {
    openFilter.value = '';
  }
}

/* ---------------- 排序 + 筛选后的结果 ---------------- */
const processedRows = computed(() => {
  let rows = rawRows.value.slice();

  // 筛选
  Object.keys(filterState.value).forEach((field) => {
    const picked = filterState.value[field];
    if (picked && picked.length) {
      rows = rows.filter((row) => picked.includes(row[field]));
    }
  });

  // 排序
  const { field, order } = sortState.value;
  if (field && order) {
    const col = columns.value.find((c) => c.field === field);
    const getter = col && typeof col.sorter === 'function' ? col.sorter : (row) => row[field];
    rows.sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      const compared =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), 'zh-Hans-CN');
      return order === 'asc' ? compared : -compared;
    });
  }

  return rows;
});

const totalRows = computed(() => processedRows.value.length);

/* ---------------- 分页 ---------------- */
const innerPage = ref(props.page);
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / Math.max(1, props.pageSize))));

const pagedRows = computed(() => {
  if (!props.pagination) return processedRows.value;
  const start = (innerPage.value - 1) * props.pageSize;
  return processedRows.value.slice(start, start + props.pageSize);
});

function goPage(p) {
  const target = Math.min(Math.max(1, p), totalPages.value);
  if (target === innerPage.value) return;
  innerPage.value = target;
  emit('update:page', target);
  emit('page-change', target);
}

watch(
  () => props.page,
  (v) => {
    innerPage.value = v;
  }
);

watch(totalRows, () => {
  if (innerPage.value > totalPages.value) innerPage.value = totalPages.value;
});

/* ---------------- 行选择 ---------------- */
const selectedKeys = computed(() => props.selectedKeys || []);

const isSelected = (row) => selectedKeys.value.includes(keyOfRow(row));

const selectableRows = computed(() => pagedRows.value);

const allSelected = computed(
  () => selectableRows.value.length > 0 && selectableRows.value.every((row) => isSelected(row))
);

const indeterminate = computed(
  () => selectableRows.value.some((row) => isSelected(row)) && !allSelected.value
);

const selectedRows = computed(() => rawRows.value.filter((row) => isSelected(row)));

function emitSelection(keys) {
  emit('update:selectedKeys', keys);
  emit('selection-change', rawRows.value.filter((row) => keys.includes(keyOfRow(row))));
}

function toggleAll(e) {
  const checked = e.target.checked;
  let keys = [...selectedKeys.value];

  if (checked) {
    selectableRows.value.forEach((row) => {
      const k = keyOfRow(row);
      if (!keys.includes(k)) keys.push(k);
    });
  } else {
    const pageKeys = selectableRows.value.map(keyOfRow);
    keys = keys.filter((k) => !pageKeys.includes(k));
  }

  emitSelection(keys);
}

function toggleRow(row, e) {
  const key = keyOfRow(row);
  let keys = [...selectedKeys.value];
  const idx = keys.indexOf(key);

  // 以复选框自身的勾选状态为准，避免 v-model 未回传时状态翻转错误
  const checked = e && e.target ? e.target.checked : idx === -1;

  if (checked && idx === -1) keys.push(key);
  else if (!checked && idx > -1) keys.splice(idx, 1);

  emitSelection(keys);
}

function clearSelection() {
  emitSelection([]);
}

/* ---------------- 其他 ---------------- */
const colspan = computed(() => columns.value.length + (props.selectable ? 1 : 0));

const bodyStyle = computed(() => {
  const style = {
    // 窄屏超宽时内部横向滚动
    overflowX: 'auto'
  };
  if (props.maxHeight === '' && !props.fixedHeader) return style;

  const h = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
  style.maxHeight = h || undefined;
  if (props.fixedHeader) style.overflowY = 'auto';
  return style;
});

function onRowClick(row, index, e) {
  if (!props.clickableRow) return;
  emit('row-click', { row, index, event: e });
}

onMounted(() => {
  document.addEventListener('mousedown', onDocDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocDown, true);
});

defineExpose({ clearSelection, goPage, sortState, filterState });
</script>

<style lang="scss" scoped>
/* ============ 增强层样式（不改动旧版视觉，只在新增元素上生效） ============ */
.pui-table {
  position: relative;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 2px 10px;
    font-size: 13px;
    color: var(--pui-text-sub, #5b6879);
  }

  &__toolbar-left,
  &__toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__selection b {
    color: var(--pui-brand, #0e80eb);
    font-variant-numeric: tabular-nums;
    margin: 0 2px;
  }

  &__clear {
    padding: 0;
    margin-left: 6px;
    border: none;
    background: transparent;
    color: var(--pui-brand, #0e80eb);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;

    &:hover { text-decoration: underline; }
  }

  &__body {
    position: relative;
    /* 窄屏兜底：表格内容超宽时在组件内部横向滚动，不把父级顶出视口 */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  &.is-fixed-head &__body {
    max-height: inherit;
  }

  &__body.is-fixed-head {
    :deep(table) { position: relative; }
    :deep(thead th) {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--pui-bg-soft, #f7f9fc);
      /* 吸顶后与滚动内容之间加一道细微投影，避免粘在一起分不清 */
      box-shadow: inset 0 -1px 0 var(--pui-border, #e7ecf3);
    }
  }

  /* ---------- 表头排序 / 筛选 ---------- */
  &__th {
    position: relative;
    user-select: none;

    &.is-sortable {
      cursor: pointer;

      &:hover { color: var(--pui-brand, #0e80eb); }
    }
  }

  &__th-inner {
    display: inline-flex;
    align-items: center;
    justify-content: inherit;
    gap: 4px;
    width: 100%;
  }

  &__th-text {
    flex: 0 1 auto;
  }

  &__sorter {
    display: inline-flex;
    flex-direction: column;
    line-height: 1;
    gap: 0;
    margin-left: 2px;

    i {
      font-size: 9px;
      color: var(--pui-border-strong, #d8e0ea);
      transition: color 0.15s ease;

      &.is-active { color: var(--pui-brand, #0e80eb); }
    }
  }

  &__filter {
    position: relative;
    display: inline-flex;
  }

  &__filter-btn {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover { color: var(--pui-brand, #0e80eb); }
    &.is-active {
      color: var(--pui-brand, #0e80eb);
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1));
    }
  }

  &__filter-pop {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 20;
    min-width: 150px;
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 10px;
    background: var(--pui-bg-elevated, #fff);
    box-shadow: var(--pui-shadow, 0 12px 36px rgba(24, 44, 78, 0.16));
    text-align: left;
    font-weight: 400;
  }

  &__filter-item {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--pui-text, #1c2534);
    cursor: pointer;

    &:hover { background: var(--pui-bg-soft, #f7f9fc); }
  }

  &__filter-foot {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 4px;
    padding: 6px 8px 2px;
    border-top: 1px solid var(--pui-border, #eef2f7);
  }

  &__link {
    padding: 0;
    border: none;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;

    &:hover { color: var(--pui-brand, #0e80eb); }

    &--primary { color: var(--pui-brand, #0e80eb); font-weight: 500; }
  }

  /* ---------- 复选 ---------- */
  &__checkbox {
    width: 14px;
    height: 14px;
    accent-color: var(--pui-brand, #0e80eb);
    cursor: pointer;
    vertical-align: middle;
  }

  &__cell--check {
    width: 40px;
    text-align: center !important;
  }

  /* ---------- 行状态 ---------- */
  &__tr {
    &.is-clickable { cursor: pointer; }
    &.is-selected :deep(td) {
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
    }
  }

  &.is-striped :deep(tbody tr:nth-child(even)) {
    background: var(--pui-bg-soft, #f7f9fc);
  }

  /* ---------- 空 / 加载 ---------- */
  &__empty-row :deep(td) {
    border-bottom: 1px solid var(--pui-border, #e7ecf3) !important;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 16px;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(1px);
    font-size: 12px;
    color: var(--pui-text-sub, #5b6879);
    z-index: 5;
  }

  &__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--pui-border, #e7ecf3);
    border-top-color: var(--pui-brand, #0e80eb);
    border-radius: 50%;
    animation: pui-table-spin 0.8s linear infinite;
  }

  /* ---------- 分页 ---------- */
  &__pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 2px 0;
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__pager-btns {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  &__pager-btn {
    height: 28px;
    padding: 0 12px;
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-radius: 8px;
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-text, #1c2534);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      border-color: var(--pui-brand, #0e80eb);
      color: var(--pui-brand, #0e80eb);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__pager-current {
    font-variant-numeric: tabular-nums;
    color: var(--pui-text-sub, #5b6879);
  }
}

@keyframes pui-table-spin {
  to { transform: rotate(360deg); }
}

.pui-table-fade-enter-active,
.pui-table-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pui-table-fade-enter-from,
.pui-table-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .pui-table__spinner { animation: none; }
}
</style>

<style lang="scss" scoped>
.penguin-table-default{
  width:100%;
  height:auto;
  overflow:hidden;
  table{
    width:100%;
    border-radius: 2px;
    box-sizing: border-box;
    border-spacing:0;
    thead{
      th{
        padding:14px 12px;
        box-sizing: border-box;
        text-align: left;
        line-height: 20px;
        color: #646468;
        font-weight: 550;
        font-size:14px;
        border:1px solid #f0f0f0;
        border-right:0;
        background-color:#fafafa ;
      }
      th:last-child{
        border-right:1px solid #f0f0f0;
      }
    }
    tbody{
      tr{
        td{
          padding:13.5px 12px;
          box-sizing: border-box;
          text-align: left;
          line-height: 20px;
          color: #505050;
          font-weight: 500;
          font-size:14px;
          border:1px solid #f0f0f0;
          border-right:0;
          border-top:0;
        }
        td:last-child{
          border-bottom:1px solid #f0f0f0;
          border-right:1px solid #f0f0f0;
        }
        &:hover{
          background:rgba(240,240,240,.2)
        }
      }
    }
  }
}
.penguin-table-small{
  width:100%;
  height:auto;
  overflow:hidden;
  table{
    width:100%;
    border-radius: 2px;
    box-sizing: border-box;
    border-spacing:0;
    thead{
      th{
        padding:10px 10px;
        box-sizing: border-box;
        text-align: left;
        line-height: 20px;
        color: #646468;
        font-weight: 550;
        font-size:14px;
        border:1px solid #f0f0f0;
        border-right:0;
        background-color:#fafafa ;
      }
      th:last-child{
        border-right:1px solid #f0f0f0;
      }
    }
    tbody{
      tr{
        td{
          padding:9.5px 10px;
          box-sizing: border-box;
          text-align: left;
          line-height: 20px;
          color: #505050;
          font-weight: 500;
          font-size:14px;
          border:1px solid #f0f0f0;
          border-right:0;
          border-top:0;
        }
        td:last-child{
          border-bottom:1px solid #f0f0f0;
          border-right:1px solid #f0f0f0;
        }
        &:hover{
          background:rgba(240,240,240,.2)
        }
      }
    }
  }
}
.penguin-table-mini{
  width:100%;
  height:auto;
  overflow:hidden;
  table{
    width:100%;
    border-radius: 2px;
    box-sizing: border-box;
    border-spacing:0;
    thead{
      th{
        padding:8px 10px;
        box-sizing: border-box;
        text-align: left;
        line-height: 18px;
        color: #646468;
        font-weight: 550;
        font-size:12px;
        border:1px solid #f0f0f0;
        border-right:0;
        background-color:#fafafa ;
      }
      th:last-child{
        border-right:1px solid #f0f0f0;
      }
    }
    tbody{
      tr{
        td{
          padding:7.5px 10px;
          box-sizing: border-box;
          text-align: left;
          line-height: 18px;
          color: #505050;
          font-weight: 500;
          font-size:12px;
          border:1px solid #f0f0f0;
          border-right:0;
          border-top:0;
        }
        td:last-child{
          border-bottom:1px solid #f0f0f0;
          border-right:1px solid #f0f0f0;
        }
        &:hover{
          background:rgba(240,240,240,.2)
        }
      }
    }
  }
}
table{
  -webkit-border-horizontal-spacing: 0px;
  -webkit-border-vertical-spacing: 0px;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  /*
   * 必须是 0：这里写 2px 会让表格比容器宽 4px（左右各 2px），
   * 直接导致表格在文档里右侧溢出、并与容器边框重合。
   */
  border-spacing: 0;
  border-color: grey;
}

/* ===== v1.11 视觉统一：圆角 / 表头与描边颜色 ===== */
.penguin-table-default table,
.penguin-table-small table { border-radius: 12px; }

.penguin-table-default thead th,
.penguin-table-small thead th {
  background: var(--pui-bg-soft, #f7f9fc);
  color: var(--pui-text-sub, #5b6879);
  font-weight: 600;
  border-color: var(--pui-border, #e7ecf3);
}
.penguin-table-default tbody td,
.penguin-table-small tbody td {
  color: var(--pui-text, #1c2534);
  border-color: var(--pui-border, #e7ecf3);
}
.penguin-table-default tbody tr:hover,
.penguin-table-small tbody tr:hover { background: var(--pui-bg-soft, #f7f9fc); }
</style>
