<template>
  <div class="dv-demo">
    <p>分割线用于区隔内容段落，默认是一条 1px 发丝线，颜色跟随当前主题。</p>
    <t-divider />
    <p>线下面可以继续书写正文，间距由组件自身控制，无需额外 margin。</p>
  </div>
</template>

<style scoped>
.dv-demo {
  font-family: var(--pui-font-body, sans-serif);
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--pui-text-sub, #5b6879);
  & p { margin: 0; }
}
</style>
