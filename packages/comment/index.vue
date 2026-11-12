<template>
  <div :class="['pui-comment', customClass, { 'is-nested': nested }]">
    <div class="pui-comment__avatar">
      <slot name="avatar">
        <t-avatar :src="avatar" :size="avatarSize" :text="authorInitial" :alt="author" />
      </slot>
    </div>

    <div class="pui-comment__main">
      <div class="pui-comment__head">
        <span class="pui-comment__author">
          <slot name="author">{{ author }}</slot>
        </span>
        <span v-if="datetime || $slots.datetime" class="pui-comment__time">
          <slot name="datetime">{{ datetime }}</slot>
        </span>
      </div>

      <div class="pui-comment__content">
        <slot>{{ content }}</slot>
      </div>

      <div v-if="actions && actions.length" class="pui-comment__actions">
        <button
          v-for="(action, i) in actions"
          :key="i"
          type="button"
          class="pui-comment__action"
          :disabled="action.disabled"
          @click="emit('action', action, i)"
        >
          <i v-if="action.icon" :class="['iconfont', action.icon]" aria-hidden="true"></i>
          <span>{{ action.label }}</span>
        </button>
      </div>

      <div v-if="hasActionsSlot" class="pui-comment__actions">
        <slot name="actions"></slot>
      </div>

      <div v-if="collapsedText" class="pui-comment__collapsed">
        <button type="button" class="pui-comment__expand" @click="expanded = !expanded">
          {{ expanded ? '收起' : collapsedText }}
          <i :class="['iconfont', expanded ? 't-icon-arrow-up-bold' : 't-icon-arrow-down-bold']" aria-hidden="true"></i>
        </button>
        <div v-if="expanded" class="pui-comment__replies">
          <slot name="replies"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tComment'
};
</script>

<script setup>
import { computed, ref, useSlots } from 'vue';

const props = defineProps({
  /** 作者名 */
  author: { type: String, default: '' },
  /** 头像地址 */
  avatar: { type: String, default: '' },
  /** 头像尺寸 */
  avatarSize: { type: [Number, String], default: 'default' },
  /** 相对时间或绝对时间文案 */
  datetime: { type: String, default: '' },
  /** 正文内容（也可用默认插槽） */
  content: { type: String, default: '' },
  /** 操作项：[{ label, icon, disabled }] */
  actions: { type: Array, default: () => [] },
  /** 展开回复的文案前缀，如「查看 3 条回复」 */
  collapsedText: { type: String, default: '' },
  /** 是否为嵌套回复 */
  nested: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['action']);

const slots = useSlots();
const hasActionsSlot = computed(() => !!slots.actions);

const expanded = ref(false);

const authorInitial = computed(() => (props.author ? props.author.trim().charAt(0).toUpperCase() : ''));
</script>

<style scoped lang="scss">
.pui-comment {
  display: flex;
  gap: 12px;
  padding: 14px 0;

  & + & {
    border-top: 1px solid var(--pui-border, #eef2f7);
  }

  &.is-nested {
    padding: 10px 0 0;
    border-top: none;
  }

  &__avatar {
    flex: none;
    line-height: 0;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__author {
    font-size: 13px;
    font-weight: 600;
    color: var(--pui-text, #1c2534);
  }

  &__time {
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__content {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.75;
    color: var(--pui-text-sub, #5b6879);
    word-break: break-word;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 8px;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover:not(:disabled) {
      color: var(--pui-brand, #0e80eb);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  &__collapsed {
    margin-top: 8px;
    padding-left: 12px;
    border-left: 2px solid var(--pui-border, #eef2f7);
  }

  &__expand {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--pui-brand, #0e80eb);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;

    i { font-size: 10px; }
    &:hover { text-decoration: underline; }
  }

  &__replies {
    margin-top: 6px;
  }
}
</style>
