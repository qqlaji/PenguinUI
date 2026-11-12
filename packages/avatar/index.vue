<template>
  <span class="pui-avatar" :class="classes" :style="avatarStyle" :title="alt || text || ''">
    <img
        v-if="src && !failed"
        :src="src"
        :alt="alt"
        :style="{ objectFit: fit }"
        @error="onError"
    />
    <i v-else-if="icon && !failed" class="iconfont pui-avatar__icon" :class="icon"></i>
    <span v-else class="pui-avatar__text"><slot>{{ fallbackText }}</slot></span>
  </span>
</template>

<script>
export default { name: 'tAvatar' };
</script>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  size: { type: [Number, String], default: 'default' },  // number | large | default | small | '48px'
  shape: { type: String, default: 'circle' },            // circle | square
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  icon: { type: String, default: '' },                   // t-icon-* 类名
  text: { type: String, default: '' },
  fit: { type: String, default: 'cover' },
  bgColor: { type: String, default: '' },
  color: { type: String, default: '' },
  bordered: { type: Boolean, default: false },
});
const emit = defineEmits(['error']);
const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });

const sizeValue = computed(() => {
  const presets = { large: 56, default: 40, small: 28 };
  if (typeof props.size === 'number') return `${props.size}px`;
  if (presets[props.size]) return `${presets[props.size]}px`;
  return props.size || '40px';
});
const fontSize = computed(() => {
  const n = parseInt(sizeValue.value, 10) || 40;
  return `${Math.max(11, Math.round(n * 0.36))}px`;
});
const fallbackText = computed(() => props.text || (props.alt ? props.alt.slice(0, 1) : '?'));
const classes = computed(() => [
  `pui-avatar--${props.shape}`,
  { 'pui-avatar--bordered': props.bordered, 'pui-avatar--icon': !!props.icon && !failed.value },
]);
const avatarStyle = computed(() => ({
  width: sizeValue.value,
  height: sizeValue.value,
  fontSize: fontSize.value,
  background: props.bgColor || '#e8f1fd',
  color: props.color || '#0e80eb',
}));
const onError = (e) => {
  failed.value = true;
  emit('error', e);
};
</script>

<style scoped lang="scss">
.pui-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  box-sizing: border-box;
  font-weight: 600;
  line-height: 1;
  user-select: none;
  vertical-align: middle;
  img { width: 100%; height: 100%; display: block; }
  &--circle { border-radius: 50%; }
  &--square { border-radius: 8px; }
  &--bordered { box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(14, 128, 235, 0.25); }
  &__text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  &__icon { font-size: 1.3em; }
}
</style>
