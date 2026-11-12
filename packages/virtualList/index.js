import tVirtualList from './index.vue';
tVirtualList.install = (app) => {
  app.component(tVirtualList.name, tVirtualList);
};
export default tVirtualList;
