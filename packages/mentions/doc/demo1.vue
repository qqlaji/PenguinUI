<template>
  <div class="mt-demo">
    <t-mentions
      v-model="value"
      :options="members"
      placeholder="输入 @ 唤起成员列表，回车插入"
      :rows="4"
      :maxlength="200"
      show-count
      @select="onSelect"
    />

    <div class="mt-demo__preview">
      <t-typography type="secondary" size="small" block>预览（其中 @成员 会被高亮）：</t-typography>
      <div class="mt-demo__content" v-html="rendered"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const value = ref('请 @blue-sf 跟进一下这个需求');

const members = [
  { value: 'blue-sf', label: 'blue-sf', description: '作者', avatar: 'B' },
  { value: 'cindy', label: 'Cindy', description: '设计', avatar: 'C' },
  { value: 'david', label: 'David', description: '后端', avatar: 'D' },
  { value: 'penguin-bot', label: 'penguin-bot', description: '机器人', avatar: 'P' },
  { value: 'eva', label: 'Eva', description: '测试', avatar: 'E', disabled: true }
];

const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const rendered = computed(() =>
  escapeHtml(value.value)
    .replace(/\n/g, '<br/>')
    .replace(/@([\w-]+)/g, '<span class="mt-demo__at">@$1</span>')
);

const onSelect = (opt) => {
  console.log('选中成员：', opt.label);
};
</script>

<style lang="scss" scoped>
.mt-demo {
  max-width: 520px;
}
.mt-demo__preview {
  margin-top: 12px;
}
.mt-demo__content {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
  font-size: 13px;
  line-height: 1.7;
  color: var(--pui-text-sub, #5b6879);
  word-break: break-word;

  :deep(.mt-demo__at) {
    color: var(--pui-brand, #0e80eb);
    font-weight: 600;
  }
}
</style>
