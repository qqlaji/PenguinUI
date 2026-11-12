<template>
  <div class="demo-actions">
    <t-switch v-model="loading" :width="42" />
    <span>{{ loading ? '加载中' : '已加载完成' }}</span>
    <t-button size="small" @click="loading = !loading">切换状态</t-button>
  </div>
  <div class="demo-grid">
    <div>
      <p class="demo-label">基础骨架</p>
      <t-skeleton :loading="loading" :rows="3">
        <t-alert type="success" title="内容已加载" description="真实内容会替换骨架占位。" showIcon />
      </t-skeleton>
    </div>
    <div>
      <p class="demo-label">带头像 + 自定义行宽</p>
      <t-skeleton :loading="loading" avatar :rows="3" :widths="['100%', '82%', '55%']">
        <div class="demo-user"><t-avatar text="P" /> <span>Penguin UI 用户</span></div>
      </t-skeleton>
    </div>
  </div>
  <p class="demo-label">自定义 placeholder</p>
  <t-skeleton :loading="loading">
    <template #placeholder><div class="demo-custom">正在努力加载…</div></template>
    <span>加载完毕 ✅</span>
  </t-skeleton>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>

<style scoped>
.demo-actions { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: #8b96a6; }
.demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
.demo-label { font-size: 12px; color: #8b96a6; margin: 8px 0 12px; }
.demo-user { display: flex; align-items: center; gap: 10px; }
.demo-custom { padding: 24px; text-align: center; background: #f5f8fd; border-radius: 8px; color: #0e80eb; }
</style>
