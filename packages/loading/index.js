import { createApp, reactive } from 'vue'
import mLoading from './index.vue'

const obj = reactive({
  show: false,
  text: '加载中...',
  icon: 't-icon-loading1',
  img: '',
  target: 'body',
  textColor: '#fff',
  bgColor: 'rgba(0, 0, 0, 0.6)',
  showIcon: true,
  position: 'fixed',
  scrollLock: true,
})
const $loading = createApp(mLoading, { obj }).mount(
  typeof document !== 'undefined' && typeof document.createElement === 'function'
    ? document.createElement('div')
    : ''
)

const LOADING_CLASS = 'penguin-loading-parentClass'
const isBrowser = () => typeof document !== 'undefined' && typeof document.body !== 'undefined'
const getTargetEl = (target) => {
  if (!isBrowser()) return null
  if (!target || target === 'body') return document.body
  try {
    return document.querySelector(target)
  } catch {
    return null
  }
}
// 同步执行即可，不再在 show() 里反复注册 watchEffect 造成 effect 泄漏
const applyScrollLock = (target, scrollLock) => {
  const el = getTargetEl(target)
  if (el) el.classList.toggle(LOADING_CLASS, !!scrollLock)
}
const mountTo = (target) => {
  if (!isBrowser()) return
  const el = getTargetEl(target)
  ;(el || document.body).appendChild($loading.$el)
}

const LOADING_ICONS = [
  't-icon-loading1', 't-icon-loading2', 't-icon-loading3',
  't-icon-loading4', 't-icon-loading5', 't-icon-loading6',
  't-icon-spinner6', 't-icon-round-loading'
]

const Loading = {
  show(data) {
    obj.show = true
    if (data != undefined) {
      if (data.text != undefined) obj.text = data.text
      if (data.target != undefined) obj.target = data.target
      if (data.scrollLock != undefined) obj.scrollLock = data.scrollLock
      if (data.icon != undefined && LOADING_ICONS.includes(data.icon)) obj.icon = data.icon
      if (data.textColor != undefined) obj.textColor = data.textColor
      if (data.bgColor != undefined) obj.bgColor = data.bgColor
      if (data.showIcon != undefined) obj.showIcon = data.showIcon
      if (data.img != undefined) obj.img = data.img
      applyScrollLock(obj.target, obj.scrollLock)
      mountTo(obj.target)
      obj.position = obj.target !== 'body' ? 'absolute' : 'fixed'
    } else {
      mountTo('body')
      obj.position = 'fixed'
      applyScrollLock('body', obj.scrollLock)
    }
  },
  hide() {
    obj.show = false
    applyScrollLock(obj.target, false)
  }
}

export default Loading
