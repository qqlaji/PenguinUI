<template>
  <t-collapse v-model="active" accordion>
    <t-collapse-item name="1" title="设计原则">
      手风琴模式下同时只展开一个面板，`modelValue` 为当前展开项的 `name`。
    </t-collapse-item>
    <t-collapse-item name="2" title="视觉规范">
      颜色、圆角、间距与分割线均来自统一设计令牌，明暗主题自动适配。
    </t-collapse-item>
    <t-collapse-item name="3" title="交互规范">
      标题栏是原生按钮，支持 Tab 聚焦与 Enter / Space 展开收起。
    </t-collapse-item>
  </t-collapse>
</template>

<script setup>
import { ref } from 'vue';
const active = ref('1');
</script>
