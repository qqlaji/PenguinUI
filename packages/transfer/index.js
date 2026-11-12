import tTransfer from './index.vue';

tTransfer.install = (app) => {
  app.component(tTransfer.name, tTransfer);
};

export default tTransfer;
