<template>
  <div class="vl-demo2">
    <div class="vl-demo2__item">
      <t-typography strong block>动态高度模式</t-typography>
      <t-typography type="secondary" size="small" block>
        _item-height_ 传 0 后按内容实测高度，适合评论、聊天记录这类不等高列表
      </t-typography>
      <t-virtual-list
        :data="messages"
        :item-height="0"
        :height="240"
        :buffer="2"
        class="vl-demo2__list"
      >
        <template #default="{ item }">
          <div class="vl-demo2__msg">
            <t-avatar :text="item.author.charAt(0)" size="small" />
            <div class="vl-demo2__body">
              <span class="vl-demo2__author">{{ item.author }}</span>
              <p class="vl-demo2__text">{{ item.text }}</p>
            </div>
          </div>
        </template>
      </t-virtual-list>
    </div>

    <div class="vl-demo2__item">
      <t-typography strong block>滚动到底加载更多</t-typography>
      <t-typography type="secondary" size="small" block>
        滚动到距底部 _distance_ 像素内触发 _load-more_
      </t-typography>
      <t-virtual-list
        ref="listRef"
        :data="rows"
        :item-height="34"
        :height="200"
        class="vl-demo2__list"
        @load-more="loadMore"
      >
        <template #default="{ item }">
          <div class="vl-demo2__row">
            <span>{{ item.label }}</span>
            <span class="vl-demo2__meta">{{ item.size }}</span>
          </div>
        </template>
      </t-virtual-list>
      <div class="vl-demo2__actions">
        <t-button size="small" :loading="loading" @click="loadMore">
          {{ loading ? '加载中' : '加载更多' }}
        </t-button>
        <t-button size="small" @click="listRef && listRef.scrollToIndex(0)">回到顶部</t-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 动态高度：文本长短不一
const messages = Array.from({ length: 300 }, (_, i) => ({
  author: ['Cindy', 'David', 'blue-sf', 'Eva'][i % 4],
  text:
    i % 5 === 0
      ? `第 ${i + 1} 条消息：这是一段比较长的内容，用来验证动态高度模式能否正确测量并撑开每一行的实际高度，滚动时不应该出现内容重叠或突然跳动的情况。`
      : `第 ${i + 1} 条消息：短内容。`
}));

// 加载更多
const rows = ref(
  Array.from({ length: 40 }, (_, i) => ({
    label: `记录 ${i + 1}`,
    size: `${(Math.random() * 900 + 100).toFixed(1)} KB`
  }))
);
const loading = ref(false);
const page = ref(1);
const listRef = ref(null);

const loadMore = () => {
  if (loading.value) return;
  loading.value = true;
  setTimeout(() => {
    const base = rows.value.length;
    const next = Array.from({ length: 20 }, (_, i) => ({
      label: `记录 ${base + i + 1}`,
      size: `${(Math.random() * 900 + 100).toFixed(1)} KB`
    }));
    rows.value = [...rows.value, ...next];
    page.value += 1;
    loading.value = false;
  }, 500);
};
</script>

<style lang="scss" scoped>
.vl-demo2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.vl-demo2__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.vl-demo2__list {
  margin-top: 6px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
}
.vl-demo2__msg {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--pui-border, #eef2f7);
}
.vl-demo2__body {
  flex: 1;
  min-width: 0;
}
.vl-demo2__author {
  font-size: 12px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.vl-demo2__text {
  margin: 2px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--pui-text-sub, #5b6879);
  word-break: break-word;
}
.vl-demo2__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);
}
.vl-demo2__meta {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.vl-demo2__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
