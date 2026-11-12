<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div class="brand" @click="go('/')" role="button" tabindex="0" @keydown.enter="go('/')">
        <BrandMark :size="34" />
        <span class="brand__word">PENGUIN<em>UI</em></span>
        <span class="brand__rule" aria-hidden="true"></span>
        <span class="brand__version">V{{ version }}</span>
      </div>

      <nav class="site-nav" aria-label="主导航">
        <button
            v-for="item in tools"
            :key="item.key"
            type="button"
            :class="{ 'is-active': active === item.key }"
            @click="go(item.path, item.key)"
        >{{ item.name }}</button>
      </nav>

      <div class="site-actions">
        <button class="search-trigger" type="button" @click="openSearch" aria-label="打开全站搜索">
          <t-icon name="search" :size="16" />
          <span>搜索文档</span>
          <kbd>{{ isMac ? '⌘ K' : 'Ctrl K' }}</kbd>
        </button>
        <button class="icon-btn" type="button" :title="theme === 'dark' ? '切换到浅色' : '切换到深色'" @click="toggleTheme">
          <t-icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
        </button>
        <a class="icon-btn" :href="GITEE" target="_blank" rel="noopener" title="Gitee 仓库">
          <t-icon name="gitee" :size="18" />
        </a>
        <a class="icon-btn" :href="NPM" target="_blank" rel="noopener" title="npm 包">
          <t-icon name="npm" :size="18" />
        </a>
        <button class="icon-btn menu-btn" type="button" aria-label="展开菜单" @click="toggleSidebar">
          <t-icon :name="sidebarOpen ? 'close' : 'menu-line'" :size="19" />
        </button>
      </div>
    </div>

    <!-- 移动端导航统一交给左侧抽屉，避免与抽屉双层叠加 -->
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import pkg from '../../package.json';
import BrandMark from './brand-mark.vue';
import { theme, toggleTheme } from '@/composables/useTheme';
import { openSearch, sidebarOpen, toggleSidebar } from '@/composables/useUi';

const version = pkg.version;
const GITEE = 'https://gitee.com/blue-sf/penguinui';
const NPM = 'https://www.npmjs.com/package/penguinui';
const router = useRouter();
const route = useRoute();

const tools = [
  { key: 'home', name: '首页', path: '/' },
  { key: 'components', name: '组件', path: '/penguinui' },
  { key: 'icon', name: '图标', path: '/penguinui/icon' },
  { key: 'guide', name: '指南', path: '/penguinui/install' },
];

const active = ref('home');
const syncActive = (path) => {
  if (path === '/') active.value = 'home';
  else if (path.endsWith('/icon')) active.value = 'icon';
  else if (path.endsWith('/install')) active.value = 'guide';
  else active.value = 'components';
};
onMounted(() => syncActive(route.path));

const go = (path, key) => {
  active.value = key || (path === '/' ? 'home' : 'components');
  sidebarOpen.value = false;
  if (path !== route.path) router.push(path);
};

const isMac = computed(() => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform));
</script>

<style scoped lang="scss">
.site-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--pui-header-bg);
  backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--pui-border);
}
.site-header__inner {
  height: 66px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px);
  display: flex;
  align-items: center;
  gap: 28px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  flex: none;
  outline: none;
  &:focus-visible { outline: 2px solid var(--pui-brand); outline-offset: 4px; border-radius: 4px; }
  &__word {
    font-family: var(--pui-font-display);
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.045em;
    line-height: 1;
    color: var(--pui-text);
    white-space: nowrap;
    em { font-style: normal; color: var(--pui-brand); margin-left: 4px; }
  }
  &__rule { width: 1px; height: 16px; background: var(--pui-border-strong); }
  &__version {
    font-family: var(--pui-font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--pui-text-muted);
    white-space: nowrap;
  }
}
.site-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  button {
    position: relative;
    border: 0;
    background: transparent;
    color: var(--pui-text-sub);
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.18s ease, background 0.18s ease;
    &:hover { color: var(--pui-brand); background: var(--pui-brand-soft); }
    &.is-active { color: var(--pui-brand); font-weight: 600; }
    &.is-active::after {
      content: '';
      position: absolute;
      left: 14px;
      right: 14px;
      bottom: 2px;
      height: 2px;
      border-radius: 2px;
      background: var(--pui-brand);
    }
  }
}
.site-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-trigger {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 196px;
  padding: 8px 10px 8px 12px;
  border: 1px solid var(--pui-border);
  border-radius: 9px;
  background: var(--pui-bg-soft);
  color: var(--pui-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  &:hover { border-color: var(--pui-brand); box-shadow: var(--pui-shadow-sm); }
  span { flex: 1; text-align: left; }
  kbd {
    font-family: inherit;
    font-size: 11px;
    padding: 3px 6px;
    border: 1px solid var(--pui-border);
    border-radius: 5px;
    background: var(--pui-bg-elevated);
    color: var(--pui-text-muted);
  }
}
.icon-btn {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--pui-text-sub);
  cursor: pointer;
  text-decoration: none;
  transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  &:hover { color: var(--pui-brand); background: var(--pui-brand-soft); border-color: var(--pui-border); }
}
.menu-btn { display: none; }
@media (max-width: 1024px) {
  .site-header__inner { gap: 16px; }
  .search-trigger { min-width: 0; span, kbd { display: none; } padding: 8px; }
}
@media (max-width: 760px) {
  .site-nav { display: none; }
  .menu-btn { display: grid; }
  .brand__version, .brand__rule { display: none; }
}
</style>
