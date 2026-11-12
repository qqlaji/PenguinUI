// 文档站独立构建配置：组件库产物仍由 vite.config.js 负责（lib 模式）
// 用法：npm run build:docs  →  docs-dist/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import { resolve } from 'path';

const projectRoot = process.cwd();
const scssVariables = resolve(projectRoot, 'src/styles/global.scss').replace(/\\/g, '/');

export default defineConfig({
  // 相对路径产物，便于部署到任意子目录 / GitHub Pages / Gitee Pages
  base: './',
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown(),
  ],
  build: {
    outDir: 'docs-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(projectRoot, 'index.html'),
      // 第三方依赖单独成块，业务代码更新时浏览器可复用缓存
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('highlight.js')) return 'highlight';
            if (id.includes('markdown-it')) return 'markdown';
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [resolve(projectRoot, 'src/styles')],
        additionalData: `@use "${scssVariables}" as *;`,
      },
    },
  },
});
