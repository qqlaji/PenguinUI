<div align="center">
  <h1 style="border-bottom:0">
    <p>penguin-ui组件库</p>
    <p style="font-size:20px">一套适合开发者使用的轻量级UI组件库，完美支持vue3</p>
  </h1>
</div>
<br/>

***
### 快速使用
```
npm install  penguinui --save
cnpm install  penguinui --save
```
### 引入
```
import { createApp } from 'vue'
import App from '@/App.vue'
import mzlUi from 'penguinui'
import '../node_modules/penguinui/dist/style.css'

const app = createApp(App)
app.use(PUI)
app.mount('#app')
```
### 按需引用
```
import { mButton, mInput } from 'penguinui'