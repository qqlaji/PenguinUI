import tCard from './index.vue'
tCard.install = app => {
  app.component(tCard.name, tCard)
}
export default tCard
