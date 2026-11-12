<template>
  <div class="pui-empty">
    <div class="pui-empty__image" :style="{ width: `${imageSize}px` }">
      <slot name="image">
        <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="80" cy="104" rx="56" ry="8" fill="currentColor" opacity="0.08" />
          <circle cx="80" cy="56" r="46" fill="currentColor" opacity="0.06" />
          <path d="M52 46h56l-6 44a8 8 0 0 1-8 7H66a8 8 0 0 1-8-7l-6-44Z" fill="#fff" stroke="currentColor" stroke-opacity="0.35" stroke-width="2" />
          <path d="M45 38c0-3 2.5-5.5 5.5-5.5h59c3 0 5.5 2.5 5.5 5.5v8H45v-8Z" fill="currentColor" opacity="0.16" stroke="currentColor" stroke-opacity="0.35" stroke-width="2" />
          <path d="M68 62h24M68 74h16" stroke="currentColor" stroke-opacity="0.42" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="122" cy="34" r="4" fill="currentColor" opacity="0.28" />
          <circle cx="35" cy="62" r="3" fill="currentColor" opacity="0.22" />
          <path d="M128 70l2.2 4.8 5 0.6-3.7 3.5 1 5.1-4.5-2.5-4.5 2.5 1-5.1-3.7-3.5 5-.6 2.2-4.8Z" fill="currentColor" opacity="0.3" />
        </svg>
      </slot>
    </div>
    <p class="pui-empty__desc"><slot name="description">{{ description }}</slot></p>
    <div v-if="$slots.default" class="pui-empty__action"><slot /></div>
  </div>
</template>

<script>
export default { name: 'tEmpty' };
</script>

<script setup>
import { useSlots } from 'vue';

defineProps({
  description: { type: String, default: '暂无数据' },
  imageSize: { type: Number, default: 140 },
});
const $slots = useSlots();
</script>

<style scoped lang="scss">
.pui-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: #0e80eb;
  text-align: center;
}
.pui-empty__image { max-width: 100%; svg { width: 100%; height: auto; display: block; } }
.pui-empty__desc { margin: 4px 0 0; font-size: 13.5px; color: #8b96a6; }
.pui-empty__action { margin-top: 10px; }
</style>
