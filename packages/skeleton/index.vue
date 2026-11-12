<template>
  <div class="pui-skeleton">
    <template v-if="loading">
      <slot name="placeholder">
        <div class="pui-skeleton__inner" :class="{ 'is-animated': animated }">
          <span v-if="avatar" class="pui-skeleton__avatar" :class="{ 'is-round': avatarShape === 'circle' }"></span>
          <div class="pui-skeleton__main">
            <span v-if="title" class="pui-skeleton__title"></span>
            <span
                v-for="n in rows"
                :key="n"
                class="pui-skeleton__row"
                :style="{ width: rowWidth(n - 1) }"
            ></span>
          </div>
        </div>
      </slot>
    </template>
    <slot v-else></slot>
  </div>
</template>

<script>
export default { name: 'tSkeleton' };
</script>

<script setup>
const props = defineProps({
  loading: { type: Boolean, default: true },
  rows: { type: Number, default: 3 },
  animated: { type: Boolean, default: true },
  avatar: { type: Boolean, default: false },
  avatarShape: { type: String, default: 'circle' },
  title: { type: Boolean, default: true },
  widths: { type: Array, default: () => [] },
});
const defaultWidths = ['100%', '90%', '72%', '96%'];
const rowWidth = (index) => props.widths[index] || defaultWidths[index % defaultWidths.length];
</script>

<style scoped lang="scss">
.pui-skeleton { width: 100%; }
.pui-skeleton__inner { display: flex; align-items: flex-start; gap: 14px; width: 100%; }
.pui-skeleton__avatar {
  flex: none; width: 44px; height: 44px; border-radius: 8px;
  background: #edf1f6;
  &.is-round { border-radius: 50%; }
}
.pui-skeleton__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
.pui-skeleton__title { display: block; width: 38%; height: 16px; border-radius: 4px; background: #e5ebf2; }
.pui-skeleton__row { display: block; height: 12px; border-radius: 4px; background: #edf1f6; }
.pui-skeleton__inner.is-animated {
  .pui-skeleton__avatar, .pui-skeleton__title, .pui-skeleton__row {
    background: linear-gradient(90deg, #edf1f6 25%, #f7f9fc 50%, #edf1f6 75%);
    background-size: 400% 100%;
    animation: pui-skeleton-loading 1.6s ease infinite;
  }
}
@keyframes pui-skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
