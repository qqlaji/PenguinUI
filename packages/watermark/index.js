import tWatermark from './index.vue';
tWatermark.install = (app) => {
  app.component(tWatermark.name, tWatermark);
};
export default tWatermark;
