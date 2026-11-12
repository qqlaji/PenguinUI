<template>
  <div
    :class="[
      'pui-bubble',
      `pui-bubble--${placement}`,
      `pui-bubble--${variant}`,
      customClass,
      { 'is-loading': loading }
    ]"
  >
    <div v-if="$slots.avatar || avatar" class="pui-bubble__avatar">
      <slot name="avatar">
        <t-avatar :src="avatar" :text="avatarText" :size="avatarSize" />
      </slot>
    </div>

    <div class="pui-bubble__main">
      <div v-if="name || time" class="pui-bubble__meta">
        <span v-if="name" class="pui-bubble__name">{{ name }}</span>
        <span v-if="time" class="pui-bubble__time">{{ time }}</span>
      </div>

      <div class="pui-bubble__row">
        <div class="pui-bubble__content" :style="bubbleStyle">
          <span v-if="loading" class="pui-bubble__typing" aria-label="正在输入">
            <i></i><i></i><i></i>
          </span>
          <slot>
            <span class="pui-bubble__text">{{ content }}</span>
          </slot>
        </div>

        <span v-if="$slots.extra" class="pui-bubble__extra">
          <slot name="extra"></slot>
        </span>
      </div>

      <div v-if="$slots.footer" class="pui-bubble__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tBubble'
};
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** 气泡文字（也可用默认插槽） */
  content: { type: String, default: '' },
  /** 位置：left 对方 / right 自己 */
  placement: { type: String, default: 'left' },
  /** 变体：filled 填充 / outlined 描边 / text 纯文字 */
  variant: { type: String, default: 'filled' },
  /** 气泡最大宽度 */
  maxWidth: { type: [Number, String], default: '' },
  /** 气泡底色（覆盖默认） */
  bgColor: { type: String, default: '' },
  /** 气泡字色（覆盖默认） */
  textColor: { type: String, default: '' },
  /** 显示为「正在输入」 */
  loading: { type: Boolean, default: false },
  /** 头像地址 */
  avatar: { type: String, default: '' },
  /** 头像尺寸 */
  avatarSize: { type: [Number, String], default: 'default' },
  /** 发言人名称 */
  name: { type: String, default: '' },
  /** 时间文案 */
  time: { type: String, default: '' },
  customClass: { type: String, default: '' }
});

const toPx = (v) => {
  if (v === '' || v === null || v === undefined) return '';
  if (typeof v === 'number') return `${v}px`;
  const s = String(v).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

const bubbleStyle = computed(() => {
  const style = {};
  if (props.maxWidth !== '') style.maxWidth = toPx(props.maxWidth);
  if (props.bgColor) style.background = props.bgColor;
  if (props.textColor) style.color = props.textColor;
  return style;
});

const avatarText = computed(() => (props.name ? props.name.trim().charAt(0).toUpperCase() : ''));
</script>

<style scoped lang="scss">
.pui-bubble {
  display: flex;
  gap: 10px;
  padding: 8px 0;

  &--right {
    flex-direction: row-reverse;

    .pui-bubble__main { align-items: flex-end; }
    .pui-bubble__meta { flex-direction: row-reverse; }
    .pui-bubble__row { flex-direction: row-reverse; }
  }

  &__avatar {
    flex: none;
    line-height: 0;
    padding-top: 2px;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    max-width: 100%;
  }

  &__meta {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__name {
    font-weight: 600;
    color: var(--pui-text-sub, #5b6879);
  }

  &__row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    max-width: 100%;
  }

  &__content {
    position: relative;
    max-width: 460px;
    padding: 9px 13px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--pui-text, #1c2534);
    word-break: break-word;
    background: var(--pui-bg-soft, #f7f9fc);
  }

  /* ---------- 尖角：用旋转方块伪装，避免 SVG 抖动 ---------- */
  &__content::after {
    content: '';
    position: absolute;
    top: 13px;
    width: 8px;
    height: 8px;
    background: inherit;
    transform: rotate(45deg);
    border-radius: 1px;
  }

  &--left &__content {
    border-bottom-left-radius: 5px;

    &::after { left: -3px; }
  }

  &--right &__content {
    border-bottom-right-radius: 5px;

    &::after { right: -3px; }
  }

  /* ---------- 变体 ---------- */
  &--filled.pui-bubble--right &__content {
    background: var(--pui-brand, #0e80eb);
    color: #fff;
  }

  &--outlined &__content {
    background: var(--pui-bg-elevated, #fff);
    border: 1px solid var(--pui-border-strong, #d8e0ea);
  }

  &--outlined &__content::after {
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-top: none;
    border-right: none;
    background: var(--pui-bg-elevated, #fff);
  }

  &--outlined.pui-bubble--right &__content::after {
    border: 1px solid var(--pui-border-strong, #d8e0ea);
    border-bottom: none;
    border-left: none;
  }

  &--text &__content {
    padding: 2px 0;
    background: transparent;
    border-radius: 0;
    color: var(--pui-text, #1c2534);

    &::after { display: none; }
  }

  &__text {
    white-space: pre-wrap;
  }

  &__extra {
    flex: none;
    display: inline-flex;
    align-items: center;
    color: var(--pui-text-muted, #8b96a6);
    font-size: 12px;
  }

  &__footer {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }

  /* ---------- 输入中动画 ---------- */
  &__typing {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 20px;

    i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.45;
      animation: pui-bubble-typing 1.2s infinite ease-in-out;

      &:nth-child(2) { animation-delay: 0.16s; }
      &:nth-child(3) { animation-delay: 0.32s; }
    }
  }

  &.is-loading &__content {
    padding: 10px 14px;
  }
}

@keyframes pui-bubble-typing {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}

@media (prefers-reduced-motion: reduce) {
  .pui-bubble__typing i { animation: none; opacity: 0.6; }
}
</style>
