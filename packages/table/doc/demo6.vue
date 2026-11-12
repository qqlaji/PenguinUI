<template>
  <t-table
    :options="options"
    row-key-field="id"
    pagination
    :page-size="4"
    @sort-change="onSort"
    @filter-change="onFilter"
  >
    <template #price="{ scope }">
      <span class="tb-demo6__price">¥{{ scope.value }}</span>
    </template>
  </t-table>

  <p class="tb-demo6__hint">
    排序事件：{{ sortText || '暂无' }} ｜ 筛选事件：{{ filterText || '暂无' }}
  </p>
</template>

<script setup>
import { reactive, ref } from 'vue';

const sortText = ref('');
const filterText = ref('');

const options = reactive({
  fileds: [
    { field: 'id', title: 'ID', align: 'center', width: '70px', sortable: true },
    { field: 'name', title: '商品名称', align: 'left', sortable: true },
    { field: 'price', title: '价格', align: 'right', width: '110px', sortable: true },
    {
      field: 'status',
      title: '状态',
      align: 'center',
      width: '130px',
      filters: [
        { label: '已上架', value: '已上架' },
        { label: '已下架', value: '已下架' }
      ]
    }
  ],
  datas: [
    { id: 1, name: '企鹅保温杯', price: 89, status: '已上架' },
    { id: 2, name: '主题鼠标垫', price: 39, status: '已上架' },
    { id: 3, name: '机械键盘', price: 349, status: '已下架' },
    { id: 4, name: '显示器支架', price: 199, status: '已上架' },
    { id: 5, name: '降噪耳机', price: 699, status: '已下架' },
    { id: 6, name: 'USB 集线器', price: 79, status: '已上架' },
    { id: 7, name: '笔记本内胆包', price: 129, status: '已上架' },
    { id: 8, name: '桌面收纳盒', price: 59, status: '已下架' }
  ]
});

const onSort = ({ field, order }) => {
  sortText.value = order ? `${field} ${order === 'asc' ? '升序' : '降序'}` : '已取消';
};

const onFilter = (state) => {
  const fields = Object.keys(state).filter((k) => state[k] && state[k].length);
  filterText.value = fields.length ? fields.map((f) => `${f}=${state[f].join('|')}`).join('，') : '已重置';
};
</script>

<style lang="scss" scoped>
.tb-demo6__price {
  font-variant-numeric: tabular-nums;
  color: var(--pui-danger, #ec3437);
  font-weight: 600;
}
.tb-demo6__hint {
  margin: 10px 2px 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
