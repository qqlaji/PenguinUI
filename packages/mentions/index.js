import tMentions from './index.vue';
tMentions.install = (app) => {
  app.component(tMentions.name, tMentions);
};
export default tMentions;
