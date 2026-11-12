<template>
  <t-table
    ref="tableRef"
    v-model:selectedKeys="selectedKeys"
    :options="options"
    selectable
    row-key-field="id"
    show-toolbar
    clickable-row
    @row-click="onRowClick"
    @selection-change="onSelectionChange"
  >
    <template #toolbar-extra>
      <t-button size="small" :disabled="!selectedKeys.length" @click="batchDelete">
        批量删除{{ selectedKeys.length ? `（${selectedKeys.length}）` : '' }}
      </t-button>
    </template>

    <template #status="{ scope }">
      <t-tag :type="scope.value === '已上架' ? 'success' : 'warning'" effect="light" size="small">
        {{ scope.value }}
      </t-tag>
    </template>
  </t-table>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue';

const { proxy } = getCurrentInstance();
const tableRef = ref(null);
const selectedKeys = ref([]);

const options = reactive({
  fileds: [
    { field: 'id', title: 'ID', align: 'center', width: '70px' },
    { field: 'name', title: '商品名称', align: 'left' },
    { field: 'price', title: '价格', align: 'right', width: '110px' },
    { field: 'status', title: '状态', align: 'center', width: '110px' }
  ],
  datas: [
    { id: 1, name: '企鹅保温杯 500ml', price: 89, status: '已上架' },
    { id: 2, name: '组件库主题鼠标垫', price: 39, status: '已上架' },
    { id: 3, name: '机械键盘（青轴）', price: 349, status: '已下架' },
    { id: 4, name: '显示器支架', price: 199, status: '已上架' },
    { id: 5, name: '降噪耳机', price: 699, status: '已下架' }
  ]
});

const onRowClick = ({ row }) => {
  proxy.$message({ text: `点击了「${row.name}」`, type: 'info', timeout: 1200 });
};

const onSelectionChange = (rows) => {
  console.log('已选行：', rows.map((r) => r.id));
};

const batchDelete = () => {
  proxy.$message({
    text: `已删除 ${selectedKeys.value.length} 项`,
    type: 'success',
    timeout: 1400
  });
  selectedKeys.value = [];
};
</script>
