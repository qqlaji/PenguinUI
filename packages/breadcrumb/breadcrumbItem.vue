<template>
  <div :class="['penguin-breadcrumb-item', customClass]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'tBreadcrumbItem'
}
</script>

<script setup>
const props = defineProps({
  customClass: String
})
</script>

<style lang="scss" scoped></style>
