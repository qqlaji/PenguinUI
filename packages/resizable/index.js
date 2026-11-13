import tResizable from './index.vue';
import tResizableGroup from './group.vue';

tResizable.install = (app) => {
  app.component(tResizable.name, tResizable);
};
tResizableGroup.install = (app) => {
  app.component(tResizableGroup.name, tResizableGroup);
};

export { tResizableGroup };
export default tResizable;
