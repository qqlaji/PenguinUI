<!-- html -->
<template>
  <t-input v-model="value1" clearable>
    <template #btn>
      <t-button type="primary" leftIcon="t-icon-search">搜索</t-button>
    </template>
  </t-input>
</template>

<!-- js -->
<script setup>
  import {ref} from 'vue'
  const value1 = ref('')
</script>