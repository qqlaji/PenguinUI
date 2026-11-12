<template>
  <div class="demo-grid">
    <t-empty />
    <t-empty description="没有找到匹配的组件" :imageSize="110">
      <t-button size="small" @click="reset">清空筛选</t-button>
    </t-empty>
    <t-empty description="自定义插画">
      <template #image>
        <div class="demo-image"><t-icon name="search" :size="38" /></div>
      </template>
      <t-button type="text" size="small">查看全部组件 →</t-button>
    </t-empty>
  </div>
</template>

<script setup>
import Message from '../../message/index'
const reset = () => Message({ type: 'success', text: '筛选已清空' })
</script>

<style scoped>
.demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.demo-image { width: 90px; height: 90px; margin: 0 auto; display: grid; place-items: center; border-radius: 50%; background: #f0f6ff; color: #0e80eb; }
</style>
