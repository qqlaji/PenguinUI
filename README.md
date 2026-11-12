<div align="center">
  <h1 style="border-bottom:0">
    <p>penguinui 组件库</p>
    <p style="font-size:20px">一套适合开发者使用的轻量级 UI 组件库，完美支持 Vue 3</p>
  </h1>
  <p>
    <a href="https://www.npmjs.com/package/penguinui">npm</a> ·
    <a href="https://gitee.com/blue-sf/penguinui">Gitee 仓库</a> ·
    <a href="https://gitee.com/blue-sf/penguinui/issues">问题反馈</a>
  </p>
</div>

<br/>

### 快速使用

```bash
npm install penguinui --save
# 或
pnpm add penguinui
```

### 全量引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import PenguinUI from 'penguinui'
import 'penguinui/style.css'

createApp(App).use(PenguinUI).mount('#app')

console.log(PenguinUI.version) // 与 package.json 保持一致
```

> `penguinui/style.css` 已包含全部图标字体（内联，无外部 CDN 依赖），无需再单独引入图标资源。

### 按需引入

```js
import { tButton, tInput, tIcon } from 'penguinui'
import 'penguinui/style.css'

app.component('t-button', tButton)
app.component('t-input', tInput)
app.component('t-icon', tIcon)
```

### 图标

```html
<!-- 推荐：组件写法 -->
<t-icon name="search" size="20" color="#0e80eb" />
<t-icon name="loading1" spin />
<t-icon name="gitee" size="20" />

<!-- 兼容：类名写法 -->
<i class="t-icon-search"></i>
<i class="iconfont t-icon-search"></i>
```

全部图标见文档站「Icon 图标」页，共 190+ 枚，支持搜索与点击复制类名。

### 本地开发

```bash
npm install
npm run dev     # 启动文档站
npm run build   # 构建组件库到 dist/
```

### 发布到 npm

```bash
npm run build
npm login                 # 首次发布或凭据过期时
npm publish               # 发布 package.json 中的版本
# 或：npm run release     # 自动 patch 版本号并发布
```

仓库地址：<https://gitee.com/blue-sf/penguinui>
