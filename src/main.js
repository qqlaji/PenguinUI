import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from "pinia";
import PUI from '../packages/index';
import router from '@/router';
import { initTheme } from '@/composables/useTheme';
// 图标与组件样式已由 packages/index.js 统一引入（本地资源，无外部 CDN）
// 只注册文档站实际使用的语言，避免把全量语言包（900KB+）打进产物
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import sql from "highlight.js/lib/languages/sql";
import http from "highlight.js/lib/languages/http";
import go from "highlight.js/lib/languages/go";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
// 语法配色由 src/styles/theme.scss 提供（跟随设计令牌，支持明暗主题）

[
    ['javascript', javascript], ['xml', xml], ['css', css], ['bash', bash],
    ['json', json], ['python', python], ['java', java], ['sql', sql],
    ['http', http], ['go', go], ['cpp', cpp], ['csharp', csharp],
].forEach(([name, language]) => hljs.registerLanguage(name, language));
hljs.configure({ ignoreUnescapedHTML: true });

initTheme();
const app = createApp(App);
app.use(PUI);
app.use(router);
app.use(createPinia());
// 指令必须在首次渲染之前注册，否则 router-view 内的首个文档页无法解析 v-highlight
app.directive("highlight", function (el) {
    const blocks = el.querySelectorAll("pre code:not([data-highlighted='yes'])");
    blocks.forEach((block) => {
        hljs.highlightElement(block);
    });
});
app.mount("#app");
