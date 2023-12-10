import tBacktop from './index.vue';
tBacktop.install = app => {
  app.component(tBacktop.name, tBacktop)
} 
export default tBacktop