<template>
  <i
    class="iconfont t-icon-root"
    :class="[iconClass, { 'is-spinning': spin }]"
    :style="iconStyle"
    role="img"
    :aria-label="name"
  />
</template>

<script>
export default {
  name: 'tIcon',
};
</script>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 支持 'search' 与 't-icon-search' 两种写法
  name: { type: String, required: true },
  size: { type: [Number, String], default: '' },
  color: { type: String, default: '' },
  spin: Boolean,
});

const iconClass = computed(() =>
  props.name.startsWith('t-icon-') ? props.name : `t-icon-${props.name}`
);
const iconStyle = computed(() => {
  const style = {};
  if (props.size !== '' && props.size !== undefined) {
    style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size;
  }
  if (props.color) style.color = props.color;
  return style;
});
</script>

<style scoped>
.is-spinning {
  animation: icon-spin 1.2s linear infinite;
}
@keyframes icon-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
