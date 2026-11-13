<template>
  <div
    ref="rootRef"
    class="pui-video"
    :class="{ 'is-fullscreen': isFullscreen, 'is-controls-hidden': !controlsVisible, 'is-playing': playing }"
    :style="rootStyle"
    @mousemove="onMouseMove"
    @mouseleave="scheduleHide"
  >
    <video
      ref="videoRef"
      class="pui-video__el"
      :src="src"
      :poster="poster"
      :preload="preload"
      playsinline
      @loadedmetadata="onLoadedMeta"
      @timeupdate="onTimeUpdate"
      @progress="onProgress"
      @play="onPlayEvent"
      @pause="onPauseEvent"
      @ended="onEnded"
      @waiting="loading = true"
      @canplay="loading = false"
      @error="onError"
      @click="onVideoClick"
      @dblclick="toggleFullscreen"
    ></video>

    <!-- 大播放按钮（未播放时） -->
    <button
      v-if="!playing && !error"
      type="button"
      class="pui-video__bigplay"
      aria-label="播放"
      @click="togglePlay"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
    </button>

    <!-- 加载中 -->
    <div v-if="loading" class="pui-video__loading" aria-hidden="true">
      <span class="pui-video__spinner"></span>
    </div>

    <!-- 错误 -->
    <div v-if="error" class="pui-video__error">
      <i class="iconfont t-icon-warning-circle" aria-hidden="true"></i>
      <span>{{ error }}</span>
    </div>

    <!-- 控制栏 -->
    <div v-show="controlsVisible || !playing" class="pui-video__controls">
      <!-- 进度条 -->
      <div
        ref="trackRef"
        class="pui-video__track"
        role="slider"
        :aria-valuemin="0"
        :aria-valuemax="Math.round(duration)"
        :aria-valuenow="Math.round(currentTime)"
        :aria-valuetext="`${fmt(currentTime)} / ${fmt(duration)}`"
        tabindex="0"
        @pointerdown.prevent="onSeekStart"
        @keydown.left.prevent="seekBy(-5)"
        @keydown.right.prevent="seekBy(5)"
      >
        <div class="pui-video__rail">
          <div class="pui-video__buffer" :style="{ width: `${bufferedPct}%` }"></div>
          <div class="pui-video__progress" :style="{ width: `${progressPct}%` }"></div>
        </div>
        <span class="pui-video__thumb" :style="{ left: `${progressPct}%` }"></span>
      </div>

      <div class="pui-video__bar">
        <!-- 播放/暂停 -->
        <button
          type="button"
          class="pui-video__btn"
          :aria-label="playing ? '暂停' : '播放'"
          @click="togglePlay"
        >
          <svg v-if="!playing" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          </svg>
        </button>

        <!-- 时间 -->
        <span class="pui-video__time">{{ fmt(currentTime) }} / {{ fmt(duration) }}</span>

        <div class="pui-video__spacer"></div>

        <!-- 音量 -->
        <div v-if="showVolume" class="pui-video__volume">
          <button
            type="button"
            class="pui-video__btn"
            :aria-label="muted ? '取消静音' : '静音'"
            @click="toggleMute"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              <path
                v-if="!muted && vol > 0"
                d="M16.5 8.5a5 5 0 0 1 0 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                v-if="muted || vol === 0"
                d="M16.5 9.5l5 5m0-5l-5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <div
            class="pui-video__vol-track"
            role="slider"
            :aria-valuemin="0"
            :aria-valuemax="100"
            :aria-valuenow="Math.round(vol * 100)"
            tabindex="0"
            @pointerdown.prevent="onVolStart"
          >
            <div class="pui-video__vol-rail">
              <div class="pui-video__vol-fill" :style="{ width: `${(muted ? 0 : vol) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <!-- 倍速 -->
        <button
          v-if="rates.length"
          type="button"
          class="pui-video__btn pui-video__btn--text"
          @click="cycleRate"
        >
          {{ rate }}x
        </button>

        <!-- 画中画 -->
        <button
          v-if="pipAvailable"
          type="button"
          class="pui-video__btn"
          :aria-label="isPip ? '退出画中画' : '画中画'"
          @click="togglePip"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
            <rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor" />
          </svg>
        </button>

        <!-- 全屏 -->
        <button
          type="button"
          class="pui-video__btn"
          :aria-label="isFullscreen ? '退出全屏' : '全屏'"
          @click="toggleFullscreen"
        >
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'tVideoPlayer' };
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  src: { type: String, default: '' },
  poster: { type: String, default: '' },
  /** 宽高比，如 '16 / 9' */
  aspectRatio: { type: String, default: '16 / 9' },
  /** 固定宽度，不传则 100% */
  width: { type: [Number, String], default: '100%' },
  preload: { type: String, default: 'metadata' },
  autoplay: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  /** 初始音量 0~1 */
  volume: { type: Number, default: 0.8 },
  showVolume: { type: Boolean, default: true },
  /** 可选倍速 */
  rates: { type: Array, default: () => [1, 1.25, 1.5, 2] },
  playbackRate: { type: Number, default: 1 },
  /** 控制栏自动隐藏延时（ms），0 表示不隐藏 */
  controlsTimeout: { type: Number, default: 2600 },
  /** 是否显示画中画按钮 */
  pip: { type: Boolean, default: true }
});

const emit = defineEmits([
  'play',
  'pause',
  'ended',
  'timeupdate',
  'seeking',
  'seeked',
  'fullscreen-change',
  'rate-change',
  'volume-change',
  'error'
]);

const rootRef = ref(null);
const videoRef = ref(null);
const trackRef = ref(null);

const playing = ref(false);
const loading = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const buffered = ref(0);
const mutedRef = ref(props.muted);
const vol = ref(props.volume);
const rate = ref(props.playbackRate);
const isFullscreen = ref(false);
const isPip = ref(false);
const error = ref('');
const controlsVisible = ref(true);

let hideTimer = null;

/* ---------------- 计算 ---------------- */
const progressPct = computed(() =>
  duration.value > 0 ? Math.min(100, (currentTime.value / duration.value) * 100) : 0
);
const bufferedPct = computed(() =>
  duration.value > 0 ? Math.min(100, (buffered.value / duration.value) * 100) : 0
);

const pipAvailable = computed(
  () => props.pip && typeof document !== 'undefined' && document.pictureInPictureEnabled
);

const rootStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  aspectRatio: props.aspectRatio
}));

/* ---------------- 工具 ---------------- */
function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/* ---------------- 播放 ---------------- */
async function togglePlay() {
  const el = videoRef.value;
  if (!el || error.value) return;

  if (playing.value) {
    el.pause();
    return;
  }

  if (!props.src) {
    error.value = '未提供视频地址';
    return;
  }

  loading.value = true;
  try {
    await el.play();
  } catch (e) {
    loading.value = false;
    const name = e && e.name ? e.name : '';
    if (name === 'NotAllowedError') {
      error.value = '浏览器拦截了自动播放，请再次点击播放';
    } else if (name === 'NotSupportedError') {
      error.value = '视频格式不支持';
    } else {
      error.value = '播放失败，请检查视频地址';
    }
    emit('error', e);
  }
}

function onVideoClick() {
  // 播放中单击视频 → 切换播放状态；未播放时中间的大按钮负责播放
  if (playing.value) togglePlay();
}

function onPlayEvent() {
  playing.value = true;
  emit('play');
  scheduleHide();
}
function onPauseEvent() {
  playing.value = false;
  emit('pause');
  controlsVisible.value = true;
  clearHide();
}
function onEnded() {
  playing.value = false;
  controlsVisible.value = true;
  emit('ended');
}

function onLoadedMeta() {
  const el = videoRef.value;
  if (!el) return;
  duration.value = Number.isFinite(el.duration) ? el.duration : 0;
  el.volume = vol.value;
  el.muted = mutedRef.value;
  el.playbackRate = rate.value;
  el.loop = props.loop;
  error.value = '';
}

function onTimeUpdate() {
  const el = videoRef.value;
  if (!el) return;
  currentTime.value = el.currentTime;
  emit('timeupdate', { currentTime: el.currentTime, duration: duration.value });
}

function onProgress() {
  const el = videoRef.value;
  if (!el || !el.buffered.length) return;
  buffered.value = el.buffered.end(el.buffered.length - 1);
}

function onError() {
  const el = videoRef.value;
  const code = el && el.error ? el.error.code : 0;
  const map = {
    1: '加载被中止',
    2: '网络错误，无法加载视频',
    3: '视频解码失败',
    4: '视频格式不支持或地址无效'
  };
  error.value = map[code] || '视频加载失败';
  loading.value = false;
  playing.value = false;
  emit('error', new Error(error.value));
}

/* ---------------- 进度 ---------------- */
function onSeekStart(e) {
  const track = trackRef.value;
  if (!track || !duration.value) return;

  const apply = (ev) => {
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
    const t = ratio * duration.value;
    currentTime.value = t;
    if (videoRef.value) videoRef.value.currentTime = t;
    emit('seeking', t);
  };

  apply(e);

  const up = (ev) => {
    apply(ev);
    emit('seeked', currentTime.value);
    window.removeEventListener('pointermove', apply);
    window.removeEventListener('pointerup', up);
  };

  window.addEventListener('pointermove', apply);
  window.addEventListener('pointerup', up);
}

function seekBy(sec) {
  const el = videoRef.value;
  if (!el || !duration.value) return;
  const t = Math.min(duration.value, Math.max(0, el.currentTime + sec));
  el.currentTime = t;
  currentTime.value = t;
}

/* ---------------- 音量 ---------------- */
function onVolStart(e) {
  const el = e.currentTarget;
  const apply = (ev) => {
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
    vol.value = ratio;
    mutedRef.value = ratio === 0;
    if (videoRef.value) {
      videoRef.value.volume = ratio;
      videoRef.value.muted = mutedRef.value;
    }
    emit('volume-change', { volume: ratio, muted: mutedRef.value });
  };

  apply(e);
  const up = () => {
    window.removeEventListener('pointermove', apply);
    window.removeEventListener('pointerup', up);
  };
  window.addEventListener('pointermove', apply);
  window.addEventListener('pointerup', up);
}

function toggleMute() {
  mutedRef.value = !mutedRef.value;
  if (videoRef.value) videoRef.value.muted = mutedRef.value;
  emit('volume-change', { volume: vol.value, muted: mutedRef.value });
}

/* ---------------- 倍速 / 画中画 / 全屏 ---------------- */
function cycleRate() {
  if (!props.rates.length) return;
  const i = props.rates.indexOf(rate.value);
  const next = props.rates[(i + 1) % props.rates.length];
  rate.value = next;
  if (videoRef.value) videoRef.value.playbackRate = next;
  emit('rate-change', next);
}

async function togglePip() {
  const el = videoRef.value;
  if (!el) return;
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      isPip.value = false;
    } else {
      await el.requestPictureInPicture();
      isPip.value = true;
    }
  } catch (e) {
    emit('error', e);
  }
}

async function toggleFullscreen() {
  const el = rootRef.value;
  if (!el) return;

  try {
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      isFullscreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullscreen.value = false;
    }
    emit('fullscreen-change', isFullscreen.value);
  } catch (e) {
    emit('error', e);
  }
}

function onFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === rootRef.value;
  emit('fullscreen-change', isFullscreen.value);
}

/* ---------------- 控制栏自动隐藏 ---------------- */
function clearHide() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function scheduleHide() {
  clearHide();
  if (!props.controlsTimeout || !playing.value) return;
  hideTimer = setTimeout(() => {
    if (playing.value) controlsVisible.value = false;
  }, props.controlsTimeout);
}

function onMouseMove() {
  controlsVisible.value = true;
  scheduleHide();
}

/* ---------------- 键盘 ---------------- */
function onKeydown(e) {
  if (!rootRef.value || !rootRef.value.contains(document.activeElement)) return;
  if (e.key === ' ') {
    e.preventDefault();
    togglePlay();
  } else if (e.key === 'f') {
    toggleFullscreen();
  } else if (e.key === 'm') {
    toggleMute();
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('keydown', onKeydown);
  if (props.autoplay) {
    setTimeout(() => togglePlay(), 0);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange);
  document.removeEventListener('keydown', onKeydown);
  clearHide();
  const el = videoRef.value;
  if (el) {
    el.pause();
    el.src = '';
  }
});

defineExpose({
  play: () => videoRef.value && videoRef.value.play(),
  pause: () => videoRef.value && videoRef.value.pause(),
  seek: (t) => {
    if (videoRef.value) videoRef.value.currentTime = t;
    currentTime.value = t;
  },
  toggleFullscreen,
  getState: () => ({
    playing: playing.value,
    currentTime: currentTime.value,
    duration: duration.value,
    volume: vol.value,
    muted: mutedRef.value,
    rate: rate.value,
    fullscreen: isFullscreen.value
  }),
  el: videoRef
});
</script>

<style scoped lang="scss">
.pui-video {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
  box-sizing: border-box;
  max-width: 100%;

  &__el {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
    cursor: pointer;
  }

  /* ---------- 大播放按钮 ---------- */
  &__bigplay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.18s ease, transform 0.18s ease;

    svg {
      width: 26px;
      height: 26px;
      margin-left: 3px;
    }

    &:hover {
      background: rgba(14, 128, 235, 0.9);
      transform: translate(-50%, -50%) scale(1.06);
    }
  }

  /* ---------- 加载 ---------- */
  &__loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  &__spinner {
    width: 30px;
    height: 30px;
    border: 2.5px solid rgba(255, 255, 255, 0.28);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pui-video-spin 0.85s linear infinite;
  }

  /* ---------- 错误 ---------- */
  &__error {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    font-size: 13px;
    background: rgba(0, 0, 0, 0.72);
    padding: 20px;
    text-align: center;

    i { font-size: 24px; }
  }

  /* ---------- 控制栏 ---------- */
  &__controls {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 30px 12px 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
    transition: opacity 0.22s ease;
    box-sizing: border-box;
  }

  &.is-controls-hidden &__controls {
    opacity: 0;
    pointer-events: none;
  }

  /* ---------- 进度 ---------- */
  &__track {
    position: relative;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;

    &:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &__rail {
    position: relative;
    width: 100%;
    height: 3.5px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.28);
    overflow: hidden;
    transition: height 0.15s ease;
  }

  &__track:hover &__rail {
    height: 5px;
  }

  &__buffer {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.42);
  }

  &__progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--pui-brand, #0e80eb);
    border-radius: 2px;
  }

  &__thumb {
    position: absolute;
    top: 50%;
    width: 11px;
    height: 11px;
    margin-left: -5.5px;
    border-radius: 50%;
    background: #fff;
    transform: translateY(-50%) scale(0);
    transition: transform 0.15s ease;
    pointer-events: none;
  }

  &__track:hover &__thumb {
    transform: translateY(-50%) scale(1);
  }

  /* ---------- 按钮条 ---------- */
  &__bar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  &__spacer {
    flex: 1;
  }

  &__btn {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: rgba(255, 255, 255, 0.92);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;

    svg {
      width: 17px;
      height: 17px;
      display: block;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }

    &--text {
      width: auto;
      padding: 0 8px;
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }
  }

  &__time {
    flex: none;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.88);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    padding: 0 4px;
  }

  /* ---------- 音量 ---------- */
  &__volume {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  &__vol-track {
    width: 52px;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;

    &:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &__vol-rail {
    width: 100%;
    height: 3.5px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  &__vol-fill {
    height: 100%;
    background: #fff;
  }

  /* 全屏时圆角归零 */
  &.is-fullscreen {
    border-radius: 0;
    width: 100vw !important;
    height: 100vh;
    aspect-ratio: auto !important;

    .pui-video__el {
      height: 100%;
    }
  }
}

@keyframes pui-video-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .pui-video__spinner { animation: none; border-top-color: #fff; }
  .pui-video__controls,
  .pui-video__bigplay,
  .pui-video__rail,
  .pui-video__thumb { transition: none; }
}
</style>
