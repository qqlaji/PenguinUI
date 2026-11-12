<template>
  <div class="dv-demo">
    <p class="dv-demo__note">lineStyle 支持任意 CSS border-style</p>
    <t-divider position="left" line-style="dotted">dotted</t-divider>
    <t-divider position="center" line-style="dashed">dashed</t-divider>
    <t-divider position="right" line-style="double">double</t-divider>
    <t-divider position="center" line-style="groove" color="#0e80eb">自定义颜色</t-divider>
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
