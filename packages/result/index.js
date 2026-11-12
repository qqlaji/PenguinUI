import tResult from './index.vue'
tResult.install = app => {
  app.component(tResult.name, tResult)
}
export default tResult
