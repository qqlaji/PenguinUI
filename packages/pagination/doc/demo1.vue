<!-- html -->
<template>
  <t-pagination
    :total="500"
    :current="10"
    :pageSize="10"
    @change="onChange"
  ></t-pagination>
  <p class="pg-tip">当前第 <b>{{ page }}</b> 页，共 50 页</p>
</template>

<!-- js -->
<script setup>
import { ref } from 'vue';
const page = ref(10);
const onChange = (v) => {
  page.value = v;
};
</script>

<style scoped>
.pg-tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
.pg-tip b {
  color: var(--pui-primary, #0e80eb);
}
</style>
