import tList from './index.vue';
tList.install = (app) => {
  app.component(tList.name, tList);
};
export default tList;
