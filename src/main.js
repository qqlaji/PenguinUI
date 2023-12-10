import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from "pinia";
import PUI from '../packages/index';
// import PUI from 'penguinui';
import router from '@/router';
import '../node_modules/penguinui/dist/style.css'
import hljs from "highlight.js";
import "highlight.js/styles/color-brewer.css"
const app = createApp(App);
app.use(PUI);
app.use(router);
app.use(createPinia());
app.mount("#app");
hljs.configure({
    ignoreUnescapedHTML: true,
    languages: [
        "javascript",
        "css",
        "python",
        "html",
        "bash",
        "java",
        "sql",
        "json",
        "http",
        "go",
        "c++",
        "c#",
        "",
    ],
});
app.directive("highlight", function (el) {
    const blocks = el.querySelectorAll("pre code");
    blocks.forEach((blocks) => {
        hljs.highlightElement(blocks);
    });
});



