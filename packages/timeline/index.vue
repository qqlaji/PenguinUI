<template>
  <ul class="pui-timeline">
    <slot />
  </ul>
</template>

<script>
export default { name: 'tTimeline' };
</script>

<style scoped lang="scss">
.pui-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
