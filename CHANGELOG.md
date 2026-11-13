# Changelog

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **patch**（1.17.x）：只修 bug，不改 API，可安全升级
- **minor**（1.x.0）：新增组件或功能，向后兼容
- **major**（x.0.0）：有破坏性变更，升级需改代码

## [1.17.0] - 2026-11-13

### 新增

- 全新的蓝企鹅品牌标识，替换站点 Logo 与 favicon
- `apple-touch-icon.png`，改善 iOS 添加到主屏幕的效果

### 修复

- **Scrollbar**：滚动时滑块向上跑出容器的显示错误，滚动条现在固定在容器内
- **Signature**：提示文字紧贴签名画布，间距由 5px 调整为 18px
- 文档站页面最外层出现多余滚动条（顶栏高度少算 1px 导致）
- 文档站左侧组件列表切换时的 loading 指示被 `NEW` 标签遮挡
- 组件库 `dependencies` 中混入了 axios / pinia / vue-router 等文档站专用依赖，
  导致安装时多下载无关包。现在仅保留 `vue` 并在 `peerDependencies` 中声明

### 优化

- 文档站切换组件耗时从 1s+ 降至约 20ms：构建分包从 475 个减少到 92 个，
  示例源码改为展开时才加载，悬停菜单即预加载目标页
- README 改为纯使用者视角，移除本地开发与发布说明

## [1.16.0] - 2026-11-12

### 新增

- 扩充至 82 个组件，新增 AutoComplete、Cascader、DatePicker、TimePicker、
  Table、TreeSelect、Transfer、Upload、Tour、Watermark、CodeBlock 等
- TypeScript 类型声明 `types/index.d.ts`
- 文档站独立构建配置与 `build:docs` 脚本

## [1.8.0] - 2026-11-12

### 修复

- 图标全部丢失：字体资源改为本地内联，去掉失效的 CDN 依赖
- `t-button` 补上 `icon` 属性；菜单与下拉箭头垂直居中
- 修复 colorPicker / optfile 事件监听泄漏、loading 的 watchEffect 泄漏

### 新增

- `<t-icon>` 组件与 github / gitee / penguin / spinner6 图标

## [1.7.51] - 更早

历史版本，详见 npm 版本列表。
