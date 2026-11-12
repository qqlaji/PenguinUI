<template>
  <i
    class="iconfont t-icon-root"
    :class="[iconClass, { 'is-spinning': spin, 'is-pulsing': pulse }]"
    :style="iconStyle"
    role="img"
    :aria-label="title || name"
    :title="title || undefined"
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
  // ===== v1.9 新增 =====
  // 旋转角度（deg），传数字即可
  rotate: { type: [Number, String], default: '' },
  // 翻转：horizontal / vertical / both
  flip: { type: String, default: '' },
  // 脉冲式旋转（步进动画，比 spin 更柔和）
  pulse: Boolean,
  // 原生悬停提示
  title: { type: String, default: '' },
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

  const transforms = [];
  if (props.rotate !== '' && props.rotate !== undefined) {
    transforms.push(`rotate(${props.rotate}deg)`);
  }
  if (props.flip === 'horizontal') transforms.push('scaleX(-1)');
  else if (props.flip === 'vertical') transforms.push('scaleY(-1)');
  else if (props.flip === 'both') transforms.push('scale(-1)');
  if (transforms.length) style.transform = transforms.join(' ');
  return style;
});
</script>

<style scoped>
.is-spinning {
  animation: icon-spin 1.2s linear infinite;
}
.is-pulsing {
  animation: icon-pulse 1.2s steps(8) infinite;
}
@keyframes icon-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes icon-pulse {
  to {
    transform: rotate(360deg);
  }
}
</style>
