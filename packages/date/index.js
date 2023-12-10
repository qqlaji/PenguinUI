import tDate from './index.vue';
tDate.install = app => {
  app.component(tDate.name, tDate)
} 
export default tDate