import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import {resolve} from 'path';
// https://vitejs.dev/config
export default defineConfig({
  plugins: [vue({
    include:[/\.vue$/, /\.md$/, 'package.json'],
  }),Markdown()],
  build: {
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    lib: {
      entry: './packages/index.js',
      name: 'penguinui',
    },
  },
  resolve: {
    alias: {
      "@":resolve(__dirname,"src"),
    },
  },
    css:{
      preprocessorOptions:{
          scss:{
              additionalData:'@use "./src/styles/style.scss" as *;'
          }
      }
    }
});
