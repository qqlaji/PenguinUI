import tChat from './index.vue';

tChat.install = (app) => {
  app.component(tChat.name, tChat);
};

export { renderMarkdown, stripMarkdown } from './markdown';
export default tChat;
