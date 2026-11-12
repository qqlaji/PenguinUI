import tImageViewer from './index.vue';
tImageViewer.install = (app) => {
  app.component(tImageViewer.name, tImageViewer);
};
export default tImageViewer;
