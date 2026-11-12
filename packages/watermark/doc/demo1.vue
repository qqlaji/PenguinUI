<template>
  <t-watermark content="PenguinUI 内部资料" :opacity="0.12" :gap-x="80" :gap-y="80">
    <div class="wm-card">
      <h4>项目周报</h4>
      <p>本周完成组件库 5 个新组件的开发与文档补全，修复 3 处交互缺陷，单元回归全部通过。</p>
      <p>下周计划：补齐类型声明、补充单元测试、发布 1.13.0。</p>
    </div>
  </t-watermark>
</template>

<style lang="scss" scoped>
.wm-card {
  padding: 20px 24px;
  border: 1px solid var(--pui-border, #e3e9f2);
  border-radius: 12px;
  background: var(--pui-bg-elevated, #fff);

  h4 {
    margin: 0 0 10px;
    font-size: 15px;
    color: var(--pui-text-1, #1f2d3d);
  }
  p {
    margin: 0 0 8px;
    font-size: 13px;
    line-height: 1.8;
    color: var(--pui-text-2, #4a5866);
  }
  p:last-child { margin-bottom: 0; }
}
</style>
