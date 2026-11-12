import tTooltip from './index.vue'
tTooltip.install = app => {
  app.component(tTooltip.name, tTooltip)
}
export default tTooltip
