import tTimeline from './index.vue'
import tTimelineItem from './item.vue'

tTimeline.install = (app) => {
  app.component(tTimeline.name, tTimeline)
}
tTimelineItem.install = (app) => {
  app.component(tTimelineItem.name, tTimelineItem)
}

export { tTimelineItem }
export default tTimeline
