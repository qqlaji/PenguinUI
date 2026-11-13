/**
 * usePopper —— 浮层定位与生命周期复用逻辑
 * ---------------------------------------------------------------------------
 * 抽自 Dropdown / Cascader / Select / AutoComplete / Mentions / TreeSelect /
 * DatePicker / TimePicker / Tooltip / Popover 里各自重复的实现。这些组件原来
 * 每个都写一遍「算矩形 → 判断翻转 → 钳制视口 → 监听 scroll/resize」，逻辑相似
 * 但各有各的小 bug（有的漏了 resize，有的钳制方向反了）。
 *
 * 主要能力：
 *  - 12 个方向（top / bottom / left / right × start / center / end）
 *  - 空间不足自动翻转 + 箭头处的偏移修正
 *  - 视口边界钳制（上下左右都不许出界）
 *  - scroll（捕获阶段，容器滚动也能跟随）与 resize 跟随
 *  - 点击外部关闭、Esc 关闭
 *  - 面板实际尺寸变化时重新定位（ResizeObserver）
 *
 * 用法：
 *   const { visible, panelStyle, toggle, open, close, update } = usePopper({
 *     triggerRef, panelRef, placement: 'bottom-start', offset: 8
 *   })
 */

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

/** 把 12 方向的 base / align 拆出来 */
function parsePlacement(placement) {
  const [side, align = 'center'] = String(placement || 'bottom-start').split('-');
  const validSide = ['top', 'bottom', 'left', 'right'].includes(side) ? side : 'bottom';
  const validAlign = ['start', 'center', 'end'].includes(align) ? align : 'center';
  return { side: validSide, align: validAlign };
}

/** 相反方向，用于翻转 */
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * @param {object} options
 * @param {import('vue').Ref<HTMLElement>} options.triggerRef 触发元素
 * @param {import('vue').Ref<HTMLElement>} options.panelRef   浮层元素
 * @param {string} [options.placement]  方向，默认 bottom-start
 * @param {number} [options.offset]     与触发元素的间距
 * @param {number} [options.viewportPadding] 视口边距
 * @param {boolean} [options.autoFlip]  空间不足时翻转
 * @param {boolean} [options.clampToViewport] 是否钳制到视口
 * @param {boolean} [options.matchTriggerWidth] 面板最小宽度对齐触发元素
 * @param {boolean} [options.closeOnOutside] 点击外部关闭
 * @param {boolean} [options.closeOnEsc]  Esc 关闭
 * @param {import('vue').Ref<boolean>} [options.disabled]
 * @param {(v:boolean)=>void} [options.onVisibleChange]
 */
export function usePopper(options = {}) {
  const {
    triggerRef,
    panelRef,
    placement = 'bottom-start',
    offset = 8,
    viewportPadding = 8,
    autoFlip = true,
    clampToViewport = true,
    matchTriggerWidth = false,
    closeOnOutside = true,
    closeOnEsc = true,
    disabled,
    onVisibleChange
  } = options;

  const visible = ref(false);
  const pos = ref({ top: 0, left: 0, actualPlacement: placement, arrowOffset: 0 });
  let ro = null;
  let outsideHandler = null;
  let escHandler = null;

  /* ---------------- 定位计算 ---------------- */
  function compute() {
    const trigger = triggerRef && triggerRef.value ? triggerRef.value : null;
    const panel = panelRef && panelRef.value ? panelRef.value : null;
    if (!trigger) return;

    const t = trigger.getBoundingClientRect();
    const pw = panel ? panel.offsetWidth : t.width;
    const ph = panel ? panel.offsetHeight : 0;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = viewportPadding;

    let { side, align } = parsePlacement(placement);

    // ---- 主轴空间判断：放不下就翻到对面 ----
    if (autoFlip) {
      if (side === 'bottom' && t.bottom + offset + ph > vh - pad) {
        const aboveSpace = t.top - offset - ph;
        if (aboveSpace > pad) side = 'top';
      } else if (side === 'top' && t.top - offset - ph < pad) {
        const belowSpace = vh - t.bottom - offset - ph;
        if (belowSpace > pad) side = 'bottom';
      } else if (side === 'right' && t.right + offset + pw > vw - pad) {
        const leftSpace = t.left - offset - pw;
        if (leftSpace > pad) side = 'left';
      } else if (side === 'left' && t.left - offset - pw < pad) {
        const rightSpace = vw - t.right - offset - pw;
        if (rightSpace > pad) side = 'right';
      }
    }

    // ---- 主轴定位 ----
    let top = 0;
    let left = 0;

    if (side === 'bottom' || side === 'top') {
      top = side === 'bottom' ? t.bottom + offset : t.top - offset - ph;

      if (align === 'start') left = t.left;
      else if (align === 'end') left = t.right - pw;
      else left = t.left + t.width / 2 - pw / 2;
    } else {
      left = side === 'right' ? t.right + offset : t.left - offset - pw;

      if (align === 'start') top = t.top;
      else if (align === 'end') top = t.bottom - ph;
      else top = t.top + t.height / 2 - ph / 2;
    }

    // ---- 交叉轴钳制 ----
    if (clampToViewport) {
      const maxLeft = Math.max(pad, vw - pw - pad);
      left = Math.min(Math.max(left, pad), maxLeft);

      const maxTop = Math.max(pad, vh - ph - pad);
      top = Math.min(Math.max(top, pad), maxTop);
    }

    // ---- 箭头偏移：钳制后要让箭头仍对准触发元素中心 ----
    let arrowOffset = 0;
    if (side === 'top' || side === 'bottom') {
      const triggerCenter = t.left + t.width / 2;
      arrowOffset = triggerCenter - left;
    } else {
      const triggerCenter = t.top + t.height / 2;
      arrowOffset = triggerCenter - top;
    }

    pos.value = {
      top: Math.round(top),
      left: Math.round(left),
      actualPlacement: `${side}-${align}`,
      arrowOffset
    };
  }

  /** 对外暴露的手动重算 */
  const update = () => {
    if (!visible.value) return;
    compute();
  };

  /* ---------------- 尺寸变化跟随 ---------------- */
  function observePanel() {
    if (typeof ResizeObserver === 'undefined') return;
    if (ro) ro.disconnect();
    const panel = panelRef && panelRef.value ? panelRef.value : null;
    if (!panel) return;

    ro = new ResizeObserver(() => {
      if (visible.value) compute();
    });
    ro.observe(panel);
  }

  /* ---------------- 全局监听 ---------------- */
  function bindGlobal() {
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    if (closeOnOutside && !outsideHandler) {
      outsideHandler = (e) => {
        const trigger = triggerRef && triggerRef.value ? triggerRef.value : null;
        const panel = panelRef && panelRef.value ? panelRef.value : null;
        if (trigger && trigger.contains(e.target)) return;
        if (panel && panel.contains(e.target)) return;
        close();
      };
      document.addEventListener('mousedown', outsideHandler, true);
    }

    if (closeOnEsc && !escHandler) {
      escHandler = (e) => {
        if (e.key === 'Escape') close();
      };
      document.addEventListener('keydown', escHandler);
    }
  }

  function unbindGlobal() {
    window.removeEventListener('scroll', update, true);
    window.removeEventListener('resize', update);

    if (outsideHandler) {
      document.removeEventListener('mousedown', outsideHandler, true);
      outsideHandler = null;
    }
    if (escHandler) {
      document.removeEventListener('keydown', escHandler);
      escHandler = null;
    }
  }

  /* ---------------- 开合 ---------------- */
  async function open() {
    if (disabled && disabled.value) return;
    if (visible.value) return;

    visible.value = true;
    // 先渲染再测量，否则拿不到面板尺寸
    await nextTick();
    compute();
    observePanel();
    bindGlobal();
    if (onVisibleChange) onVisibleChange(true);
  }

  function close() {
    if (!visible.value) return;
    visible.value = false;
    unbindGlobal();
    if (ro) {
      ro.disconnect();
      ro = null;
    }
    if (onVisibleChange) onVisibleChange(false);
  }

  function toggle() {
    return visible.value ? close() : open();
  }

  /* ---------------- 面板样式 ---------------- */
  const panelStyle = computed(() => {
    const style = {
      position: 'fixed',
      top: `${pos.value.top}px`,
      left: `${pos.value.left}px`,
      zIndex: 3000
    };
    if (matchTriggerWidth && triggerRef && triggerRef.value) {
      style.minWidth = `${triggerRef.value.getBoundingClientRect().width}px`;
    }
    return style;
  });

  /** 实际生效的方向（翻转后可能和传入的不同） */
  const actualPlacement = computed(() => pos.value.actualPlacement);

  /** 箭头相对面板的偏移量，配合 `left: ${arrowOffset}px` 使用 */
  const arrowStyle = computed(() => {
    const { side } = parsePlacement(pos.value.actualPlacement);
    if (side === 'top' || side === 'bottom') {
      return { left: `${pos.value.arrowOffset}px` };
    }
    return { top: `${pos.value.arrowOffset}px` };
  });

  /* ---------------- 清理 ---------------- */
  onBeforeUnmount(() => {
    unbindGlobal();
    if (ro) ro.disconnect();
  });

  // 外部强制关闭（如 disabled 变 true）
  if (disabled) {
    watch(disabled, (v) => {
      if (v) close();
    });
  }

  return {
    visible,
    pos,
    panelStyle,
    arrowStyle,
    actualPlacement,
    open,
    close,
    toggle,
    update
  };
}

export default usePopper;
