import { createVNode, reactive, render } from 'vue';
import NotificationContainer from './container.vue';

// 全局单例：通知以右上角卡片堆叠形式呈现，支持 title/message/type/duration/closable。
const state = reactive({ list: [] });
let hostEl = null;
let seed = 0;

const TYPE_MAP = {
  info: { icon: 't-icon-prompt-filling', showIcon: true },
  success: { icon: 't-icon-success', showIcon: true },
  warning: { icon: 't-icon-warning', showIcon: true },
  error: { icon: 't-icon-error', showIcon: true },
  none: { icon: '', showIcon: false }
};

function ensureHost() {
  if (hostEl) return;
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return;
  hostEl = document.createElement('div');
  hostEl.className = 'pui-notification-root';
  document.body.appendChild(hostEl);
  render(createVNode(NotificationContainer, { state, close }), hostEl);
}

function close(id) {
  const idx = state.list.findIndex((i) => i.id === id);
  if (idx === -1) return;
  const [removed] = state.list.splice(idx, 1);
  removed.onClose && removed.onClose();
}

function open(options) {
  if (typeof document === 'undefined') return { close: () => {} };
  ensureHost();
  const opts = typeof options === 'string' ? { message: options } : options || {};
  const type = opts.type || 'info';
  const meta = TYPE_MAP[type] || TYPE_MAP.info;
  const id = ++seed;
  const item = {
    id,
    title: opts.title || '',
    message: opts.message || '',
    type,
    duration: opts.duration === undefined ? 4500 : opts.duration,
    closable: opts.closable !== false,
    showIcon: opts.showIcon !== undefined ? opts.showIcon : meta.showIcon,
    icon: opts.icon || meta.icon,
    onClose: opts.onClose || null
  };
  state.list.push(item);
  if (item.duration > 0) {
    setTimeout(() => close(id), item.duration);
  }
  return { close: () => close(id) };
}

const Notification = Object.assign(open, {
  success: (msg, opts = {}) => open({ ...(typeof msg === 'string' ? { message: msg } : msg), type: 'success', ...opts }),
  warning: (msg, opts = {}) => open({ ...(typeof msg === 'string' ? { message: msg } : msg), type: 'warning', ...opts }),
  error: (msg, opts = {}) => open({ ...(typeof msg === 'string' ? { message: msg } : msg), type: 'error', ...opts }),
  info: (msg, opts = {}) => open({ ...(typeof msg === 'string' ? { message: msg } : msg), type: 'info', ...opts }),
  close
});

export default Notification;
