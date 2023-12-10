import tBadge from './index.vue'
tBadge.install = app => {
  app.component(tBadge.name, tBadge)
} 
export default tBadge