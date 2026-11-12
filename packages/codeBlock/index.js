import tCodeBlock from './index.vue';
tCodeBlock.install = (app) => {
  app.component(tCodeBlock.name, tCodeBlock);
};
export default tCodeBlock;
