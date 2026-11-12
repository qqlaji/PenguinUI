import tCarousel from './index.vue'
import tCarouselItem from './item.vue'

tCarousel.install = (app) => {
  app.component(tCarousel.name, tCarousel)
}
tCarouselItem.install = (app) => {
  app.component(tCarouselItem.name, tCarouselItem)
}

export { tCarouselItem }
export default tCarousel
