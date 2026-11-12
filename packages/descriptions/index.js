import tDescriptions from './index.vue'
import tDescriptionsItem from './item.vue'

tDescriptions.install = (app) => {
  app.component(tDescriptions.name, tDescriptions)
}
tDescriptionsItem.install = (app) => {
  app.component(tDescriptionsItem.name, tDescriptionsItem)
}

export { tDescriptionsItem }
export default tDescriptions
