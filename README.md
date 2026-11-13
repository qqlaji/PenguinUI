<div align="center">
  <h1 style="border-bottom:0">
    <p>penguinui 组件库</p>
    <p style="font-size:20px">一套适合开发者使用的轻量级 UI 组件库，完美支持 Vue 3</p>
  </h1>
  <p>
    <a href="https://qqlaji.github.io/PenguinUI/"><strong>📖 在线文档 / 组件预览</strong></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/penguinui">npm</a> ·
    <a href="https://github.com/qqlaji/PenguinUI">GitHub</a> ·
    <a href="https://gitee.com/blue-sf/penguinui">Gitee</a> ·
    <a href="https://github.com/qqlaji/PenguinUI/issues">问题反馈</a>
  </p>
</div>

<br/>

> **文档站：<https://qqlaji.github.io/PenguinUI/>**
> 全部 82 个组件都有可运行示例、Props 表格与图标检索，支持 `Ctrl / ⌘ + K` 全站搜索与明暗主题切换。

## 安装

```bash
npm install penguinui
# 或
pnpm add penguinui
# 或
yarn add penguinui
```

支持 Vue 3，同时提供 ES Module、CommonJS 与 TypeScript 类型声明，无需额外安装 `@types` 包。

## 使用

### 全量引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import PenguinUI from 'penguinui'
import 'penguinui/style.css'

createApp(App).use(PenguinUI).mount('#app')

console.log(PenguinUI.version) // 当前版本号
```

### 按需引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import { tButton, tInput, tIcon } from 'penguinui'
import 'penguinui/style.css'

const app = createApp(App)
app.component('t-button', tButton)
app.component('t-input', tInput)
app.component('t-icon', tIcon)
app.mount('#app')
```

> `penguinui/style.css` 已包含全部图标字体（内联，无外部 CDN 依赖），无需再单独引入图标资源。

### TypeScript

包内自带类型声明，直接使用即可获得完整的 Props 提示：

```ts
import type { ButtonProps } from 'penguinui'
```

## 图标

```html
<!-- 推荐：组件写法 -->
<t-icon name="search" size="20" color="#0e80eb" />
<t-icon name="loading1" spin />
<t-icon name="gitee" size="20" />

<!-- 兼容：类名写法 -->
<i class="t-icon-search"></i>
<i class="iconfont t-icon-search"></i>
```

全部 230 枚图标见文档站「Icon 图标」页，支持分类筛选、中文关键词搜索、实时预览与点击复制类名 / 组件标签。

## 组件一览

> 共 82 个组件（不含「安装使用」「颜色」这两个纯文档页），全部在文档站有可运行示例与 Props 表格。

| 分类 | 组件 |
| --- | --- |
| 常规 | Layout、ConfigProvider、Typography、PageHeader、Scrollbar、Color、Icon |
| 通用 | Button、FloatButton、Input、AutoComplete、Mentions、Textarea、Space、Select、TreeSelect、Transfer、Dropdown、Radio、Checkbox、Switch、OptFile、ColorPicker、Rate、Form、InputNumber、Slider、Upload、InputOTP、Flex、Splitter |
| 数据 | Badge、Table（支持排序 / 筛选 / 行选择 / 分页）、Pagination、Date、DatePicker、Tree、Menu、Tabs、Progress、Breadcrumb、Steps、Timeline、TimePicker、Cascader、Statistic、Countdown、VirtualList、Calendar、Descriptions |
| 交互 | Message、Popover、Confirm、Modal、Drawer、Loading、Backtop、Popconfirm、Affix、Anchor、Tour |
| 展示 | Card、Collapse、Avatar、Tag、Empty、Skeleton、Carousel、Image、ImageViewer、Segmented、List、Comment、Bubble、Signature、QRCode、Watermark |
| 代码 | CodeBlock（零依赖语法高亮） |
| 反馈 | Alert、Tooltip、Notification、Result |
| 其他 | Divider |

## 浏览器支持

现代浏览器（Chrome / Edge / Firefox / Safari 最近两个大版本）。组件库使用 CSS 变量实现主题定制，不支持 IE。

## 反馈

- 问题反馈：<https://github.com/qqlaji/PenguinUI/issues>
- 仓库地址：<https://github.com/qqlaji/PenguinUI> ｜ <https://gitee.com/blue-sf/penguinui>

## License

MIT
