<template>
  <div class="dv-demo">
    <span class="dv-demo__tag">组件</span>
    <t-divider direction="vertical" />
    <span class="dv-demo__tag">文档</span>
    <t-divider direction="vertical" />
    <span class="dv-demo__tag">示例</span>
    <t-divider direction="vertical" />
    <span class="dv-demo__tag">主题</span>

    <div class="dv-demo__row">
      垂直分隔线常用于工具栏与面包屑：
      <a href="javascript:">首页</a>
      <t-divider direction="vertical" line-style="dashed" />
      <a href="javascript:">组件</a>
      <t-divider direction="vertical" line-style="dashed" />
      <span>Divider</span>
    </div>
  </div>
</template>

<style scoped>
.dv-demo {
  font-family: var(--pui-font-body, sans-serif);
  font-size: 13.5px;
  color: var(--pui-text-sub, #5b6879);
}
.dv-demo__tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  background: var(--pui-bg-soft, #f7f9fc);
  color: var(--pui-text, #1c2534);
  font-size: 12.5px;
  vertical-align: middle;
}
.dv-demo__row {
  margin-top: 22px;
  font-size: 12.5px;
  & a {
    color: var(--pui-brand, #0e80eb);
    text-decoration: none;
  }
}
</style>
