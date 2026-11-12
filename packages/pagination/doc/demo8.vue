<!-- html -->
<template>
  <t-pagination
    :total="total"
    :current="page"
    :pageSize="size"
    :pagerCount="9"
    showTotal
    jumper
    @update:current="page = $event"
    @change="onChange"
  ></t-pagination>
  <p class="pg-tip">
    第 {{ page }} 页 · 每页 {{ size }} 条 · 最近一次切换：{{ last }}
  </p>
</template>

<!-- js -->
<script setup>
import { ref } from 'vue';
const total = ref(1286);
const size = ref(10);
const page = ref(1);
const last = ref('—');
const onChange = (v) => {
  last.value = `第 ${v} 页`;
};
</script>

<style scoped>
.pg-tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
</style>
