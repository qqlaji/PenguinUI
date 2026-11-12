# 安装使用

## 安装

#### 推荐使用 npm 的方式安装，也可选用 pnpm 或 yarn。

```bash
npm install penguinui --save
pnpm add penguinui
yarn add penguinui
```

<br/>

## 使用 penguinui

#### 需要注意的是 css 样式文件需要单独引入（图标字体已内联在样式文件中，无需额外配置）。

```javascript
/*js*/
import { createApp } from "vue";
import App from "@/App.vue";
import penguinUi from "penguinui";
import "penguinui/style.css";

const app = createApp(App);
app.use(penguinUi);
app.mount("#app");
```

<br/>

## 愉快开始

```html
<!-- html -->
<t-button>默认按钮</t-button>
<t-button type="primary">主要按钮</t-button>
<t-icon name="search" />
```

<br/>

## 按需引用

#### 按需引用时不需要使用 **app.use()** 注册，但样式仍需引入一次。

```javascript
/*js*/
import { tButton, tInput } from "penguinui";
import "penguinui/style.css";
```

<br/>

```html
<t-button>点击</t-button>
<t-input v-model="value" placeholder="基本使用"></t-input>
```

<br/>
