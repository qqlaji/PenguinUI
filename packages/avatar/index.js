import tAvatar from './index.vue'
tAvatar.install = app => {
  app.component(tAvatar.name, tAvatar)
}
export default tAvatar
