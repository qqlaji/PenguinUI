import { createVNode, render } from 'vue'
import mMessage from './index.vue'

// v1.9：新增 duration 别名、closable 手动关闭、offset 自定义位置、
// 多条消息自动堆叠，并返回销毁函数方便调用方主动关闭。
export default ({ text, type, timeout, duration, closable, icon, textColor, bgColor, customClass, offset }) => {
  // SSR / 非浏览器环境直接退出，避免对空字符串调用 setAttribute
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return
  const div = document.createElement('div')
  div.setAttribute('class', 'penguinui-meassage-container')
  document.body.appendChild(div)

  // 同一时刻的消息按 56px 依次下移，避免叠在一起
  const siblings = document.querySelectorAll('.penguinui-meassage-container').length - 1
  const top = offset ?? 25 + siblings * 56
  let timer = null
  const destroy = () => {
    clearTimeout(timer)
    render(null, div)
    if (div.parentNode) div.parentNode.removeChild(div)
  }

  const vnode = createVNode(
    mMessage,
    { text, type, closable, icon, textColor, bgColor, customClass, top, closeHandler: destroy },
    [text]
  )
  render(vnode, div)
  timer = setTimeout(destroy, duration ?? timeout ?? 2500)
  return destroy
}
