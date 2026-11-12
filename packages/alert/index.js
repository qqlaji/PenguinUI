import tAlert from './index.vue'
tAlert.install = app => {
  app.component(tAlert.name, tAlert)
}
export default tAlert
