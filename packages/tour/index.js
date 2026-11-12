import tTour from './index.vue';
tTour.install = (app) => {
  app.component(tTour.name, tTour);
};
export default tTour;
