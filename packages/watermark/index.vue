<template>
  <div ref="rootRef" :class="['pui-watermark', customClass]" :style="{ zIndex }">
    <slot />
    <div class="pui-watermark__layer" :style="layerStyle" aria-hidden="true"></div>
  </div>
</template>

<script>
export default {
  name: 'tWatermark'
};
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  /** 水印文字，传数组则多行 */
  content: { type: [String, Array], default: '' },
  /** 图片水印地址，设置后优先使用图片 */
  image: { type: String, default: '' },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 64 },
  /** 水印之间的水平 / 垂直间距 */
  gapX: { type: Number, default: 100 },
  gapY: { type: Number, default: 100 },
  rotate: { type: Number, default: -22 },
  opacity: { type: Number, default: 0.15 },
  /** 文字样式 */
  fontColor: { type: String, default: 'rgba(0, 0, 0, 1)' },
  fontSize: { type: Number, default: 14 },
  fontFamily: { type: String, default: 'sans-serif' },
  fontWeight: { type: [String, Number], default: 'normal' },
  fontStyle: { type: String, default: 'normal' },
  /** 图片水印尺寸 */
  imageWidth: { type: Number, default: 0 },
  imageHeight: { type: Number, default: 0 },
  zIndex: { type: Number, default: 9 },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['rendered']);

const bgUrl = ref('');
const rootRef = ref(null);
let resizeObserver = null;
let rafId = 0;

const textLines = computed(() => {
  if (Array.isArray(props.content)) return props.content.filter(Boolean);
  return props.content ? String(props.content).split('\n') : [];
});

const buildCanvas = () => {
  if (typeof document === 'undefined') return '';
  const ratio = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');

  if (props.image) {
    const w = (props.imageWidth || props.width) + props.gapX;
    const h = (props.imageHeight || props.height) + props.gapY;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.globalAlpha = props.opacity;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = props.image;
    img.onload = () => {
      const iw = props.imageWidth || props.width;
      const ih = props.imageHeight || props.height;
      ctx.drawImage(img, props.gapX / 2, props.gapY / 2, iw, ih);
      bgUrl.value = canvas.toDataURL();
      emit('rendered');
    };
    img.onerror = () => {
      bgUrl.value = '';
    };
    return canvas.toDataURL();
  }

  const lines = textLines.value;
  const w = props.width + props.gapX;
  const h = props.height + props.gapY;
  canvas.width = w * ratio;
  canvas.height = h * ratio;

  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  ctx.translate(w / 2, h / 2);
  ctx.rotate((props.rotate * Math.PI) / 180);
  ctx.globalAlpha = props.opacity;
  ctx.fillStyle = props.fontColor;
  ctx.font = `${props.fontStyle} ${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lineHeight = props.fontSize + 8;
  const totalH = lines.length * lineHeight;
  lines.forEach((line, i) => {
    ctx.fillText(line, 0, -totalH / 2 + lineHeight / 2 + i * lineHeight);
  });

  return canvas.toDataURL();
};

const redraw = () => {
  const url = buildCanvas();
  if (url && !props.image) bgUrl.value = url;
};

const layerStyle = computed(() => {
  if (!bgUrl.value) return { display: 'none' };
  return {
    backgroundImage: `url(${bgUrl.value})`,
    backgroundRepeat: 'repeat',
    backgroundSize: `${props.width + props.gapX}px ${props.height + props.gapY}px`
  };
});

const scheduleRedraw = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    redraw();
  });
};

watch(
  () => [
    props.content, props.image, props.width, props.height, props.gapX, props.gapY,
    props.rotate, props.opacity, props.fontColor, props.fontSize, props.fontFamily,
    props.fontWeight, props.fontStyle, props.imageWidth, props.imageHeight
  ],
  scheduleRedraw,
  { deep: true }
);

onMounted(() => {
  redraw();
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleRedraw);
    if (rootRef.value) resizeObserver.observe(rootRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
});

defineExpose({ redraw: scheduleRedraw });
</script>

<style lang="scss" scoped>
.pui-watermark {
  position: relative;
  overflow: hidden;
}

.pui-watermark__layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}
</style>
