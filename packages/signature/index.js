import tSignature from './index.vue';
tSignature.install = (app) => {
  app.component(tSignature.name, tSignature);
};
export default tSignature;
