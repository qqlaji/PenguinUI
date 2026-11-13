<template>
  <div class="penguinui-doc">
    <div v-if="sidebarOpen" class="doc-mask" @click="closeSidebar"></div>

    <aside :class="{ 'is-open': sidebarOpen }">
      <div class="side-head">
        <span class="side-head__eyebrow">COMPONENT INDEX</span>
        <span class="side-head__count">{{ total }}<small>个组件</small></span>
      </div>

      <div class="side-search">
        <t-icon name="search" :size="15" />
        <input v-model="keyword" type="text" placeholder="筛选组件…" aria-label="筛选组件" />
        <button v-if="keyword" type="button" aria-label="清空筛选" @click="keyword = ''">
          <t-icon name="close" :size="13" />
        </button>
      </div>

      <div class="list-box">
        <section
            v-for="(group, gi) in groups"
            :key="group.key"
            class="item-list"
            :style="toneStyle(group.tone)"
        >
          <button
              type="button"
              class="titls"
              :aria-expanded="!collapsed[gi]"
              @click="toggleGroup(gi)"
          >
            <span class="titls__glyph"><t-icon :name="group.icon" :size="15" /></span>
            <span class="titls__text">
              <b>{{ group.title }}</b>
              <small>{{ group.caption }}</small>
            </span>
            <span class="titls__meta">
              <em class="titls__count">{{ group.list.filter((i) => !i.doc).length || group.list.length }}</em>
              <t-icon class="titls__chev" :class="{ 'is-collapsed': collapsed[gi] }" name="arrow-down" :size="12" />
            </span>
          </button>
          <ul v-show="!collapsed[gi]">
            <li
                v-for="item in group.list"
                :key="item.path"
                :class="{ active: route.path === item.path }"
                role="button"
                tabindex="0"
                @click="switchMenu(item)"
                @keydown.enter="switchMenu(item)"
                @keydown.space.prevent="switchMenu(item)"
            >
              <span>{{ item.title }}</span>
              <em v-if="item.isNew">NEW</em>
            </li>
          </ul>
        </section>
        <div v-if="!groups.length" class="side-empty">
          <t-icon name="search" :size="26" />
          <p>没有匹配的组件</p>
        </div>
      </div>

      <button class="side-foot" type="button" @click="openSearch">
        <span>全站搜索</span>
        <kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
      </button>
    </aside>

    <main class="penguinuirightView" ref="mainRef">
      <div class="doc-content">
        <router-view v-highlight></router-view>
      </div>
      <footer class="doc-footer">
        <span>Penguin UI · 轻量级 Vue 3 组件库</span>
        <a href="https://qqlaji.github.io/PenguinUI/" target="_blank" rel="noopener">在线文档</a>
        <a href="https://github.com/qqlaji/PenguinUI" target="_blank" rel="noopener">GitHub</a>
        <a href="https://gitee.com/blue-sf/penguinui" target="_blank" rel="noopener">Gitee</a>
        <a href="https://www.npmjs.com/package/penguinui" target="_blank" rel="noopener">npm</a>
        <a href="javascript:" @click="openSearch">搜索文档 (Ctrl K)</a>
      </footer>
    </main>
    <t-backtop target=".penguinuirightView"></t-backtop>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MenuList from "@/const/menuList.js";
import { useMainStore } from "@/store/index";
import { closeSidebar, openSearch, sidebarOpen } from "@/composables/useUi";

const $store = useMainStore();
const router = useRouter();
const route = useRoute();
const mainRef = ref(null);
const keyword = ref("");
const collapsed = ref({});
const isMac = computed(() => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform));

// 每个分组绑定独立色相与专属图形，避免所有分类看起来一样
const toneStyle = (tone) => ({
  "--cat": `var(--pui-cat-${tone || "other"})`,
  "--cat-soft": `var(--pui-cat-${tone || "other"}-soft)`,
});

const baseGroups = computed(() =>
    MenuList.map((group) => ({
      key: group.key,
      icon: group.icon,
      tone: group.tone,
      caption: group.caption,
      title: $store.lang === "CN" ? group["title-cn"] : group["title-en"],
      list: group.list.map((item) => ({
        title: $store.lang === "CN" ? item["title-cn"] : item["title-en"],
        en: item["title-en"],
        path: item.path,
        isNew: !!item.isNew,
        doc: !!item.doc,
      })),
    }))
);

const groups = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return baseGroups.value;
  return baseGroups.value
      .map((group) => ({
        ...group,
        list: group.list.filter(
            (item) =>
                item.title.toLowerCase().includes(kw) ||
                String(item.en).toLowerCase().includes(kw) ||
                item.path.toLowerCase().includes(kw)
        ),
      }))
      .filter((group) => group.list.length);
});

// 组件计数只统计真正的组件条目，文档页（安装使用 / 颜色）不计入
const total = computed(() =>
    baseGroups.value.reduce(
        (sum, group) => sum + group.list.filter((item) => !item.doc).length,
        0
    )
);

const toggleGroup = (index) => {
  collapsed.value = { ...collapsed.value, [index]: !collapsed.value[index] };
};
const switchMenu = (item) => {
  if (route.path !== item.path) router.push(item.path);
  if (mainRef.value) mainRef.value.scrollTop = 0;
  closeSidebar();
};
</script>

<style lang="scss" scoped>
.penguinui-doc {
  display: flex;
  height: calc(100vh - 66px);
  overflow: hidden;
  background: var(--pui-bg);

  aside {
    width: 272px;
    flex: none;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--pui-border);
    background: var(--pui-bg-soft);
    overflow: hidden;
  }
  main {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0 clamp(20px, 4vw, 64px) 0;
    overflow-x: hidden;
    overflow-y: auto;
    word-wrap: break-word;
    scroll-behavior: smooth;
  }
}

.side-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 20px 18px 12px;
  &__eyebrow {
    font-family: var(--pui-font-mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.13em;
    color: var(--pui-text-muted);
  }
  &__count {
    font-family: var(--pui-font-display);
    font-size: 17px;
    font-weight: 700;
    color: var(--pui-text);
    small { margin-left: 3px; font-family: var(--pui-font-body); font-size: 10px; font-weight: 400; color: var(--pui-text-muted); }
  }
}

.side-search {
  margin: 0 16px 14px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 11px;
  border: 1px solid var(--pui-border);
  border-radius: 6px;
  background: var(--pui-bg-elevated);
  color: var(--pui-text-muted);
  &:focus-within { border-color: var(--pui-brand); box-shadow: 0 0 0 3px var(--pui-brand-soft); }
  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--pui-text);
    font-size: 13px;
    &::placeholder { color: var(--pui-text-muted); }
  }
  button {
    border: 0;
    background: transparent;
    color: var(--pui-text-muted);
    cursor: pointer;
    padding: 0;
    display: grid;
    place-items: center;
  }
}

.list-box {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 30px;
}
.item-list {
  position: relative;
  padding: 2px 0 10px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--pui-border);
  &:last-of-type { border-bottom: 0; }
  /* 分组色轨：分类之间用色相区分，而不是只靠文字 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 2px;
    border-radius: 2px;
    background: var(--cat);
    opacity: 0.55;
  }
  .titls {
    width: 100%;
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) auto;
    align-items: center;
    gap: 9px;
    padding: 7px 6px 7px 10px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    text-align: left;
    cursor: pointer;
    &:hover { background: var(--pui-bg-elevated); .titls__text b { color: var(--cat); } }
    &:focus-visible { outline: 2px solid var(--cat); outline-offset: 1px; }
    &__glyph {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 5px;
      color: var(--cat);
      background: var(--cat-soft);
      box-shadow: inset 0 0 0 1px var(--cat-soft);
    }
    &__text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
      b { font-size: 13px; font-weight: 700; color: var(--pui-text); transition: color 0.16s ease; }
      small { font-family: var(--pui-font-mono); font-size: 9px; letter-spacing: 0.09em; color: var(--pui-text-muted); }
    }
    &__meta { display: inline-flex; align-items: center; gap: 7px; }
    &__count {
      font-style: normal;
      font-family: var(--pui-font-mono);
      font-size: 10px;
      min-width: 20px;
      padding: 2px 5px;
      text-align: center;
      border-radius: 4px;
      background: var(--cat-soft);
      color: var(--cat);
    }
    &__chev { color: var(--pui-text-muted); transition: transform 0.22s var(--pui-ease, ease); &.is-collapsed { transform: rotate(-90deg); } }
  }
  ul {
    margin: 2px 0 0 19px;
    padding: 0 0 0 9px;
    list-style: none;
    border-left: 1px solid var(--pui-border);
  }
  li {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 32px;
    padding: 5px 10px;
    margin: 1px 0;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    color: var(--pui-text-sub);
    transition: color 0.16s ease, background 0.16s ease, transform 0.16s ease;
    span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    &:hover { color: var(--cat); background: var(--pui-bg-elevated); transform: translateX(2px); }
    &:focus-visible { outline: 2px solid var(--cat); outline-offset: -2px; }
    &.active {
      color: var(--cat);
      background: var(--cat-soft);
      font-weight: 650;
      &::before {
        content: '';
        position: absolute;
        left: -10px;
        top: 7px;
        bottom: 7px;
        width: 2px;
        border-radius: 2px;
        background: var(--cat);
      }
    }
    em {
      flex: none;
      font-style: normal;
      font-family: var(--pui-font-mono);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--cat);
      border: 1px solid var(--cat-soft);
      background: var(--pui-bg-elevated);
      padding: 2px 5px;
      border-radius: 4px;
    }
  }
}
.side-empty {
  padding: 40px 10px;
  text-align: center;
  color: var(--pui-text-muted);
  p { margin-top: 10px; font-size: 13px; }
}
.side-foot {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 11px 18px;
  border: 0;
  border-top: 1px solid var(--pui-border);
  background: var(--pui-bg-elevated);
  color: var(--pui-text-muted);
  font-size: 12px;
  cursor: pointer;
  &:hover { color: var(--pui-brand); }
  kbd {
    font-family: var(--pui-font-mono);
    font-size: 10px;
    padding: 3px 6px;
    border: 1px solid var(--pui-border);
    border-radius: 4px;
    background: var(--pui-bg-soft);
  }
}

.doc-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 0 20px;
}
.doc-footer {
  max-width: 1000px;
  margin: 40px auto 0;
  padding: 20px 0 36px;
  border-top: 1px solid var(--pui-border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  color: var(--pui-text-muted);
  span { margin-right: auto; }
  a { color: var(--pui-text-sub); text-decoration: none; &:hover { color: var(--pui-brand); } }
}
.doc-mask { display: none; }

aside::-webkit-scrollbar, .list-box::-webkit-scrollbar, main::-webkit-scrollbar { width: 6px; }
aside::-webkit-scrollbar-thumb, .list-box::-webkit-scrollbar-thumb, main::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: var(--pui-border-strong);
}
aside::-webkit-scrollbar-track, .list-box::-webkit-scrollbar-track, main::-webkit-scrollbar-track { background: transparent; }

@media (prefers-reduced-motion: reduce) {
  .item-list li, .titls__chev, .titls__text b { transition: none; }
  .item-list li:hover { transform: none; }
}
@media (max-width: 900px) {
  .penguinui-doc { position: relative; }
  aside {
    position: absolute;
    z-index: 120;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: var(--pui-shadow-lg);
    &.is-open { transform: none; }
  }
  .doc-mask {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 110;
    background: var(--pui-mask);
  }
  main { padding: 0 20px; }
}
</style>
