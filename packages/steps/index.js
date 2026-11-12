import tSteps from './index.vue'
import tStep from './step.vue'

tSteps.install = (app) => {
  app.component(tSteps.name, tSteps)
}
tStep.install = (app) => {
  app.component(tStep.name, tStep)
}

export { tStep }
export default tSteps
