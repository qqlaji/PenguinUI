<template>
  <div class="tour-demo">
    <div class="tour-demo__bar">
      <t-input class="tour-demo__search" placeholder="搜索组件" left-icon="t-icon-search" />
      <t-button type="primary" class="tour-demo__create">新建</t-button>
      <t-button @click="start">开始引导</t-button>
    </div>

    <div class="tour-demo__cards">
      <div v-for="i in 3" :key="i" class="tour-demo__card">
        <span class="tour-demo__card-title">区块 {{ i }}</span>
        <span class="tour-demo__card-desc">可被聚光灯高亮的区域</span>
      </div>
    </div>

    <p class="tour-demo__tip">支持 ← → 切换步骤，Esc 关闭。</p>

    <t-tour v-model="visible" v-model:current="current" :steps="steps" @finish="onFinish" />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();

const visible = ref(false);
const current = ref(0);

const steps = [
  {
    target: '.tour-demo__search',
    title: '搜索组件',
    description: '输入组件名即可快速定位文档，支持中英文关键词与拼音首字母。',
    placement: 'bottom',
    icon: 't-icon-search'
  },
  {
    target: '.tour-demo__create',
    title: '新建条目',
    description: '点击这里创建新的组件规范条目，创建后会自动进入编辑态。',
    placement: 'bottom',
    icon: 't-icon-add-bold'
  },
  {
    target: '.tour-demo__cards',
    title: '内容区块',
    description: '当前分类下的全部区块集中在这里展示，卡片支持横向滚动。',
    placement: 'top',
    icon: 't-icon-layers'
  }
];

const start = () => {
  current.value = 0;
  visible.value = true;
};

const onFinish = () => proxy.$message({ text: '引导已完成', type: 'success', timeout: 1500 });
</script>

<style lang="scss" scoped>
.tour-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tour-demo__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.tour-demo__search {
  width: 220px;
}
.tour-demo__cards {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 2px;
}
.tour-demo__card {
  flex: none;
  width: 150px;
  padding: 14px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tour-demo__card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--pui-text, #1c2534);
}
.tour-demo__card-desc {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.tour-demo__tip {
  margin: 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
