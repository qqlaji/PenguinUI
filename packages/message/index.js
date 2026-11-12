import { createVNode, render } from 'vue'
import mMessage from './index.vue'

export default ({ text, type, timeout, icon, textColor, bgColor, customClass }) => {
  // SSR / 非浏览器环境直接退出，避免对空字符串调用 setAttribute
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return
  const div = document.createElement('div')
  div.setAttribute('class', 'penguinui-meassage-container')
  document.body.appendChild(div)
  let timer = null
  const vnode = createVNode(mMessage, { text, type, timeout, icon, textColor, bgColor, customClass }, [text])
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
    if (div.parentNode) div.parentNode.removeChild(div)
    clearTimeout(timer)
  }, timeout || 2500)
}
