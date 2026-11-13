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
    // GitHub Pages 走公网、RTT 高：每个 chunk 都是一次往返请求，
    // 所以这里刻意把 400+ 个碎片合并成少数几个大包，减少请求瀑布
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: false,
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      input: resolve(projectRoot, 'index.html'),
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/vue/') || id.includes('@vue/')) return 'vue';
          if (id.includes('vue-router')) return 'vue';
          if (id.includes('highlight.js')) return 'highlight';
          if (id.includes('markdown-it')) return 'markdown';
          return 'vendor';
        },
        // 把每个文档页的 demo / Attributes 等小模块合并回所属文档 chunk，
        // 避免出现 266 个 demo-* 与 81 个 Attributes-* 的请求碎片
        experimentalMinChunkSize: 120 * 1024,
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
