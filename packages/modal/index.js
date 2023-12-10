import tModal from './index.vue';
tModal.install = app => {
  app.component(tModal.name, tModal)
} 
export default tModal