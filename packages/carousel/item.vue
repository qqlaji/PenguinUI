<template>
  <Transition name="pui-carousel-fade">
    <div
      v-show="active"
      class="pui-carousel-item"
      :class="{ active }"
      :aria-hidden="!active"
    >
      <slot />
    </div>
  </Transition>
</template>

<script>
export default { name: 'tCarouselItem' };
</script>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';

const ctx = inject('puiCarousel', null);
const myIndex = ref(-1);

onMounted(() => {
  if (ctx) myIndex.value = ctx.register();
});

const active = computed(() => {
  if (!ctx || myIndex.value < 0) return false;
  return myIndex.value === ctx.state.activeIndex.value;
});
</script>

<style scoped lang="scss">
.pui-carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.pui-carousel-fade-enter-active,
.pui-carousel-fade-leave-active {
  transition: opacity 0.45s ease;
}
.pui-carousel-fade-enter-from,
.pui-carousel-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pui-carousel-fade-enter-active,
  .pui-carousel-fade-leave-active { transition: none; }
}
</style>
