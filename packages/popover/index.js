import tPopover from './index.vue';
tPopover.install = app => {
    app.component(tPopover.name, tPopover)
}
export default tPopover