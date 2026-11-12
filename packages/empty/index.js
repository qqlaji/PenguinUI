import tEmpty from './index.vue'
tEmpty.install = app => {
  app.component(tEmpty.name, tEmpty)
}
export default tEmpty
