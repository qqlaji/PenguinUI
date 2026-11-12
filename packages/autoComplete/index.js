import tAutoComplete from './index.vue';
tAutoComplete.install = (app) => {
  app.component(tAutoComplete.name, tAutoComplete);
};
export default tAutoComplete;
