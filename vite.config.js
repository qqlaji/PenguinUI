import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import { resolve } from 'path';

const projectRoot = process.cwd();
// 只注入「纯变量」文件，避免把全局 CSS 规则重复打进每个组件样式块
const scssVariables = resolve(projectRoot, 'src/styles/global.scss').replace(/\\/g, '/');

// https://vitejs.dev/config
export default defineConfig({
  plugins: [vue({
    include: [/\.vue$/, /\.md$/],
  }), Markdown()],
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
    lib: {
      entry: './packages/index.js',
      name: 'penguinui',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' ? 'penguinui.js' : 'penguinui.umd.cjs',
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
