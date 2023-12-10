import tBreadcrumb from './index.vue'
import tBreadcrumbItem from './breadcrumbItem.vue'
tBreadcrumb.install = (app) => {
  app.component(tBreadcrumb.name, tBreadcrumb)
  app.component(tBreadcrumbItem.name, tBreadcrumbItem)
}

export default tBreadcrumb
