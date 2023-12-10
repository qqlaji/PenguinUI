import tTabs from './index.vue';
import mTabPane from './pane.vue';
tTabs.install = app => {
  app.component(tTabs.name, tTabs)
  app.component(mTabPane.name,mTabPane)
}
export default tTabs