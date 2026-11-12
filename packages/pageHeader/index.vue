<template>
  <div :class="['pui-page-header', customClass, { 'is-ghost': ghost, 'is-compact': compact }]">
    <div v-if="showBack || $slots.back" class="pui-page-header__back">
      <button type="button" class="pui-page-header__back-btn" :aria-label="backText" @click="onBack">
        <slot name="back">
          <i class="iconfont t-icon-arrow-left-bold" aria-hidden="true"></i>
          <span>{{ backText }}</span>
        </slot>
      </button>
    </div>

    <div class="pui-page-header__main">
      <div v-if="breadcrumb && breadcrumb.length" class="pui-page-header__breadcrumb">
        <t-breadcrumb>
          <t-breadcrumb-item
            v-for="(item, i) in breadcrumb"
            :key="i"
            :to="item.path || ''"
            @click="onCrumb(item)"
          >
            {{ item.title }}
          </t-breadcrumb-item>
        </t-breadcrumb>
      </div>

      <div class="pui-page-header__row">
        <div class="pui-page-header__titles">
          <h1 class="pui-page-header__title">
            <slot name="title">{{ title }}</slot>
          </h1>
          <span v-if="subTitle || $slots.subTitle" class="pui-page-header__subtitle">
            <slot name="subTitle">{{ subTitle }}</slot>
          </span>
        </div>

        <div v-if="$slots.extra || extra" class="pui-page-header__extra">
          <slot name="extra">{{ extra }}</slot>
        </div>
      </div>

      <div v-if="$slots.tags" class="pui-page-header__tags">
        <slot name="tags"></slot>
      </div>
    </div>

    <div v-if="$slots.content" class="pui-page-header__content">
      <slot name="content"></slot>
    </div>

    <div v-if="$slots.footer" class="pui-page-header__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tPageHeader'
};
</script>

<script setup>
const props = defineProps({
  /** 主标题 */
  title: { type: String, default: '' },
  /** 副标题 */
  subTitle: { type: String, default: '' },
  /** 显示返回按钮 */
  showBack: { type: Boolean, default: false },
  /** 返回按钮文案 */
  backText: { type: String, default: '返回' },
  /** 面包屑：[{ title, path }] */
  breadcrumb: { type: Array, default: () => [] },
  /** 右侧操作区（也可用 extra 插槽） */
  extra: { type: String, default: '' },
  /** 无背景样式 */
  ghost: { type: Boolean, default: false },
  /** 紧凑模式 */
  compact: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const emit = defineEmits(['back', 'crumb-click']);

const onBack = () => emit('back');

const onCrumb = (item) => emit('crumb-click', item);
</script>

<style scoped lang="scss">
.pui-page-header {
  display: block;
  padding: 16px 20px;
  border-radius: 14px;
  background: var(--pui-bg-elevated, #fff);
  border: 1px solid var(--pui-border, #e7ecf3);

  &.is-ghost {
    padding: 4px 0;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  &.is-compact {
    padding: 10px 14px;
    border-radius: 12px;

    .pui-page-header__title { font-size: 15px; }
  }

  &__back {
    margin-bottom: 10px;
  }

  &__back-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px 3px 6px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--pui-text-muted, #8b96a6);
    font-family: inherit;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;

    &:hover {
      color: var(--pui-brand, #0e80eb);
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
    }

    i { font-size: 12px; }
  }

  &__breadcrumb {
    margin-bottom: 8px;

    :deep(.pui-breadcrumb__link),
    :deep(.pui-breadcrumb__text) {
      font-size: 12px;
      color: var(--pui-text-muted, #8b96a6);
    }

    :deep(.pui-breadcrumb__link:hover) {
      color: var(--pui-brand, #0e80eb);
    }
  }

  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__titles {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--pui-text, #1c2534);
    word-break: break-word;
  }

  &__subtitle {
    font-size: 13px;
    color: var(--pui-text-muted, #8b96a6);
    word-break: break-word;
  }

  &__extra {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__tags {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__content {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.75;
    color: var(--pui-text-sub, #5b6879);
  }

  &__footer {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--pui-border, #eef2f7);
  }
}
</style>
