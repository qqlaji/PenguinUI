import tCountdown from './index.vue';
tCountdown.install = (app) => {
  app.component(tCountdown.name, tCountdown);
};
export default tCountdown;
