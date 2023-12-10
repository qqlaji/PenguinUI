# 安装使用

## 安装

#### 推荐使用 _npm_ 的方式安装,也可选用 _cpm_ 或 _yarn_ 进行安装。

```
npm install  penguin-ui
cnpm install  penguin-ui --save
yarn add penguin-ui
```

<br/>

## 使用 penguin-ui

#### 需要注意的是 css 样式文件需要您单独引入。

```javascript
/*js*/
import { createApp } from "vue";
import App from "@/App.vue";
import penguinUi from "penguin-ui";
import "../node_modules/penguin-ui/dist/style.css";

const app = createApp(App);
app.use(penguinUi);
app.mount("#app");
```

<br/>

## 愉快开始

#### 至此 penguin-ui 就引入完成并且可以使用了。

```html
<!-- html -->
<t-button>默认按钮</m-buttonn>
<t-button type="primary">主要按钮</t-button>
```

<br/>

## 按需引用

#### 您可以根据个人需要按需引用组件来使用，按需引用时不需要使用 <font color=#0e80eb>**app.use()**</font> 方法注册。

```javascript
/*js*/
import { tButton, tInput } from "penguin-ui";
```

<br/>

```html
<t-button>点击</t-button>
<t-input v-model="value" placeholder="基本使用"></t-input>
```

<br/>
