import tBubble from './index.vue';
tBubble.install = (app) => {
  app.component(tBubble.name, tBubble);
};
export default tBubble;
