import tMenu from './index.vue';
tMenu.install = app => {
  app.component(tMenu.name, tMenu)
} 
export default tMenu