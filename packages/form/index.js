import tForm from './index.vue'
import tFormItem from './item.vue'

tForm.install = (app) => {
  app.component(tForm.name, tForm)
}
tFormItem.install = (app) => {
  app.component(tFormItem.name, tFormItem)
}

export { tFormItem }
export default tForm
