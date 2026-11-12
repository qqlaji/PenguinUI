<template>
  <div class="tb-demo7">
    <div class="tb-demo7__bar">
      <t-segmented v-model="mode" :options="modes" size="small" />
      <t-typography type="secondary" size="small">滚动表体时表头保持吸顶</t-typography>
    </div>

    <t-table
      :options="options"
      :loading="loading"
      :striped="mode === 'striped'"
      :max-height="240"
      fixed-header
      size="small"
    >
      <template #empty>没有符合条件的数据</template>
    </t-table>

    <div class="tb-demo7__bar">
      <t-button size="small" @click="toggleLoading">{{ loading ? '结束加载' : '模拟加载' }}</t-button>
      <t-button size="small" @click="clearData">清空数据（看空态）</t-button>
      <t-button size="small" @click="resetData">恢复数据</t-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const mode = ref('plain');
const modes = [
  { label: '普通', value: 'plain' },
  { label: '斑马纹', value: 'striped' }
];

const loading = ref(false);

const rows = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  task: `任务 ${i + 1} · 固定表头演示`,
  owner: ['blue-sf', 'Cindy', 'David'][i % 3],
  cost: `${(i + 1) * 12}.5h`
}));

const options = reactive({
  fileds: [
    { field: 'id', title: '#', align: 'center', width: '60px' },
    { field: 'task', title: '任务', align: 'left' },
    { field: 'owner', title: '负责人', align: 'center', width: '110px' },
    { field: 'cost', title: '工时', align: 'right', width: '100px' }
  ],
  datas: rows.slice()
});

const toggleLoading = () => {
  loading.value = !loading.value;
};

const clearData = () => {
  options.datas = [];
};

const resetData = () => {
  options.datas = rows.slice();
};
</script>

<style lang="scss" scoped>
.tb-demo7 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tb-demo7__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
