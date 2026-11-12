<template>
  <div class="seg-demo">
    <t-segmented v-model="v1" :options="options" size="small" />
    <t-segmented v-model="v2" :options="options" />
    <t-segmented v-model="v3" :options="options" size="large" />
    <t-segmented v-model="v4" :options="options" block />
    <t-segmented v-model="v5" :options="options" disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const options = ['选项一', '选项二', '选项三'];
const v1 = ref('选项一');
const v2 = ref('选项二');
const v3 = ref('选项一');
const v4 = ref('选项三');
const v5 = ref('选项二');
</script>

<style scoped>
.seg-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}
</style>
