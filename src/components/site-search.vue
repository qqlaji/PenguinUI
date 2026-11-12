<template>
  <teleport to="body">
    <transition name="pui-search-fade">
      <div v-if="searchOpen" class="pui-search-overlay" @click.self="closeSearch">
        <div class="pui-search-panel" role="dialog" aria-modal="true" aria-label="全站搜索">
          <div class="pui-search-bar">
            <t-icon name="search" :size="18" class="pui-search-bar__icon" />
            <input
                ref="inputRef"
                v-model="keyword"
                type="text"
                placeholder="搜索组件、图标或文档…"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="confirm"
                @keydown.esc.prevent="closeSearch"
            />
            <kbd @click="closeSearch">ESC</kbd>
          </div>

          <div class="pui-search-body">
            <template v-if="groups.length">
              <section v-for="group in groups" :key="group.title" class="pui-search-group">
                <p class="pui-search-group__title">{{ group.title }}</p>
                <button
                    v-for="item in group.items"
                    :key="item.key"
                    type="button"
                    class="pui-search-item"
                    :class="{ 'is-active': flatResults[activeIndex]?.key === item.key }"
                    :style="toneStyle(item.tone)"
                    @mouseenter="setActive(item)"
                    @click="choose(item)"
                >
                  <span class="pui-search-item__icon">
                    <i v-if="item.kind === 'icon'" class="iconfont" :class="item.title"></i>
                    <t-icon v-else :name="item.icon || 'box'" :size="16" />
                  </span>
                  <span class="pui-search-item__text">
                    <b>{{ item.title }}</b>
                    <small>{{ item.subtitle }}</small>
                  </span>
                  <span class="pui-search-item__hint">{{ item.kind === 'icon' ? '复制类名' : '打开' }}</span>
                </button>
              </section>
            </template>
            <div v-else class="pui-search-empty">
              <t-icon name="search" :size="30" />
              <p>没有找到「{{ keyword }}」相关内容</p>
              <span>试试 button、图标、安装、alert…</span>
            </div>
          </div>

          <footer class="pui-search-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
            <span><kbd>↵</kbd> 打开</span>
            <span><kbd>esc</kbd> 关闭</span>
            <span class="pui-search-footer__count">{{ flatResults.length }} 条结果</span>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import MenuList from '@/const/menuList.js';
import iconList from '@/const/iconList.js';
import Message from '../../packages/message/index';
import { closeSearch, closeSidebar, searchOpen, toggleSearch } from '@/composables/useUi';

const router = useRouter();
const toneStyle = (tone) => tone ? ({
  '--cat': `var(--pui-cat-${tone})`,
  '--cat-soft': `var(--pui-cat-${tone}-soft)`,
}) : {};
const keyword = ref('');
const activeIndex = ref(0);
const inputRef = ref(null);

// 组件索引：菜单即索引，新增组件只要登记到菜单就自动可搜
const componentItems = MenuList.flatMap((group) =>
    group.list.map((item) => ({
      kind: 'component',
      key: item.path,
      title: item['title-cn'],
      subtitle: `${group['title-cn']} · ${item['title-en']}`,
      icon: item.icon || group.icon,
      tone: group.tone,
      group: '组件与文档',
      path: item.path,
      haystack: [
        item['title-cn'], item['title-en'], group['title-cn'], group['title-en'],
        item.path, item.keywords || '',
      ].join(' ').toLowerCase(),
    }))
);

const iconItems = iconList.map((item) => ({
  kind: 'icon',
  key: `icon:${item.className}`,
  title: item.className,
  subtitle: '图标 · 点击复制类名',
  group: '图标',
  haystack: `${item.className} ${item.keywords || ''} 图标 icon`.toLowerCase(),
}));

const results = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) {
    return {
      components: componentItems.slice(0, 8),
      icons: iconItems.slice(0, 4),
    };
  }
  return {
    components: componentItems.filter((i) => i.haystack.includes(kw)).slice(0, 10),
    icons: iconItems.filter((i) => i.haystack.includes(kw)).slice(0, 8),
  };
});

const groups = computed(() => {
  const list = [];
  if (results.value.components.length) {
    list.push({ title: '组件与文档', items: results.value.components });
  }
  if (results.value.icons.length) {
    list.push({ title: '图标', items: results.value.icons });
  }
  return list;
});

const flatResults = computed(() => groups.value.flatMap((g) => g.items));

watch(flatResults, () => {
  activeIndex.value = 0;
});
watch(keyword, () => {
  activeIndex.value = 0;
});
watch(searchOpen, async (open) => {
  if (open) {
    keyword.value = '';
    activeIndex.value = 0;
    await nextTick();
    inputRef.value?.focus();
  }
});

const move = (step) => {
  const total = flatResults.value.length;
  if (!total) return;
  activeIndex.value = (activeIndex.value + step + total) % total;
};
const setActive = (item) => {
  activeIndex.value = flatResults.value.findIndex((i) => i.key === item.key);
};
const confirm = () => {
  const item = flatResults.value[activeIndex.value];
  if (item) choose(item);
};

const copyText = async (text) => {
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
    Message({ type: 'success', text: `已复制 ${text}` });
  } catch {
    Message({ type: 'error', text: '复制失败' });
  }
};

const choose = (item) => {
  if (item.kind === 'icon') {
    copyText(item.title);
  } else {
    router.push(item.path);
    closeSidebar();
  }
  closeSearch();
};

const onGlobalKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    toggleSearch();
  } else if (e.key === 'Escape' && searchOpen.value) {
    closeSearch();
  }
};
onMounted(() => window.addEventListener('keydown', onGlobalKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown));
</script>

<style lang="scss" scoped>
.pui-search-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: var(--pui-mask);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 20px 20px;
}
.pui-search-panel {
  width: 100%;
  max-width: 660px;
  max-height: 74vh;
  display: flex;
  flex-direction: column;
  background: var(--pui-bg-elevated);
  border: 1px solid var(--pui-border);
  border-radius: 16px;
  box-shadow: var(--pui-shadow-lg);
  overflow: hidden;
}
.pui-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--pui-border);
  &__icon { color: var(--pui-text-muted); flex: none; }
  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--pui-text);
    font-size: 16px;
    &::placeholder { color: var(--pui-text-muted); }
  }
  kbd { cursor: pointer; }
}
kbd {
  font-family: inherit;
  font-size: 11px;
  line-height: 1;
  padding: 5px 7px;
  border-radius: 5px;
  color: var(--pui-text-muted);
  background: var(--pui-bg-soft);
  border: 1px solid var(--pui-border);
  white-space: nowrap;
}
.pui-search-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px 14px;
}
.pui-search-group {
  &__title {
    margin: 12px 12px 6px;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--pui-text-muted);
  }
}
.pui-search-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--pui-text);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
  &__icon {
    width: 34px;
    height: 34px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: var(--cat-soft, var(--pui-brand-soft));
    color: var(--cat, var(--pui-brand));
    i { font-size: 18px; }
  }
  &__text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    b { font-size: 14px; font-weight: 600; }
    small { color: var(--pui-text-muted); font-size: 12px; }
  }
  &__hint { font-size: 12px; color: var(--pui-text-muted); }
  &.is-active { background: var(--cat-soft, var(--pui-brand-soft)); }
  &.is-active &__hint { color: var(--cat, var(--pui-brand)); }
}
.pui-search-empty {
  padding: 44px 20px;
  text-align: center;
  color: var(--pui-text-muted);
  p { margin: 12px 0 4px; color: var(--pui-text); font-size: 15px; }
  span { font-size: 13px; }
}
.pui-search-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 18px;
  border-top: 1px solid var(--pui-border);
  color: var(--pui-text-muted);
  font-size: 12px;
  span { display: inline-flex; align-items: center; gap: 5px; }
  &__count { margin-left: auto; }
}
.pui-search-fade-enter-active, .pui-search-fade-leave-active { transition: opacity 0.18s ease; }
.pui-search-fade-enter-from, .pui-search-fade-leave-to { opacity: 0; }
.pui-search-fade-enter-active .pui-search-panel { animation: pui-search-pop 0.2s ease; }
@keyframes pui-search-pop {
  from { transform: translateY(-10px) scale(0.985); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@media (max-width: 640px) {
  .pui-search-overlay { padding: 8vh 12px 12px; }
  .pui-search-footer { gap: 10px; }
  .pui-search-footer__count { display: none; }
}
</style>
