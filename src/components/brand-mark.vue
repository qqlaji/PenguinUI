<template>
  <!-- 品牌印章：几何企鹅负形。刻意不用渐变、胶囊与发光，避免通用 AI 视觉 -->
  <span class="brand-mark" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <rect x="0.5" y="0.5" width="39" height="39" rx="3.5" fill="#101923" stroke="currentColor" stroke-opacity="0.28" />
      <!-- 头部与身体：一块连续的白色负形 -->
      <path
          fill="#f7f9fc"
          d="M20 5.6c-5.1 0-8.4 4.1-8.4 10v9.1l-3.1 5.4c-.6 1 .1 2.2 1.3 2.2h20.4c1.2 0 1.9-1.2 1.3-2.2l-3.1-5.4v-9.1c0-5.9-3.3-10-8.4-10z"
      />
      <!-- 双翼：斜切三角，形成非对称轮廓 -->
      <path fill="#f7f9fc" d="M11.7 16.7 5.9 25l6.1-2.1zM28.3 16.7 34.1 25l-6.1-2.1z" />
      <!-- 眼睛与喙：墨色 / 单一强调色 -->
      <circle cx="16.7" cy="14.6" r="1.5" fill="#101923" />
      <circle cx="23.3" cy="14.6" r="1.5" fill="#101923" />
      <path d="M16.9 19.1h6.2L20 22.4z" fill="var(--pui-brand, #0e80eb)" />
      <!-- 脚：两条短横线，构成印章的基线 -->
      <path d="M13.4 32.3h5.4M21.2 32.3h5.4" stroke="var(--pui-brand, #0e80eb)" stroke-width="2.1" stroke-linecap="round" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  size: { type: [Number, String], default: 34 },
});
</script>

<style scoped>
.brand-mark {
  display: inline-grid;
  place-items: center;
  flex: none;
  line-height: 0;
  /* 双层边框代替投影：规格书/印章质感 */
  box-shadow: 0 0 0 1px var(--pui-border-strong);
  border-radius: 4px;
  overflow: hidden;
  background: #101923;
}
svg { width: 100%; height: 100%; display: block; }
</style>
