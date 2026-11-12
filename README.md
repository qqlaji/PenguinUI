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

全部 230 枚图标见文档站「Icon 图标」页，支持分类筛选、中文关键词搜索、实时预览与点击复制类名 / 组件标签。新增 39 枚内联 SVG 图标（如 `sun`、`moon`、`sparkles`、`rocket`、`check-circle`、`cat-data`），用法与字体图标完全一致；`cat-*` 系列为文档站 8 个分组的专属图形编码。

### 组件一览

> 共 82 个组件（不含「安装使用」「颜色」这两个纯文档页），全部在文档站有可运行示例与 Props 表格。

| 分类 | 组件 |
| --- | --- |
| 常规 | Layout、ConfigProvider、Typography、PageHeader、Scrollbar、Color、Icon |
| 通用 | Button、FloatButton、Input、AutoComplete、Mentions、Textarea、Space、Select、TreeSelect、Transfer、Dropdown、Radio、Checkbox、Switch、OptFile、ColorPicker、Rate、Form、InputNumber、Slider、Upload、InputOTP、Flex、Splitter |
| 数据 | Badge、Table（**支持排序 / 筛选 / 行选择 / 分页**）、Pagination、Date、DatePicker、Tree、Menu、Tabs、Progress、Breadcrumb、Steps、Timeline、TimePicker、Cascader、Statistic、Countdown、VirtualList、Calendar、Descriptions |
| 交互 | Message、Popover、Confirm、Modal、Drawer、Loading、Backtop、Popconfirm、Affix、Anchor、Tour |
| 展示 | Card、Collapse、Avatar、Tag、Empty、Skeleton、Carousel、Image、**ImageViewer**、Segmented、List、Comment、Bubble、Signature、QRCode、Watermark |
| 代码 | **CodeBlock**（零依赖语法高亮） |
| 反馈 | Alert、Tooltip、Notification、Result |
| 其他 | Divider |

加粗为 v1.16.0 新增组件。文档站支持 `Ctrl / ⌘ + K` 全站搜索（组件 + 图标）、明暗主题切换与移动端侧栏。

### 本地开发

```bash
npm install
npm run dev           # 启动文档站
npm run build         # 构建组件库到 dist/
npm run build:docs    # 构建文档站到 docs-dist/（相对路径，可部署到任意子目录）
npm run preview:docs  # 本地预览文档站产物
```

### 发布到 npm

```bash
npm run build
npm login                 # 首次发布或凭据过期时
npm publish               # 发布 package.json 中的版本
# 或：npm run release     # 自动 patch 版本号并发布
```

仓库地址：<https://gitee.com/blue-sf/penguinui>
