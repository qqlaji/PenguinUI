import tConfigProvider from './index.vue';
tConfigProvider.install = (app) => {
  app.component(tConfigProvider.name, tConfigProvider);
};
export * from './config';
export default tConfigProvider;
