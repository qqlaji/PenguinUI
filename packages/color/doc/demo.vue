<template>
  <div class="color-doc">
    <p class="color-doc__hint">点击任意色块 / 示例卡即可复制对应色值或 CSS 片段</p>

    <h3 class="color-doc__title">品牌与语义色</h3>
    <div class="palette-grid">
      <button
        v-for="c in mainColors"
        :key="c.name"
        type="button"
        class="palette-card"
        @click="copy(c.hex)"
      >
        <span
          class="palette-card__swatch"
          :class="{ 'palette-card__swatch--light': c.light }"
          :style="{ background: c.hex }"
        >{{ c.hex.toUpperCase() }}</span>
        <span class="palette-card__meta">
          <span class="palette-card__name">{{ c.name }}</span>
          <span class="palette-card__hex">{{ c.rgba }}</span>
        </span>
      </button>
    </div>

    <h3 class="color-doc__title">主色梯度</h3>
    <p class="palette-note">从 100% 到 10% 的透明度阶梯，适合做背景、悬停态与分隔层。</p>
    <div class="scale-row">
      <span
        v-for="(a, i) in 10"
        :key="a"
        :style="{ background: `rgba(14,128,235,${(11 - a) / 10})` }"
        :title="`rgba(14,128,235,${(11 - a) / 10})`"
        @click="copy(`rgba(14,128,235,${(11 - a) / 10})`)"
      >{{ (11 - a) * 10 }}%</span>
    </div>

    <h3 class="color-doc__title">文本颜色</h3>
    <div class="palette-grid">
      <button
        v-for="c in textColors"
        :key="c.name"
        type="button"
        class="palette-card"
        @click="copy(c.hex)"
      >
        <span class="palette-card__swatch" :style="{ background: c.hex }">{{ c.hex.toUpperCase() }}</span>
        <span class="palette-card__meta">
          <span class="palette-card__name">{{ c.name }}</span>
          <span class="palette-card__hex">{{ c.rgba }}</span>
        </span>
      </button>
    </div>

    <h3 class="color-doc__title">边框颜色</h3>
    <p class="palette-note">组件库默认使用 1px 发丝边框；暗色主题下自动切换为更亮的描边。</p>
    <div class="border-samples">
      <div
        v-for="b in borders"
        :key="b.name"
        class="border-sample"
        @click="copy(b.hex)"
      >
        <div class="border-sample__demo" :style="b.style">{{ b.label }}</div>
        <span class="border-sample__name">{{ b.name }}</span>
        <span class="border-sample__value">{{ b.hex }}</span>
      </div>
    </div>

    <h3 class="color-doc__title">阴影颜色</h3>
    <p class="palette-note">三级高度体系，阴影带环境色而非纯黑，悬浮、弹层与抽屉各用一级。</p>
    <div class="shadow-samples">
      <div
        v-for="s in shadows"
        :key="s.name"
        class="shadow-sample"
        @click="copy(s.value)"
      >
        <div class="shadow-sample__demo" :style="{ boxShadow: s.value }">{{ s.label }}</div>
        <span class="shadow-sample__name">{{ s.name }}</span>
        <span class="shadow-sample__value">{{ s.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Message from '../../message/index';

const mainColors = [
  { name: '主要颜色 Primary', hex: '#0e80eb', rgba: 'rgba(14,128,235,1)' },
  { name: '成功状态 Success', hex: '#09b63d', rgba: 'rgba(9,182,61,1)' },
  { name: '危险状态 Danger', hex: '#ec3437', rgba: 'rgba(236,52,55,1)' },
  { name: '警告状态 Warning', hex: '#f57b29', rgba: 'rgba(245,123,41,1)' },
  { name: '信息状态 Info', hex: '#7b5cff', rgba: 'rgba(123,92,255,1)', light: false },
  { name: '中性灰 Neutral', hex: '#505050', rgba: 'rgba(80,80,80,1)' },
];
const textColors = [
  { name: '主文本', hex: '#1c2534', rgba: 'rgba(28,37,52,1)' },
  { name: '次文本', hex: '#5b6879', rgba: 'rgba(91,104,121,1)' },
  { name: '弱文本 / 占位', hex: '#8b96a6', rgba: 'rgba(139,150,166,1)' },
];
const borders = [
  { name: '常规边框', hex: '#f0f0f0', label: '1px solid #f0f0f0', style: { border: '1px solid #f0f0f0' } },
  { name: '输入控件边框', hex: '#dcdfe6', label: '1px solid #dcdfe6', style: { border: '1px solid #dcdfe6' } },
  { name: '强调边框', hex: '#0e80eb', label: '1px solid #0e80eb', style: { border: '1px solid #0e80eb', color: '#0e80eb' } },
  { name: '主题边框变量', hex: 'var(--pui-border)', label: '跟随明暗主题', style: { border: '1px solid var(--pui-border)' } },
];
const shadows = [
  { name: '一级 · 悬浮', label: 'shadow-sm', value: '0 2px 8px rgba(24,44,78,.08)' },
  { name: '二级 · 弹层', label: 'shadow', value: '0 12px 36px rgba(24,44,78,.14)' },
  { name: '三级 · 抽屉', label: 'shadow-lg', value: '0 24px 64px rgba(24,44,78,.20)' },
  { name: '经典描边阴影', label: 'legacy', value: '0 2px 12px 0 rgba(0,0,0,.1)' },
];

const copy = async (text) => {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
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

<style scoped>
.color-doc {
  font-family: var(--pui-font-body, sans-serif);
}
.color-doc__hint {
  margin: 0 0 26px;
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.color-doc__title {
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--pui-text, #1c2534);
  margin: 30px 0 12px;
  padding-left: 10px;
  border-left: 3px solid var(--pui-brand, #0e80eb);
}
</style>
