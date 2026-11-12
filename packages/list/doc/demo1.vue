<template>
  <div class="list-demos">
    <t-list
      :data="items"
      header="待办事项"
      footer="共 4 条记录"
      bordered
    >
      <template #item="{ item, index }">
        <div class="list-row">
          <span class="list-row__index">{{ index + 1 }}</span>
          <span class="list-row__text">{{ item.title }}</span>
          <t-tag :type="item.done ? 'success' : 'warning'" size="small" effect="light">
            {{ item.done ? '已完成' : '进行中' }}
          </t-tag>
        </div>
      </template>
    </t-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { title: '补齐组件类型声明', done: true },
  { title: '修复 Transfer 图标缺失', done: true },
  { title: '重写 Dropdown 下拉菜单', done: true },
  { title: '补充 5 个新组件文档', done: false }
]);
</script>

<style lang="scss" scoped>
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.list-row__index {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: var(--pui-bg-soft, #f4f6fa);
  color: var(--pui-text-3, #8b97a8);
}
.list-row__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
