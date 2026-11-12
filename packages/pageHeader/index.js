import tPageHeader from './index.vue';
tPageHeader.install = (app) => {
  app.component(tPageHeader.name, tPageHeader);
};
export default tPageHeader;
