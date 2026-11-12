import tCalendar from './index.vue'

tCalendar.install = (app) => {
  app.component(tCalendar.name, tCalendar)
}

export default tCalendar
