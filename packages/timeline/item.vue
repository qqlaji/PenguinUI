<template>
  <li class="pui-timeline-item" :class="{ 'is-hollow': hollow }">
    <div class="pui-timeline-item__tail"></div>
    <div class="pui-timeline-item__node" :style="nodeStyle">
      <i v-if="icon" :class="icon"></i>
    </div>
    <div class="pui-timeline-item__wrapper">
      <div v-if="timestamp && placement === 'top'" class="pui-timeline-item__timestamp">{{ timestamp }}</div>
      <div class="pui-timeline-item__content"><slot /></div>
      <div v-if="timestamp && placement === 'bottom'" class="pui-timeline-item__timestamp">{{ timestamp }}</div>
    </div>
  </li>
</template>

<script>
export default { name: 'tTimelineItem' };
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  timestamp: { type: String, default: '' },
  color: { type: String, default: '' },
  icon: { type: String, default: '' },
  hollow: { type: Boolean, default: false },
  placement: { type: String, default: 'bottom' },
});

const nodeStyle = computed(() => {
  if (!props.color) return {};
  return props.hollow
    ? { borderColor: props.color, color: props.color }
    : { background: props.color, borderColor: props.color };
});
</script>

<style scoped lang="scss">
.pui-timeline-item {
  position: relative;
  padding-bottom: 22px;
  display: flex;
  gap: 14px;

  &:last-child { padding-bottom: 0; }
  &:last-child .pui-timeline-item__tail { display: none; }

  &__tail {
    position: absolute;
    left: 6px;
    top: 18px;
    bottom: 0;
    width: 2px;
    background: var(--pui-border, #e7ecf3);
  }
  &__node {
    position: relative;
    flex: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--pui-brand, #0e80eb);
    border: 2px solid var(--pui-brand, #0e80eb);
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    z-index: 1;

    i { font-size: 10px; }
  }
  &.is-hollow &__node {
    background: var(--pui-bg-elevated, #fff);
    color: var(--pui-brand, #0e80eb);
  }
  &__wrapper { flex: 1; min-width: 0; }
  &__timestamp {
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    margin-bottom: 4px;
    &.pui-timeline-item__timestamp { font-variant-numeric: tabular-nums; }
  }
  &__content {
    font-size: 14px;
    color: var(--pui-text, #1c2534);
    line-height: 1.6;
  }
}
</style>
