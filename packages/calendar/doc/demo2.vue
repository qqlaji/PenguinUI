<template>
  <div class="cal-demo">
    <t-calendar v-model="value" show-today>
      <template #cell="{ cell }">
        <span class="cal-cell">
          {{ cell.day }}
          <i v-if="events[cell.key]" class="cal-dot"></i>
        </span>
      </template>
    </t-calendar>
    <p class="cal-tip">标记了 {{ eventCount }} 天有日程，点击日期查看</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const pad = (n) => String(n).padStart(2, '0');
const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const now = new Date();
const y = now.getFullYear();
const m = now.getMonth() + 1;

const events = {
  [key(y, m, 3)]: '需求评审',
  [key(y, m, 8)]: '版本发布',
  [key(y, m, 15)]: '团队周会',
  [key(y, m, 22)]: '技术分享'
};
const eventCount = computed(() => Object.keys(events).length);
const value = ref(key(y, m, 8));
</script>

<style scoped>
.cal-demo {
  max-width: 520px;
  border: 1px solid var(--pui-border, #e5e6eb);
  border-radius: 12px;
  background: var(--pui-bg, #fff);
}
.cal-cell {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
  padding-top: 2px;
}
.cal-dot {
  width: 4px;
  height: 4px;
  margin-top: 2px;
  border-radius: 50%;
  background: var(--pui-primary, #0e80eb);
}
.cal-tip {
  margin: 0;
  padding: 10px 16px;
  border-top: 1px solid var(--pui-border, #eef0f4);
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
</style>
