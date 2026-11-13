<template>
  <main class="home">
    <!-- ============ Hero ============ -->
    <section class="hero">
      <div class="hero__grid" aria-hidden="true"></div>
      <div class="hero__glow hero__glow--a" aria-hidden="true"></div>
      <div class="hero__glow hero__glow--b" aria-hidden="true"></div>

      <div class="hero__inner">
        <div class="hero__copy">
          <a class="release-pill" href="https://gitee.com/blue-sf/penguinui" target="_blank" rel="noopener">
            <span class="release-pill__dot"></span>
            v{{ version }} 已发布 · 全新图标与组件
            <t-icon name="arrow-up-right" :size="13" />
          </a>

          <h1 class="hero__title">
            为 Vue 3 而生的<br />
            <span>轻量级组件库</span>
          </h1>
          <p class="hero__desc">
            开箱即用的 {{ componentCount }} 个组件、{{ iconCount }}+ 图标，零 CDN 依赖、支持按需引入。<br class="only-wide" />
            用更少的代码，构建更漂亮的产品界面。
          </p>

          <div class="hero__actions">
            <button class="btn btn--primary" type="button" @click="go('/penguinui')">
              开始使用 <t-icon name="arrow-right" :size="16" />
            </button>
            <button class="btn btn--ghost" type="button" @click="go('/penguinui/icon')">
              <t-icon name="grid" :size="16" /> 浏览图标库
            </button>
            <a class="btn btn--text" :href="GITHUB" target="_blank" rel="noopener">
              <t-icon name="github" :size="17" /> GitHub
            </a>
            <a class="btn btn--text" :href="GITEE" target="_blank" rel="noopener">
              <t-icon name="gitee" :size="17" /> Gitee
            </a>
          </div>

          <div class="install-bar">
            <span class="install-bar__prompt">$</span>
            <code>npm i penguinui</code>
            <button type="button" :class="{ 'is-copied': installCopied }" @click="copy('npm i penguinui', 'installCopied')">
              <t-icon :name="installCopied ? 'check-circle' : 'clipboard'" :size="15" />
              {{ installCopied ? '已复制' : '复制' }}
            </button>
          </div>

          <ul class="hero__meta">
            <li><t-icon name="check-circle" :size="14" /> Vue 3 · Vite</li>
            <li><t-icon name="check-circle" :size="14" /> 按需引入</li>
            <li><t-icon name="check-circle" :size="14" /> 图标字体内联</li>
          </ul>
        </div>

        <div class="hero__visual">
          <div class="preview-card">
            <div class="preview-card__bar">
              <span class="dots"><i></i><i></i><i></i></span>
              <span class="preview-card__title"><t-icon name="cat-general" :size="13" /> Live Preview</span>
              <span class="preview-card__badge">可交互</span>
            </div>
            <div class="preview-card__body">
              <p class="preview-label">Buttons</p>
              <div class="preview-row">
                <t-button type="primary" size="small" @click="bump">点我 +1</t-button>
                <t-button type="success" size="small" plain>幽灵按钮</t-button>
                <t-button size="small" round leftIcon="t-icon-penguin">企鹅</t-button>
              </div>

              <p class="preview-label">Tags & Avatar</p>
              <div class="preview-row">
                <t-tag type="primary" size="small">Vue 3</t-tag>
                <t-tag type="success" size="small" round>轻量</t-tag>
                <t-tag type="warning" size="small">NEW</t-tag>
                <t-tag size="small" closable @close="tagClosed = true" v-if="!tagClosed">可关闭</t-tag>
                <t-avatar class="preview-avatar" text="P" size="small" shape="circle" />
              </div>

              <p class="preview-label">Form</p>
              <div class="preview-row preview-row--form">
                <t-rate v-model="rateValue" :count="5" />
                <t-switch v-model="skeletonOn" :width="40" />
                <span class="preview-hint">{{ skeletonOn ? '骨架屏开启' : '内容已加载' }}</span>
              </div>

              <div class="preview-skeleton">
                <t-skeleton :loading="skeletonOn" :rows="2" animated>
                  <t-progress :percent="percent" :progressHeight="10" roundCorner isShowText />
                </t-skeleton>
              </div>

              <t-alert
                  class="preview-alert"
                  type="success"
                  title="一切就绪"
                  description="组件、图标、样式已随一次 install 全部到位。"
                  showIcon
              />
            </div>
          </div>
          <div class="float-chip float-chip--top" :style="toneStyle('basic')"><t-icon name="cat-basic" :size="15" /> 零外部依赖</div>
          <div class="float-chip float-chip--bottom" :style="toneStyle('display')"><t-icon name="cat-display" :size="15" /> {{ componentCount }} 个组件</div>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><b>{{ componentCount }}</b><span>开箱组件</span></div>
        <div class="stat"><b>{{ iconCount }}+</b><span>内置图标</span></div>
        <div class="stat"><b>68<small>KB</small></b><span>样式 gzip 体积</span></div>
        <div class="stat"><b>0</b><span>CDN 依赖</span></div>
      </div>
    </section>

    <!-- ============ Features ============ -->
    <section class="section features">
      <div class="section__head">
        <span class="section__eyebrow">WHY PENGUIN UI</span>
        <h2>小而全，把复杂留给我们</h2>
        <p>从一行安装命令到一整套设计语言，专注把开发体验做到顺手。</p>
      </div>
      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card" :style="toneStyle(feature.tone)">
          <span class="feature-card__index">{{ feature.no }}</span>
          <span class="feature-card__icon"><t-icon :name="feature.icon" :size="22" /></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </article>
      </div>
    </section>

    <!-- ============ Component catalog ============ -->
    <section class="section catalog">
      <div class="section__head section__head--row">
        <div>
          <span class="section__eyebrow">COMPONENTS</span>
          <h2>组件一览</h2>
          <p>按场景分类，点开任意组件即可查看示例、源码与 API。</p>
        </div>
        <button class="btn btn--ghost btn--sm" type="button" @click="go('/penguinui')">
          查看全部 <t-icon name="arrow-right" :size="14" />
        </button>
      </div>
      <div class="catalog-grid">
        <article v-for="group in catalog" :key="group.key" class="catalog-card" :style="toneStyle(group.tone)">
          <div class="catalog-card__head">
            <span class="catalog-card__icon"><t-icon :name="group.icon" :size="18" /></span>
            <h3>{{ group.title }}<small>{{ group.items.length }}</small></h3>
            <em>{{ group.caption }}</em>
          </div>
          <div class="catalog-card__links">
            <a v-for="item in group.items" :key="item.path" href="javascript:" @click="go(item.path)">
              {{ item.name }} <t-icon name="arrow-up-right" :size="11" />
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- ============ Quick start ============ -->
    <section class="section quickstart">
      <div class="quickstart__copy">
        <span class="section__eyebrow">QUICK START</span>
        <h2>三步接入，马上开写</h2>
        <p>全量注册或按需引入都可以，图标字体已内联进样式文件，无需额外配置 CDN、字体路径或构建插件。</p>
        <ul class="quickstart__list">
          <li><span>1</span> 安装依赖</li>
          <li><span>2</span> 引入组件与样式</li>
          <li><span>3</span> 在模板里直接使用</li>
        </ul>
        <button class="btn btn--primary btn--sm" type="button" @click="go('/penguinui/install')">
          阅读完整指南 <t-icon name="arrow-right" :size="14" />
        </button>
      </div>
      <div class="code-window">
        <div class="code-window__tabs">
          <button v-for="tab in codeTabs" :key="tab.key" type="button" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
            {{ tab.label }}
          </button>
          <button class="code-window__copy" type="button" @click="copy(activeCode, 'codeCopied')">
            <t-icon :name="codeCopied ? 'check-circle' : 'clipboard'" :size="14" />
            {{ codeCopied ? '已复制' : '复制代码' }}
          </button>
        </div>
        <pre class="code-window__body"><code>{{ activeCode }}</code></pre>
        <div class="code-window__foot"><span class="dot"></span> penguinui · MIT · Vue 3</div>
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="cta">
      <div class="cta__inner">
        <t-icon name="cat-start" :size="30" />
        <h2>准备好开始了吗？</h2>
        <p>一条命令，把整套组件与图标带进你的下一个 Vue 3 项目。</p>
        <div class="cta__actions">
          <button class="btn btn--light" type="button" @click="go('/penguinui/install')">快速上手</button>
          <button class="btn btn--outline" type="button" @click="copy('npm i penguinui', 'installCopied')">
            <t-icon name="clipboard" :size="15" /> 复制安装命令
          </button>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="home-footer__brand">
        <BrandMark :size="28" />
        <b>PENGUIN UI</b>
        <span>v{{ version }} · MIT License</span>
      </div>
      <div class="home-footer__links">
        <a :href="GITHUB" target="_blank" rel="noopener">GitHub</a>
        <a :href="GITEE" target="_blank" rel="noopener">Gitee</a>
        <a :href="NPM" target="_blank" rel="noopener">npm</a>
        <a href="javascript:" @click="openSearch">全站搜索</a>
        <a href="javascript:" @click="toggleTheme">{{ theme === 'dark' ? '浅色模式' : '深色模式' }}</a>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import pkg from '../../package.json';
import MenuList from '@/const/menuList.js';
import iconList from '@/const/iconList.js';
import BrandMark from '@/components/brand-mark.vue';
import Message from '../../packages/message/index';
import { theme, toggleTheme } from '@/composables/useTheme';
import { openSearch } from '@/composables/useUi';

const version = pkg.version;
const GITHUB = 'https://github.com/qqlaji/PenguinUI';
const GITEE = 'https://gitee.com/blue-sf/penguinui';
const NPM = 'https://www.npmjs.com/package/penguinui';
const router = useRouter();

// 只统计真正的组件条目：安装说明、颜色规范这类纯文档页不计入组件总数
const componentCount = computed(() =>
    MenuList.reduce(
        (sum, group) => sum + group.list.filter((item) => !item.doc).length,
        0
    )
);
const iconCount = computed(() => iconList.length);

const go = (path) => router.push(path);

// 分类色板：每组一个明确色相，首页与侧栏共用同一套编码
const toneStyle = (tone) => ({
  '--cat': `var(--pui-cat-${tone || 'other'})`,
  '--cat-soft': `var(--pui-cat-${tone || 'other'}-soft)`,
});

// 复制：优先 Clipboard API，失败时回退到 execCommand
const installCopied = ref(false);
const codeCopied = ref(false);
const copy = async (text, flag) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    if (flag === 'installCopied') installCopied.value = true;
    else codeCopied.value = true;
    Message({ type: 'success', text: '已复制到剪贴板' });
    setTimeout(() => {
      installCopied.value = false;
      codeCopied.value = false;
    }, 1800);
  } catch {
    Message({ type: 'error', text: '复制失败，请手动复制' });
  }
};

// Live Preview 的真实交互
const rateValue = ref(4);
const skeletonOn = ref(false);
const tagClosed = ref(false);
const clicks = ref(0);
const bump = () => { clicks.value += 1; };
const percent = computed(() => Math.min(100, 35 + clicks.value * 13));

// 六张特性卡各用一枚分类图形 + 独立色相，避免通用线性图标堆砌
const features = [
  { no: '01', icon: 'cat-start', tone: 'start', title: '轻量到底', desc: '组件按需打包，样式文件内联图标字体，不依赖任何外部 CDN 或字体服务。' },
  { no: '02', icon: 'cat-basic', tone: 'basic', title: '开箱即用', desc: '表单、数据、交互、反馈全覆盖，复制示例即可运行，配置少、心智负担低。' },
  { no: '03', icon: 'cat-general', tone: 'general', title: '主题友好', desc: '统一的设计令牌与语义色，文档站支持明暗双主题，业务侧也能轻松定制。' },
  { no: '04', icon: 'cat-data', tone: 'data', title: '容易扩展', desc: '每个组件都是独立目录，props / 插槽 / 事件清晰，二次封装不用读源码猜逻辑。' },
  { no: '05', icon: 'cat-interaction', tone: 'interaction', title: 'Vue 3 原生', desc: '基于 Composition API 与 Vite 构建，支持 ESM / UMD，兼容现代前端工程。' },
  { no: '06', icon: 'cat-display', tone: 'display', title: '稳定可依赖', desc: '已发布 npm，MIT 协议，文档与示例同源维护，升级不留隐式破坏性变更。' },
];

// 组件地图直接消费菜单元数据（图标、色相、英文副标题同源，不另维护一份映射）
const catalog = computed(() =>
    MenuList.filter((group) => group.key !== 'start').map((group) => ({
      key: group.key,
      title: group['title-cn'],
      icon: group.icon,
      tone: group.tone,
      caption: group.caption,
      items: group.list.map((item) => ({ name: item['title-cn'], path: item.path })),
    }))
);

const codeTabs = [
  {
    key: 'install', label: '安装', code: `npm install penguinui --save
# 或者
pnpm add penguinui`,
  },
  {
    key: 'global', label: '全量引入', code: `import { createApp } from 'vue'
import App from './App.vue'
import PenguinUI from 'penguinui'
import 'penguinui/style.css'

createApp(App).use(PenguinUI).mount('#app')`,
  },
  {
    key: 'usage', label: '使用组件', code: `<template>
  <t-button type="primary" @click="handle">提交</t-button>
  <t-icon name="penguin" size="24" color="#0e80eb" />
  <t-alert type="success" title="保存成功" show-icon />
</template>`,
  },
];
const activeTab = ref('install');
const activeCode = computed(() =>
    codeTabs.find((tab) => tab.key === activeTab.value)?.code || ''
);
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  overflow-x: hidden;
  background: var(--pui-bg);
  color: var(--pui-text);
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  padding: 0 clamp(20px, 5vw, 72px);
  isolation: isolate;
}
.hero__grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
      linear-gradient(var(--pui-grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--pui-grid-line) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent 90%);
}
.hero__glow {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  &--a { width: 520px; height: 520px; top: -180px; right: 4%; background: rgba(14, 128, 235, 0.2); }
  &--b { width: 420px; height: 420px; top: 160px; left: -8%; background: rgba(245, 158, 11, 0.13); }
}
[data-theme='dark'] .hero__glow--a { background: rgba(45, 130, 255, 0.18); }
[data-theme='dark'] .hero__glow--b { background: rgba(245, 158, 11, 0.1); }

.hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 96px) 0 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(32px, 5vw, 80px);
}
.release-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border: 1px solid var(--pui-border);
  border-radius: 6px;
  background: var(--pui-bg-elevated);
  color: var(--pui-text-sub);
  font-size: 12.5px;
  text-decoration: none;
  box-shadow: var(--pui-shadow-sm);
  &:hover { border-color: var(--pui-brand); color: var(--pui-brand); }
  &__dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--pui-success);
    box-shadow: 0 0 0 4px rgba(9, 182, 61, 0.15);
  }
}
.hero__title {
  margin: 26px 0 18px;
  font-size: clamp(38px, 4.4vw, 66px);
  line-height: 1.18;
  font-weight: 750;
  letter-spacing: -0.035em;
  span {
    color: var(--pui-brand);
    text-decoration: underline;
    text-decoration-color: var(--pui-cat-start);
    text-decoration-thickness: 0.09em;
    text-underline-offset: 0.14em;
  }
}
.hero__desc {
  max-width: 520px;
  margin: 0;
  font-size: clamp(14px, 1.15vw, 16.5px);
  line-height: 1.9;
  color: var(--pui-text-sub);
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  &:hover { transform: translateY(-2px); }
  &--primary {
    color: #fff;
    background: var(--pui-brand);
    box-shadow: 0 6px 18px rgba(14, 128, 235, 0.24);
    &:hover { background: var(--pui-brand-strong); box-shadow: 0 10px 24px rgba(14, 128, 235, 0.32); }
  }
  &--ghost {
    color: var(--pui-text);
    background: var(--pui-bg-elevated);
    border-color: var(--pui-border-strong);
    &:hover { border-color: var(--pui-brand); color: var(--pui-brand); }
  }
  &--text { color: var(--pui-text-sub); background: transparent; padding-inline: 10px; &:hover { color: var(--pui-brand); } }
  &--light { color: #0e80eb; background: #fff; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16); }
  &--outline { color: #fff; background: transparent; border-color: rgba(255, 255, 255, 0.5); }
  &--sm { padding: 10px 16px; font-size: 13px; }
}
.install-bar {
  margin-top: 26px;
  max-width: 420px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 10px 16px;
  border: 1px solid var(--pui-border);
  border-radius: 10px;
  background: var(--pui-bg-elevated);
  box-shadow: var(--pui-shadow-sm);
  &__prompt { color: var(--pui-brand); font-family: monospace; font-weight: 700; }
  code { flex: 1; font-size: 13.5px; color: var(--pui-text); font-family: 'SFMono-Regular', Consolas, monospace; }
  button {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 11px; border: 1px solid var(--pui-border); border-radius: 7px;
    background: var(--pui-bg-soft); color: var(--pui-text-sub); font-size: 12px; cursor: pointer;
    &:hover, &.is-copied { color: var(--pui-brand); border-color: var(--pui-brand); }
  }
}
.hero__meta {
  display: flex; flex-wrap: wrap; gap: 18px;
  margin: 22px 0 0; padding: 0; list-style: none;
  li { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--pui-text-muted); }
  :deep(svg), :deep(i) { color: var(--pui-success); }
}

/* ---------- Live Preview ---------- */
.hero__visual { position: relative; }
.preview-card {
  border: 1px solid var(--pui-border);
  border-radius: 10px;
  background: var(--pui-bg-elevated);
  box-shadow: var(--pui-shadow-lg);
  overflow: hidden;
  transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
  transition: transform 0.35s ease;
  &:hover { transform: none; }
  &__bar {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 16px;
    border-bottom: 1px solid var(--pui-border);
    background: var(--pui-bg-soft);
  }
  &__title {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: var(--pui-text-sub);
  }
  &__badge {
    margin-left: auto; font-size: 10px; padding: 3px 8px; border-radius: 999px;
    color: var(--pui-success); background: rgba(9, 182, 61, 0.12);
  }
  &__body { padding: 18px 20px 22px; }
}
.dots { display: inline-flex; gap: 6px; i { width: 9px; height: 9px; border-radius: 50%; background: #f87171; } i:nth-child(2) { background: #fbbf24; } i:nth-child(3) { background: #34d399; } }
.preview-label {
  margin: 0 0 9px; font-size: 10.5px; letter-spacing: 0.09em;
  text-transform: uppercase; color: var(--pui-text-muted); font-weight: 600;
}
.preview-row {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 18px;
  &--form { gap: 14px; }
}
.preview-hint { font-size: 12px; color: var(--pui-text-muted); }
.preview-avatar { margin-left: auto; }
.preview-skeleton { margin-bottom: 16px; }
.preview-alert { margin-top: 4px; }
.float-chip {
  position: absolute;
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 14px; border-radius: 6px;
  border: 1px solid var(--pui-border);
  background: var(--pui-bg-elevated);
  box-shadow: var(--pui-shadow);
  font-size: 12px; font-weight: 600; color: var(--pui-text);
  animation: pui-float 4.5s ease-in-out infinite;
  &::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2px; background: var(--cat, var(--pui-brand)); }
  &--top { top: -18px; right: -14px; }
  &--bottom { bottom: -18px; left: -20px; animation-delay: -2.2s; }
  i { color: var(--cat, var(--pui-brand)); }
}
@keyframes pui-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@media (prefers-reduced-motion: reduce) {
  .float-chip { animation: none; }
  .btn, .feature-card, .catalog-card a, .preview-card { transition: none; }
  .btn:hover, .feature-card:hover, .catalog-card a:hover, .preview-card:hover { transform: none; }
}

.stats {
  max-width: 1280px;
  margin: 20px auto 0;
  padding: 24px 0 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--pui-border);
  .stat { text-align: center; border-right: 1px solid var(--pui-border); }
  .stat:last-child { border-right: 0; }
  b { display: block; font-size: clamp(26px, 2.6vw, 36px); font-weight: 750; letter-spacing: -0.03em; color: var(--pui-text); }
  b small { font-size: 14px; font-weight: 600; margin-left: 3px; }
  span { font-size: 12.5px; color: var(--pui-text-muted); }
}

/* ---------- Sections ---------- */
.section { max-width: 1280px; margin: 0 auto; padding: 76px clamp(20px, 5vw, 72px); }
.section__head { margin-bottom: 40px; }
.section__head--row { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.section__eyebrow {
  display: inline-block; margin-bottom: 12px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
  color: var(--pui-brand);
}
.section__head h2 { margin: 0 0 10px; font-size: clamp(26px, 2.5vw, 36px); font-weight: 700; letter-spacing: -0.025em; }
.section__head p { margin: 0; font-size: 14.5px; line-height: 1.8; color: var(--pui-text-sub); }

.features { padding-top: 40px; }
.feature-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
}
.feature-card {
  position: relative;
  padding: 26px;
  border: 1px solid var(--pui-border);
  border-radius: 8px;
  background: var(--pui-bg-elevated);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  &::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--cat); }
  &:hover { transform: translateY(-4px); box-shadow: var(--pui-shadow); border-color: var(--cat); }
  &__index {
    position: absolute; top: 22px; right: 24px;
    font-family: var(--pui-font-mono); font-size: 11px; letter-spacing: 0.08em;
    color: var(--cat);
  }
  &__icon {
    width: 44px; height: 44px; display: grid; place-items: center;
    border-radius: 6px; color: var(--cat); background: var(--cat-soft);
    box-shadow: inset 0 0 0 1px var(--cat-soft);
  }
  h3 { margin: 18px 0 8px; font-size: 17px; font-weight: 650; }
  p { margin: 0; font-size: 13.5px; line-height: 1.85; color: var(--pui-text-sub); }
}

.catalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.catalog-card {
  position: relative;
  padding: 22px;
  border: 1px solid var(--pui-border);
  border-radius: 8px;
  background: var(--pui-bg-elevated);
  &::before { content: ''; position: absolute; left: 0; top: 16px; bottom: 16px; width: 2px; background: var(--cat); }
  &__head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  &__icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 6px; color: var(--cat); background: var(--cat-soft); }
  h3 { margin: 0; font-size: 16px; font-weight: 650; display: flex; align-items: center; gap: 8px; small { font-size: 11px; font-weight: 600; color: var(--cat); background: var(--cat-soft); padding: 2px 7px; border-radius: 4px; } }
  h3 + em { margin-left: auto; font-family: var(--pui-font-mono); font-size: 9px; font-style: normal; letter-spacing: 0.08em; color: var(--pui-text-muted); white-space: nowrap; }
  &__links { display: flex; flex-wrap: wrap; gap: 7px; }
  a {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 6px 10px; border: 1px solid var(--pui-border); border-radius: 5px;
    font-size: 12.5px; color: var(--pui-text-sub); text-decoration: none;
    background: var(--pui-bg-soft);
    transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
    &:hover { color: var(--cat); border-color: var(--cat); transform: translateY(-1px); }
  }
}

.quickstart {
  display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(30px, 5vw, 72px); align-items: center;
}
.quickstart__copy h2 { margin: 0 0 14px; font-size: clamp(26px, 2.5vw, 34px); font-weight: 700; }
.quickstart__copy p { margin: 0; font-size: 14.5px; line-height: 1.9; color: var(--pui-text-sub); }
.quickstart__list { list-style: none; margin: 22px 0 26px; padding: 0; li { display: flex; align-items: center; gap: 12px; padding: 9px 0; font-size: 14px; color: var(--pui-text); span { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 7px; background: var(--pui-brand-soft); color: var(--pui-brand); font-size: 12px; font-weight: 700; } } }
.code-window {
  border: 1px solid var(--pui-border);
  border-radius: 8px;
  background: var(--pui-code-bg);
  box-shadow: var(--pui-shadow);
  overflow: hidden;
  &__tabs { display: flex; align-items: center; gap: 2px; padding: 8px 10px; border-bottom: 1px solid var(--pui-border); background: var(--pui-bg-soft); }
  &__tabs > button:not(.code-window__copy) { border: 0; background: transparent; color: var(--pui-text-muted); font-size: 12.5px; padding: 7px 12px; border-radius: 7px; cursor: pointer; &.active { color: var(--pui-brand); background: var(--pui-brand-soft); font-weight: 600; } }
  &__copy { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--pui-border); background: var(--pui-bg-elevated); color: var(--pui-text-sub); font-size: 12px; padding: 6px 10px; border-radius: 7px; cursor: pointer; &:hover { color: var(--pui-brand); } }
  &__body { margin: 0; padding: 22px 24px; min-height: 190px; overflow-x: auto; code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace; font-size: 13px; line-height: 1.9; color: var(--pui-text); white-space: pre; } }
  &__foot { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-top: 1px solid var(--pui-border); font-size: 11px; color: var(--pui-text-muted); .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--pui-success); } }
}

.cta { padding: 0 clamp(20px, 5vw, 72px) 76px; }
.cta__inner {
  position: relative;
  max-width: 1180px; margin: 0 auto; padding: 54px 30px;
  border-radius: 8px; text-align: center; color: #fff;
  background-color: #101923;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
  background-size: 32px 32px;
  box-shadow: 0 24px 60px rgba(16, 25, 35, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.12);
  > * { position: relative; }
  :deep(svg), :deep(i) { color: var(--pui-cat-start); }
  h2 { margin: 14px 0 8px; font-size: clamp(24px, 2.4vw, 34px); font-weight: 700; }
  p { margin: 0; font-size: 14.5px; opacity: 0.88; }
}
.cta__actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 26px; }

.home-footer {
  max-width: 1280px; margin: 0 auto; padding: 26px clamp(20px, 5vw, 72px) 40px;
  border-top: 1px solid var(--pui-border);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
  &__brand { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--pui-text-muted); b { color: var(--pui-text); font-family: var(--pui-font-display); font-size: 14px; letter-spacing: -0.03em; } }
  &__links { display: flex; gap: 22px; a { color: var(--pui-text-sub); font-size: 13px; text-decoration: none; &:hover { color: var(--pui-brand); } } }
}

@media (max-width: 1080px) {
  .hero__inner { grid-template-columns: 1fr; padding-top: 56px; }
  .hero__visual { max-width: 620px; }
  .preview-card { transform: none; }
  .feature-grid, .catalog-grid { grid-template-columns: repeat(2, 1fr); }
  .quickstart { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .hero__glow--b { display: none; }
  .stats { grid-template-columns: repeat(2, 1fr); gap: 22px 0; .stat:nth-child(2) { border-right: 0; } }
  .feature-grid, .catalog-grid { grid-template-columns: 1fr; }
  .section { padding-top: 52px; padding-bottom: 52px; }
  .section__head--row { flex-direction: column; align-items: flex-start; }
  .float-chip--top { right: 0; } .float-chip--bottom { left: 0; }
  .only-wide { display: none; }
  .home-footer { flex-direction: column; align-items: flex-start; }
}
</style>
