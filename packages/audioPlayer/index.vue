<template>
  <div class="pui-audio" :class="[`pui-audio--${variant}`, { 'is-disabled': disabled, 'is-error': !!error }]">
    <!-- 封面 / 可视化 -->
    <div v-if="variant === 'card' || cover" class="pui-audio__cover">
      <img v-if="cover" :src="cover" :alt="title || '封面'" class="pui-audio__cover-img" />
      <div v-else class="pui-audio__cover-ph">
        <i class="iconfont t-icon-file" aria-hidden="true"></i>
      </div>

      <!-- 播放时叠一层波形动画 -->
      <div v-if="playing" class="pui-audio__cover-wave" aria-hidden="true">
        <span v-for="n in 5" :key="n" :style="{ animationDelay: `${n * 0.12}s` }"></span>
      </div>
    </div>

    <div class="pui-audio__main">
      <!-- 标题行 -->
      <div v-if="title || subtitle" class="pui-audio__meta">
        <div class="pui-audio__title" :title="title">{{ title }}</div>
        <div v-if="subtitle" class="pui-audio__subtitle">{{ subtitle }}</div>
      </div>

      <!-- 控制栏 -->
      <div class="pui-audio__controls">
        <button
          type="button"
          class="pui-audio__btn pui-audio__btn--play"
          :disabled="disabled || !!error"
          :aria-label="playing ? '暂停' : '播放'"
          @click="togglePlay"
        >
          <i
            :class="['iconfont', loading ? 't-icon-round-loading is-spin' : playing ? 't-icon-stop' : 't-icon-play']"
            aria-hidden="true"
          ></i>
        </button>

        <!-- 进度条 -->
        <div
          ref="trackRef"
          class="pui-audio__track"
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
          <div class="pui-audio__rail">
            <div class="pui-audio__buffer" :style="{ width: `${bufferedPct}%` }"></div>
            <div class="pui-audio__progress" :style="{ width: `${progressPct}%` }"></div>
          </div>
          <span class="pui-audio__thumb" :style="{ left: `${progressPct}%` }"></span>

          <!-- 拖拽时的悬浮时间提示 -->
          <span v-if="seeking" class="pui-audio__seek-tip" :style="{ left: `${seekTipPct}%` }">
            {{ seekTipLabel }}
          </span>
        </div>

        <span class="pui-audio__time">{{ fmt(currentTime) }} / {{ fmt(duration) }}</span>

        <!-- 音量 -->
        <div v-if="showVolume" class="pui-audio__volume">
          <button
            type="button"
            class="pui-audio__btn pui-audio__btn--small"
            :aria-label="muted ? '取消静音' : '静音'"
            @click="toggleMute"
          >
            <!-- 图标集里没有音量图标，用内联 SVG 保证语义准确 -->
            <svg class="pui-audio__svg" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 9v6h4l5 4V5L8 9H4z"
                fill="currentColor"
              />
              <path
                v-if="!muted && vol > 0"
                d="M16.5 8.5a5 5 0 0 1 0 7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                v-if="!muted && vol > 0.5"
                d="M19 6a8.5 8.5 0 0 1 0 12"
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
            class="pui-audio__vol-track"
            role="slider"
            :aria-valuemin="0"
            :aria-valuemax="100"
            :aria-valuenow="Math.round(volume * 100)"
            tabindex="0"
            @pointerdown.prevent="onVolStart"
          >
            <div class="pui-audio__vol-rail">
              <div class="pui-audio__vol-fill" :style="{ width: `${(muted ? 0 : volume) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <!-- 倍速 -->
        <div v-if="rates.length" class="pui-audio__rate">
          <button
            type="button"
            class="pui-audio__btn pui-audio__btn--text"
            :aria-label="`倍速 ${playbackRate}x`"
            @click="cycleRate"
          >
            {{ playbackRate }}x
          </button>
        </div>

        <!-- 循环 -->
        <button
          v-if="loopable"
          type="button"
          class="pui-audio__btn pui-audio__btn--small"
          :class="{ 'is-on': loopOn }"
          :aria-label="loopOn ? '关闭循环' : '开启循环'"
          :aria-pressed="loopOn"
          @click="toggleLoop"
        >
          <i class="iconfont t-icon-refresh" aria-hidden="true"></i>
        </button>

        <!-- 下载 -->
        <a
          v-if="downloadable && src"
          class="pui-audio__btn pui-audio__btn--small"
          :href="src"
          :download="downloadName"
          :aria-label="'下载音频'"
        >
          <i class="iconfont t-icon-download" aria-hidden="true"></i>
        </a>
      </div>

      <div v-if="error" class="pui-audio__error">
        <i class="iconfont t-icon-warning-circle" aria-hidden="true"></i>
        {{ error }}
      </div>
    </div>

    <!-- 真正的 audio 元素（隐藏） -->
    <audio
      ref="audioRef"
      :src="src"
      preload="metadata"
      @loadedmetadata="onLoadedMeta"
      @timeupdate="onTimeUpdate"
      @progress="onProgress"
      @ended="onEnded"
      @play="onPlayEvent"
      @pause="onPauseEvent"
      @error="onError"
      @waiting="loading = true"
      @canplay="loading = false"
    ></audio>
  </div>
</template>

<script>
export default { name: 'tAudioPlayer' };
</script>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  /** 音频地址 */
  src: { type: String, default: '' },
  /** 标题与副标题 */
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  /** 封面图 */
  cover: { type: String, default: '' },
  /** 样式变体：mini 紧凑 / default / card 带封面 */
  variant: { type: String, default: 'default' },
  /** 是否自动播放（浏览器可能拦截） */
  autoplay: { type: Boolean, default: false },
  /** 是否循环 */
  loop: { type: Boolean, default: false },
  /** 是否显示循环按钮 */
  loopable: { type: Boolean, default: true },
  /** 初始音量 0~1 */
  volume: { type: Number, default: 0.8 },
  /** 是否显示音量控制 */
  showVolume: { type: Boolean, default: true },
  /** 可选倍速列表，传空数组隐藏 */
  rates: { type: Array, default: () => [1, 1.25, 1.5, 2] },
  /** 初始倍速 */
  playbackRate: { type: Number, default: 1 },
  /** 是否显示下载 */
  downloadable: { type: Boolean, default: false },
  /** 下载文件名 */
  downloadName: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits([
  'play',
  'pause',
  'ended',
  'timeupdate',
  'seeking',
  'seeked',
  'volume-change',
  'rate-change',
  'error'
]);

const audioRef = ref(null);
const trackRef = ref(null);

const playing = ref(false);
const loading = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const buffered = ref(0);
const muted = ref(false);
const vol = ref(props.volume);
const rate = ref(props.playbackRate);
const loopOn = ref(props.loop);
const error = ref('');

const seeking = ref(false);
const seekTipPct = ref(0);
const seekTipTime = ref(0);
/** 拖拽提示文本（时长未就绪时显示百分比） */
const seekTipLabel = ref('00:00');
/** 拖拽中的临时比例，null 表示未在拖拽 */
const dragRatio = ref(null);

/* ---------------- 计算属性 ---------------- */
const progressPct = computed(() => {
  // 拖拽中优先显示拖拽位置，保证滑条跟手（即使 duration 还没就绪）
  if (dragRatio.value !== null) return Math.min(100, dragRatio.value * 100);
  return duration.value > 0 ? Math.min(100, (currentTime.value / duration.value) * 100) : 0;
});

const bufferedPct = computed(() =>
  duration.value > 0 ? Math.min(100, (buffered.value / duration.value) * 100) : 0
);

/* ---------------- 工具 ---------------- */
function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ---------------- 播放控制 ---------------- */
async function togglePlay() {
  const el = audioRef.value;
  if (!el || props.disabled) return;

  if (playing.value) {
    el.pause();
    return;
  }

  // 没有 src 或加载失败时不尝试播放，直接给出提示
  if (!props.src) {
    error.value = '未提供音频地址';
    return;
  }
  if (error.value && error.value !== '') {
    // 已有错误时先重试加载
    error.value = '';
    el.load();
  }

  loading.value = true;
  try {
    await el.play();
    error.value = '';
  } catch (e) {
    loading.value = false;
    /*
     * play() 被拒绝有两种情况：
     * 1. 自动播放策略拦截（NotAllowedError）→ 不当作错误，等用户再点一次
     * 2. 其他错误（格式不支持、网络）→ 提示用户
     */
    const name = e && e.name ? e.name : '';
    if (name === 'NotAllowedError') {
      error.value = '浏览器拦截了自动播放，请再次点击播放';
    } else if (name === 'NotSupportedError') {
      error.value = '音频格式不支持';
    } else {
      error.value = '播放失败，请检查音频地址';
    }
    playing.value = false;
    emit('error', e);
  }
}

function onPlayEvent() {
  playing.value = true;
  emit('play');
}

function onPauseEvent() {
  playing.value = false;
  emit('pause');
}

function onEnded() {
  playing.value = false;
  emit('ended');
  if (loopOn.value && audioRef.value) {
    audioRef.value.currentTime = 0;
    audioRef.value.play().catch(() => {});
  }
}

function onLoadedMeta() {
  const el = audioRef.value;
  if (!el) return;
  // 部分格式的 duration 是 Infinity（流式），这里兜一下
  duration.value = Number.isFinite(el.duration) ? el.duration : 0;
  el.volume = vol.value;
  el.muted = muted.value;
  el.playbackRate = rate.value;
  error.value = '';
}

function onTimeUpdate() {
  const el = audioRef.value;
  if (!el || seeking.value) return;
  currentTime.value = el.currentTime;
  emit('timeupdate', { currentTime: el.currentTime, duration: duration.value });
}

function onProgress() {
  const el = audioRef.value;
  if (!el || !el.buffered.length) return;
  buffered.value = el.buffered.end(el.buffered.length - 1);
}

function onError() {
  const el = audioRef.value;
  const code = el && el.error ? el.error.code : 0;
  const map = {
    1: '加载被中止',
    2: '网络错误，无法加载音频',
    3: '音频解码失败',
    4: '音频格式不支持或地址无效'
  };
  error.value = map[code] || '音频加载失败';
  loading.value = false;
  playing.value = false;
  emit('error', new Error(error.value));
}

/* ---------------- 进度拖拽 ---------------- */
function pctFromEvent(e, el) {
  const rect = el.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  return Math.min(1, Math.max(0, ratio));
}

function onSeekStart(e) {
  if (props.disabled) return;

  /*
   * 不能因为 duration 还没加载完就直接 return：
   * 流式音频 / 首次点开时 duration 常为 0，用户会觉得"进度条完全拖不动"。
   * 做法：始终允许拖拽并更新视觉位置，只有在 duration 有效时才真正 seek。
   */
  const el = trackRef.value;
  if (!el) return;

  seeking.value = true;
  updateSeekTip(e, el);

  const move = (ev) => updateSeekTip(ev, el);
  const up = (ev) => {
    const ratio = pctFromEvent(ev, el);
    commitSeek(ratio);
    seeking.value = false;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
}

function updateSeekTip(e, el) {
  if (!el) return;
  const ratio = pctFromEvent(e, el);
  seekTipPct.value = ratio * 100;

  if (duration.value > 0) {
    seekTipTime.value = ratio * duration.value;
    seekTipLabel.value = fmt(ratio * duration.value);
  } else {
    // 时长未就绪：只显示百分比，避免一直显示 00:00 让人以为拖动无效
    seekTipTime.value = 0;
    seekTipLabel.value = `${Math.round(ratio * 100)}%`;
  }

  // 无论时长是否就绪，进度条视觉都跟手
  dragRatio.value = ratio;
}

function commitSeek(ratio) {
  const el = audioRef.value;
  dragRatio.value = null;

  if (!el || !duration.value) return;

  const t = ratio * duration.value;
  el.currentTime = t;
  currentTime.value = t;
  emit('seeking', t);
  emit('seeked', t);
}

function seekBy(sec) {
  const el = audioRef.value;
  if (!el || !duration.value) return;
  const t = Math.min(duration.value, Math.max(0, el.currentTime + sec));
  el.currentTime = t;
  currentTime.value = t;
}

/* ---------------- 音量 ---------------- */
function onVolStart(e) {
  const el = e.currentTarget;
  const applyVol = (ev) => {
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
    vol.value = ratio;
    muted.value = ratio === 0;
    if (audioRef.value) {
      audioRef.value.volume = ratio;
      audioRef.value.muted = muted.value;
    }
    emit('volume-change', { volume: ratio, muted: muted.value });
  };

  applyVol(e);

  const move = (ev) => applyVol(ev);
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
}

function toggleMute() {
  muted.value = !muted.value;
  if (audioRef.value) audioRef.value.muted = muted.value;
  emit('volume-change', { volume: vol.value, muted: muted.value });
}

/* ---------------- 倍速 / 循环 ---------------- */
function cycleRate() {
  if (!props.rates.length) return;
  const i = props.rates.indexOf(rate.value);
  const next = props.rates[(i + 1) % props.rates.length];
  rate.value = next;
  if (audioRef.value) audioRef.value.playbackRate = next;
  emit('rate-change', next);
}

function toggleLoop() {
  loopOn.value = !loopOn.value;
  if (audioRef.value) audioRef.value.loop = false; // 用自定义 ended 处理，避免与原生 loop 冲突
}

/* ---------------- 外部控制 ---------------- */
watch(
  () => props.src,
  () => {
    currentTime.value = 0;
    duration.value = 0;
    buffered.value = 0;
    playing.value = false;
    error.value = '';
  }
);

watch(
  () => props.volume,
  (v) => {
    vol.value = v;
    if (audioRef.value) audioRef.value.volume = v;
  }
);

onBeforeUnmount(() => {
  const el = audioRef.value;
  if (el) {
    el.pause();
    el.src = '';
  }
});

// 自动播放
if (props.autoplay) {
  setTimeout(() => togglePlay(), 0);
}

defineExpose({
  play: () => audioRef.value && audioRef.value.play(),
  pause: () => audioRef.value && audioRef.value.pause(),
  seek: (t) => {
    if (audioRef.value) audioRef.value.currentTime = t;
    currentTime.value = t;
  },
  getState: () => ({
    playing: playing.value,
    currentTime: currentTime.value,
    duration: duration.value,
    volume: vol.value,
    muted: muted.value,
    rate: rate.value
  }),
  el: audioRef
});
</script>

<style scoped lang="scss">
.pui-audio {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
  box-sizing: border-box;
  max-width: 100%;

  &--card {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  &--mini {
    padding: 8px 10px;
    gap: 10px;
    border-radius: 10px;
  }

  /* ---------- 封面 ---------- */
  &__cover {
    position: relative;
    flex: none;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    background: var(--pui-bg-soft, #f0f3f8);

    .pui-audio--card & {
      width: 100%;
      height: 160px;
      border-radius: 10px;
    }
  }

  &__cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__cover-ph {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    color: var(--pui-text-muted, #8b96a6);

    i { font-size: 22px; }
  }

  &__cover-wave {
    position: absolute;
    inset: auto 0 0 0;
    height: 34px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
    padding-bottom: 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.42));

    span {
      width: 3px;
      border-radius: 2px;
      background: #fff;
      animation: pui-audio-wave 0.9s ease-in-out infinite alternate;
    }
  }

  /* ---------- 主区 ---------- */
  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__meta {
    min-width: 0;
  }

  &__title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--pui-text, #1c2534);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__subtitle {
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ---------- 控制栏 ---------- */
  &__controls {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__btn {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--pui-text-sub, #5b6879);
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    transition: color 0.15s ease, background-color 0.15s ease;

    &:hover:not(:disabled) {
      color: var(--pui-brand, #0e80eb);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    i { font-size: 14px; }

    &--play {
      width: 32px;
      height: 32px;
      background: var(--pui-brand, #0e80eb);
      color: #fff;

      &:hover:not(:disabled) {
        background: var(--pui-brand-hover, #0d73d4);
        color: #fff;
      }

      i { font-size: 14px; }
    }

    &--small {
      width: 24px;
      height: 24px;
      i { font-size: 13px; }
    }

    &__svg {
      width: 15px;
      height: 15px;
      display: block;
    }

    &--text {
      width: auto;
      height: 24px;
      padding: 0 6px;
      border-radius: 6px;
      font-size: 12px;
      font-variant-numeric: tabular-nums;

      &:hover { background: var(--pui-brand-soft, rgba(14, 128, 235, 0.1)); }
    }

    &.is-on {
      color: var(--pui-brand, #0e80eb);
    }
  }

  /* ---------- 进度条 ---------- */
  &__track {
    position: relative;
    flex: 1;
    min-width: 40px;
    height: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;

    &:focus-visible {
      outline: 2px solid var(--pui-brand, #0e80eb);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &__rail {
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--pui-border, #e2e8f2);
    overflow: hidden;
  }

  &__buffer {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--pui-border-strong, #cdd7e4);
    transition: width 0.2s linear;
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
    border: 2px solid var(--pui-brand, #0e80eb);
    transform: translateY(-50%) scale(0.85);
    transition: transform 0.15s ease;
    pointer-events: none;
  }

  &__track:hover &__thumb {
    transform: translateY(-50%) scale(1);
  }

  &__seek-tip {
    position: absolute;
    bottom: 22px;
    transform: translateX(-50%);
    padding: 2px 6px;
    border-radius: 5px;
    background: rgba(28, 37, 52, 0.9);
    color: #fff;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    pointer-events: none;
  }

  &__time {
    flex: none;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* ---------- 音量 ---------- */
  &__volume {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__vol-track {
    width: 56px;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;

    &:focus-visible {
      outline: 2px solid var(--pui-brand, #0e80eb);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  &__vol-rail {
    width: 100%;
    height: 3px;
    border-radius: 2px;
    background: var(--pui-border, #e2e8f2);
    overflow: hidden;
  }

  &__vol-fill {
    height: 100%;
    background: var(--pui-text-sub, #5b6879);
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--pui-danger, #ec3437);

    i { font-size: 12px; }
  }

  &.is-disabled {
    opacity: 0.6;
  }
}

@keyframes pui-audio-wave {
  from { height: 4px; }
  to { height: 18px; }
}

.is-spin {
  animation: pui-audio-spin 0.9s linear infinite;
  display: inline-block;
}

@keyframes pui-audio-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .is-spin { animation: none; }
  .pui-audio__cover-wave span { animation: none; height: 10px; }
  .pui-audio__thumb { transition: none; }
}
</style>
