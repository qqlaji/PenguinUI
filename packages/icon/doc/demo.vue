<template>
  <div class="icon-page">
    <div class="icon-toolbar">
      <t-input
          v-model="keywords"
          leftIcon="t-icon-search"
          clearable
          placeholder="搜索图标名或中文关键词，如 主题、箭头、收藏…"
      />
      <div class="icon-toolbar__right">
        <span class="icon-count">共 {{ iconList.length }} 枚 · 当前 {{ filtered.length }} 枚</span>
        <div class="icon-mode">
          <button type="button" :class="{ active: copyMode === 'class' }" @click="copyMode = 'class'">复制类名</button>
          <button type="button" :class="{ active: copyMode === 'tag' }" @click="copyMode = 'tag'">复制标签</button>
        </div>
      </div>
    </div>

    <div class="icon-tabs">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="{ active: category === tab.key }"
          @click="category = tab.key"
      >{{ tab.label }}<small>{{ tab.count }}</small></button>
    </div>

    <div class="icon-playground">
      <span class="icon-playground__label">实时预览</span>
      <div class="icon-playground__stage">
        <t-icon :name="previewName" :size="size" :color="color" :spin="spin" />
      </div>
      <label class="icon-playground__ctrl">尺寸 <input v-model.number="size" type="range" min="16" max="64" /> {{ size }}px</label>
      <label class="icon-playground__ctrl">颜色 <input v-model="color" type="color" /></label>
      <label class="icon-playground__ctrl"><input v-model="spin" type="checkbox" /> 旋转</label>
      <code class="icon-playground__code">{{ previewName }}</code>
    </div>

    <div class="icon-grid">
      <button
          v-for="item in filtered"
          :key="item.className"
          type="button"
          class="icon-item"
          :title="`点击复制 ${item.className}`"
          @click="copy(item)"
      >
        <i class="iconfont" :class="item.className"></i>
        <span>{{ shortName(item.className) }}</span>
        <em v-if="item.category">{{ item.category }}</em>
      </button>
      <div v-if="!filtered.length" class="icon-empty">
        <t-icon name="search" :size="30" />
        <p>没有匹配的图标</p>
        <span>换个关键词，或切换分类试试</span>
      </div>
    </div>

    <p class="icon-tip">
      点击任意图标即可复制{{ copyMode === 'class' ? '类名' : ' &lt;t-icon /&gt; 标签' }}；
      v1.9 新增 {{ newCount }} 枚内联 SVG 图标，无需字体文件即可使用。
    </p>
  </div>
</template>

<script setup>
import Message from '../../message/index';
import { computed, ref } from 'vue';
import iconList from '@/const/iconList.js';

const keywords = ref('');
const category = ref('all');
const copyMode = ref('class');
const previewName = ref('penguin');
const size = ref(32);
const color = ref('#0e80eb');
const spin = ref(false);

const newCount = computed(() => iconList.filter((item) => item.category).length);
const tabs = computed(() => {
  const counts = { all: iconList.length, classic: 0 };
  iconList.forEach((item) => {
    if (item.category) counts[item.category] = (counts[item.category] || 0) + 1;
    else counts.classic += 1;
  });
  return [
    { key: 'all', label: '全部', count: counts.all },
    { key: 'classic', label: '经典图标', count: counts.classic },
    { key: '界面', label: '界面', count: counts['界面'] || 0 },
    { key: '状态', label: '状态', count: counts['状态'] || 0 },
    { key: '开发', label: '开发', count: counts['开发'] || 0 },
    { key: '方向', label: '方向', count: counts['方向'] || 0 },
    { key: '分类', label: '分类导航', count: counts['分类'] || 0 },
  ];
});

const filtered = computed(() => {
  const kw = keywords.value.trim().toLowerCase();
  return iconList.filter((item) => {
    if (category.value === 'classic' && item.category) return false;
    if (!['all', 'classic'].includes(category.value) && item.category !== category.value) return false;
    if (!kw) return true;
    return `${item.className} ${item.keywords || ''} ${item.category || ''}`.toLowerCase().includes(kw);
  });
});

const shortName = (name) => name.replace(/^t-icon-/, '');

const copy = async (item) => {
  const short = shortName(item.className);
  const text = copyMode.value === 'class'
      ? item.className
      : `<t-icon name="${short}" />`;
  previewName.value = short;
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
</script>

<style lang="scss" scoped>
.icon-page { width: 100%; }
.icon-toolbar {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  margin-bottom: 16px;
  > :first-child { max-width: 380px; }
}
.icon-toolbar__right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-left: auto; }
.icon-count { font-size: 12.5px; color: var(--pui-text-muted); white-space: nowrap; }
.icon-mode {
  display: inline-flex; padding: 3px; border: 1px solid var(--pui-border); border-radius: 9px; background: var(--pui-bg-soft);
  button { border: 0; background: transparent; color: var(--pui-text-sub); font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer;
    &.active { background: var(--pui-bg-elevated); color: var(--pui-brand); font-weight: 600; box-shadow: var(--pui-shadow-sm); } }
}
.icon-tabs {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px;
  button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid var(--pui-border); border-radius: 999px;
    background: var(--pui-bg-elevated); color: var(--pui-text-sub); font-size: 12.5px; cursor: pointer;
    small { font-size: 10px; color: var(--pui-text-muted); }
    &:hover { border-color: var(--pui-brand); color: var(--pui-brand); }
    &.active { background: var(--pui-brand); border-color: var(--pui-brand); color: #fff; small { color: rgba(255,255,255,.8); } }
  }
}
.icon-playground {
  display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
  padding: 14px 18px; margin-bottom: 20px;
  border: 1px solid var(--pui-border); border-radius: 12px; background: var(--pui-bg-soft);
  &__label { font-size: 12px; font-weight: 600; color: var(--pui-text-sub); }
  &__stage { width: 66px; height: 52px; display: grid; place-items: center; background: var(--pui-bg-elevated); border-radius: 8px; border: 1px solid var(--pui-border); }
  &__ctrl { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: var(--pui-text-muted); input[type='range'] { width: 100px; } input[type='color'] { width: 30px; height: 26px; border: 0; background: transparent; cursor: pointer; } }
  &__code { margin-left: auto; font-size: 12px; color: var(--pui-brand); background: var(--pui-brand-soft); padding: 4px 9px; border-radius: 6px; }
}
.icon-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(116px, 1fr)); gap: 10px;
}
.icon-item {
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  min-height: 104px; padding: 14px 8px;
  border: 1px solid var(--pui-border); border-radius: 10px;
  background: var(--pui-bg-elevated); color: var(--pui-text-sub); cursor: pointer;
  transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
  i { font-size: 28px; color: var(--pui-text); line-height: 1; }
  span { font-size: 11.5px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  em { position: absolute; top: 6px; right: 6px; font-style: normal; font-size: 9px; color: var(--pui-brand); background: var(--pui-brand-soft); padding: 2px 5px; border-radius: 4px; }
  &:hover { transform: translateY(-3px); border-color: var(--pui-brand); box-shadow: var(--pui-shadow-sm); i { color: var(--pui-brand); } }
}
.icon-empty {
  grid-column: 1 / -1; padding: 48px 0; text-align: center; color: var(--pui-text-muted);
  p { margin: 12px 0 4px; color: var(--pui-text); }
  span { font-size: 12px; }
}
.icon-tip { margin-top: 18px; font-size: 12.5px; color: var(--pui-text-muted); }
@media (max-width: 640px) {
  .icon-toolbar > :first-child { max-width: 100%; width: 100%; }
  .icon-toolbar__right { margin-left: 0; }
  .icon-grid { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); }
}
</style>
