<!-- html -->
<template>
  <t-space>
    <t-input v-model="value1"  placeholder="默认大小"></t-input>
    <t-input v-model="value2"  placeholder="小的" size="small"></t-input>
    <t-input v-model="value3"  placeholder="更小的" size="mini"></t-input>
  </t-space>
</template>

<!-- js -->
<script setup>
  import { ref } from "vue";
  const value1 = ref('')
  const value2 = ref('')
  const value3 = ref('')
</script>