<template>
  <div class="tour-demo2">
    <t-button @click="visible = true">查看使用须知</t-button>

    <t-typography type="secondary" size="small">
      步骤不传 target 时卡片自动居中，适合纯说明型引导；也可以用 #description 插槽完全自定义正文。
    </t-typography>

    <t-tour v-model="visible" :steps="steps" :show-indicator="false" @finish="onFinish">
      <template #description="{ step, index }">
        <div class="tour-demo2__body">
          <p class="tour-demo2__p">{{ step.description }}</p>
          <t-typography type="secondary" size="small">第 {{ index + 1 }} 步 / 共 {{ steps.length }} 步</t-typography>
        </div>
      </template>
    </t-tour>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();
const visible = ref(false);

const steps = [
  {
    title: '欢迎使用 PenguinUI',
    description: '这是一套面向 Vue 3 的轻量级组件库，所有组件都支持按需引入与全局注册两种方式。',
    icon: 't-icon-penguin'
  },
  {
    title: '文档即示例',
    description: '每个示例都可以直接查看源码，复制到项目里即可运行，不需要额外的配置。',
    icon: 't-icon-code'
  },
  {
    title: '类型完整',
    description: '内置完整的 TypeScript 声明，在 Volar 下可获得 Props 提示与模板补全。',
    icon: 't-icon-prompt'
  }
];

const onFinish = () => proxy.$message({ text: '已读完使用须知', type: 'success', timeout: 1500 });
</script>

<style lang="scss" scoped>
.tour-demo2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.tour-demo2__p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--pui-text-sub, #5b6879);
}
</style>
