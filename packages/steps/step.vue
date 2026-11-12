<template>
  <div class="pui-step-item"></div>
</template>

<script>
export default { name: 'tStep' };
</script>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  status: { type: String, default: '' }
});
</script>

<style scoped>
.pui-step-item { display: contents; }
</style>
