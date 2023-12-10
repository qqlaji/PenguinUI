import tProgress from './index.vue';
tProgress.install = app => {
  app.component(tProgress.name, tProgress)
} 
export default tProgress