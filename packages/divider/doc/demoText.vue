<template>
  <div class="dv-demo">
    <p class="dv-demo__note">position 控制文案位置：left / center / right</p>
    <t-divider position="left">左侧文案</t-divider>
    <t-divider position="center"><i class="iconfont t-icon-sparkles"></i> 居中</t-divider>
    <t-divider position="right">右侧文案</t-divider>
    <p class="dv-demo__note">插槽里也可以直接放图标</p>
    <t-divider position="center"><i class="iconfont t-icon-collection_fill"></i></t-divider>
  </div>
</template>

<style scoped>
.dv-demo {
  font-family: var(--pui-font-body, sans-serif);
}
.dv-demo__note {
  margin: 0;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
</style>
