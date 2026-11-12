<template>
  <div class="cm-demo">
    <div class="cm-demo__header">
      <t-typography level="4">讨论（{{ comments.length }}）</t-typography>
    </div>

    <t-comment
      v-for="item in comments"
      :key="item.id"
      :author="item.author"
      :avatar="item.avatar"
      :datetime="item.datetime"
      :content="item.content"
      :actions="item.actions"
      @action="onAction"
    />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();

const comments = ref([
  {
    id: 1,
    author: 'blue-sf',
    avatar: '',
    datetime: '2 小时前',
    content: '组件库的视觉规范已经收敛到一套设计令牌上，圆角、间距、语义色都走 CSS 变量，业务侧可以直接覆盖。',
    actions: [
      { label: '回复', icon: 't-icon-comment' },
      { label: '点赞 12', icon: 't-icon-favorite' }
    ]
  },
  {
    id: 2,
    author: 'Cindy',
    avatar: '',
    datetime: '昨天 18:40',
    content: '弹层类组件的定位已经统一改成 fixed 并做视口钳制，滚动时不再被父容器裁切了。',
    actions: [
      { label: '回复', icon: 't-icon-comment' },
      { label: '点赞 8', icon: 't-icon-favorite' }
    ]
  },
  {
    id: 3,
    author: 'David',
    avatar: '',
    datetime: '3 天前',
    content: '类型声明补齐之后，Volar 里能直接跳到 Props 定义，写业务代码顺手很多。',
    actions: [
      { label: '回复', icon: 't-icon-comment' },
      { label: '点赞 5', icon: 't-icon-favorite' }
    ]
  }
]);

const onAction = (action, index) => {
  proxy.$message({ text: `${action.label}（第 ${index + 1} 项）`, type: 'info', timeout: 1200 });
};
</script>

<style lang="scss" scoped>
.cm-demo {
  max-width: 620px;
}
.cm-demo__header {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--pui-border, #eef2f7);
}
</style>
