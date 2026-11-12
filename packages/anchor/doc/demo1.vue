<template>
  <div class="an-demo">
    <t-anchor
      class="an-demo__nav"
      :links="links"
      container="#anchor-demo-box"
      :offset-top="8"
    />
    <div id="anchor-demo-box" class="an-demo__box">
      <section id="an-intro" class="an-demo__section">
        <h4>介绍</h4>
        <p>锚点用于长页面的快速定位。滚动容器时，左侧高亮项会自动跟随当前区块。</p>
      </section>
      <section id="an-usage" class="an-demo__section">
        <h4>使用方式</h4>
        <p>传入 links 数组，每项包含 title 与 href；href 指向页面中已存在的元素 id。</p>
      </section>
      <section id="an-api" class="an-demo__section">
        <h4>API</h4>
        <p>支持 offset-top 控制滚动偏移，container 指定滚动容器，留空则自动向上查找可滚动祖先。</p>
      </section>
      <section id="an-faq" class="an-demo__section">
        <h4>常见问题</h4>
        <p>若高亮不准确，通常是 offset-top 与固定头部高度不匹配，按实际高度调整即可。</p>
      </section>
    </div>
  </div>
</template>

<script setup>
const links = [
  { title: '介绍', href: '#an-intro' },
  { title: '使用方式', href: '#an-usage' },
  { title: 'API', href: '#an-api' },
  { title: '常见问题', href: '#an-faq' },
]
</script>

<style scoped>
.an-demo { display: flex; gap: 20px; padding: 4px; }
.an-demo__nav { flex: none; width: 140px; }
.an-demo__box {
  flex: 1;
  height: 320px;
  overflow-y: auto;
  padding: 0 16px;
  border: 1px solid var(--pui-border);
  border-radius: 12px;
  background: var(--pui-bg-soft);
}
.an-demo__section {
  min-height: 260px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--pui-border);
}
.an-demo__section:last-child { border-bottom: none; }
.an-demo__section h4 { margin: 6px 0 10px; font-size: 15px; }
.an-demo__section p { margin: 0; font-size: 13px; line-height: 1.8; color: var(--pui-text-sub); }
</style>
