/**
 * usePopper 定位算法单元测试
 *
 * 用假的 getBoundingClientRect 模拟 DOM，只测纯计算部分。
 * 注意：usePopper 内部调用了 onBeforeUnmount，脱离组件实例会有 Vue 警告，
 * 这里通过屏蔽 console.warn 保持输出干净。
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ref, nextTick } from 'vue';
import { usePopper } from '../packages/use/usePopper.js';

const VW = 1200;
const VH = 800;

let origWarn;

before(() => {
  // 环境替身
  globalThis.window = {
    innerWidth: VW,
    innerHeight: VH,
    addEventListener() {},
    removeEventListener() {},
    scrollY: 0,
    scrollTo() {}
  };
  globalThis.document = {
    addEventListener() {},
    removeEventListener() {}
  };
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  // onBeforeUnmount 在无组件实例时会产生 Vue 警告，静音掉
  origWarn = console.warn;
  console.warn = () => {};
});

after(() => {
  console.warn = origWarn;
});

/** 构造一个假的元素：给定矩形和尺寸 */
function mkEl(top, left, w, h) {
  return {
    getBoundingClientRect: () => ({
      top,
      left,
      bottom: top + h,
      right: left + w,
      width: w,
      height: h,
      x: left,
      y: top
    }),
    offsetWidth: w,
    offsetHeight: h,
    contains: () => false
  };
}

async function setup(opts) {
  const triggerRef = ref(mkEl(opts.trigger.top, opts.trigger.left, opts.trigger.w, opts.trigger.h));
  const panelRef = ref(mkEl(0, 0, opts.panel.w, opts.panel.h));
  const popper = usePopper({ triggerRef, panelRef, ...opts.popper });
  await popper.open();
  await nextTick();
  return popper;
}

describe('usePopper 基础方向', () => {
  it('bottom-start：贴在触发元素下方并左对齐', async () => {
    const p = await setup({
      trigger: { top: 100, left: 200, w: 120, h: 32 },
      panel: { w: 180, h: 200 },
      popper: { placement: 'bottom-start', offset: 8 }
    });
    assert.equal(p.pos.value.top, 140); // 100 + 32 + 8
    assert.equal(p.pos.value.left, 200);
    assert.equal(p.pos.value.actualPlacement, 'bottom-start');
  });

  it('bottom center：水平居中', async () => {
    const p = await setup({
      trigger: { top: 100, left: 300, w: 100, h: 32 },
      panel: { w: 200, h: 200 },
      popper: { placement: 'bottom', offset: 8 }
    });
    // left = 300 + 100/2 - 200/2 = 250
    assert.equal(p.pos.value.left, 250);
  });

  it('bottom-end：右对齐', async () => {
    const p = await setup({
      trigger: { top: 100, left: 300, w: 100, h: 32 },
      panel: { w: 200, h: 200 },
      popper: { placement: 'bottom-end', offset: 8 }
    });
    // right(400) - 200 = 200
    assert.equal(p.pos.value.left, 200);
  });

  it('top：显示在触发元素上方', async () => {
    const p = await setup({
      trigger: { top: 400, left: 300, w: 100, h: 30 },
      panel: { w: 160, h: 120 },
      popper: { placement: 'top', offset: 6 }
    });
    assert.equal(p.pos.value.top, 274); // 400 - 6 - 120
  });

  it('right-start', async () => {
    const p = await setup({
      trigger: { top: 300, left: 600, w: 100, h: 30 },
      panel: { w: 200, h: 100 },
      popper: { placement: 'right-start', offset: 10 }
    });
    assert.equal(p.pos.value.left, 710); // 700 + 10
    assert.equal(p.pos.value.top, 300);
  });

  it('left-start', async () => {
    const p = await setup({
      trigger: { top: 300, left: 600, w: 100, h: 30 },
      panel: { w: 200, h: 100 },
      popper: { placement: 'left-start', offset: 10 }
    });
    assert.equal(p.pos.value.left, 390); // 600 - 10 - 200
  });
});

describe('usePopper 翻转', () => {
  it('下方空间不足自动翻到上方', async () => {
    const p = await setup({
      trigger: { top: 700, left: 200, w: 120, h: 32 },
      panel: { w: 180, h: 200 },
      popper: { placement: 'bottom-start', offset: 8 }
    });
    assert.ok(p.pos.value.actualPlacement.startsWith('top'));
    assert.equal(p.pos.value.top, 492); // 700 - 8 - 200
  });

  it('autoFlip=false 时不翻转', async () => {
    const p = await setup({
      trigger: { top: 700, left: 200, w: 120, h: 32 },
      panel: { w: 180, h: 200 },
      popper: { placement: 'bottom-start', offset: 8, autoFlip: false }
    });
    assert.ok(p.pos.value.actualPlacement.startsWith('bottom'));
  });

  it('上方也放不下时保持在更优的一侧', async () => {
    // 视口只有 800，触发器在 400，面板 600 高：上下都放不下
    const p = await setup({
      trigger: { top: 400, left: 200, w: 100, h: 30 },
      panel: { w: 200, h: 600 },
      popper: { placement: 'bottom-start', offset: 8 }
    });
    // 应被钳制在视口内，不出现负值
    assert.ok(p.pos.value.top >= 8);
    assert.ok(p.pos.value.top + 600 <= VH + 1);
  });
});

describe('usePopper 视口钳制', () => {
  it('右侧超出时向左收', async () => {
    const p = await setup({
      trigger: { top: 100, left: 1150, w: 40, h: 32 },
      panel: { w: 300, h: 200 },
      popper: { placement: 'bottom-start', offset: 8, viewportPadding: 8 }
    });
    assert.equal(p.pos.value.left, VW - 300 - 8); // 892
  });

  it('clampToViewport=false 时允许出界', async () => {
    const p = await setup({
      trigger: { top: 100, left: 1150, w: 40, h: 32 },
      panel: { w: 300, h: 200 },
      popper: { placement: 'bottom-start', offset: 8, clampToViewport: false }
    });
    assert.equal(p.pos.value.left, 1150);
  });

  it('垂直方向也钳制', async () => {
    const p = await setup({
      trigger: { top: 10, left: 300, w: 100, h: 30 },
      panel: { w: 200, h: 600 },
      popper: { placement: 'bottom-start', offset: 8, viewportPadding: 8 }
    });
    assert.ok(p.pos.value.top <= VH - 600 - 8);
  });
});

describe('usePopper 箭头偏移', () => {
  it('箭头对准触发元素中心', async () => {
    const p = await setup({
      trigger: { top: 100, left: 500, w: 100, h: 32 },
      panel: { w: 300, h: 200 },
      popper: { placement: 'bottom-start', offset: 8 }
    });
    // 触发中心 550，面板左 500 → 箭头 50
    assert.equal(p.pos.value.arrowOffset, 50);
    assert.equal(p.arrowStyle.value.left, '50px');
  });
});

describe('usePopper 样式输出', () => {
  it('面板使用 fixed 定位', async () => {
    const p = await setup({
      trigger: { top: 100, left: 200, w: 120, h: 32 },
      panel: { w: 180, h: 200 },
      popper: { placement: 'bottom-start', offset: 8 }
    });
    assert.equal(p.panelStyle.value.position, 'fixed');
    assert.equal(p.panelStyle.value.top, '140px');
    assert.equal(p.panelStyle.value.left, '200px');
  });

  it('matchTriggerWidth 生效', async () => {
    const p = await setup({
      trigger: { top: 100, left: 200, w: 240, h: 32 },
      panel: { w: 180, h: 200 },
      popper: { placement: 'bottom-start', offset: 8, matchTriggerWidth: true }
    });
    assert.equal(p.panelStyle.value.minWidth, '240px');
  });
});

describe('usePopper 开合状态', () => {
  it('open / close 切换 visible', async () => {
    const p = await setup({
      trigger: { top: 100, left: 200, w: 120, h: 32 },
      panel: { w: 180, h: 200 },
      popper: { placement: 'bottom-start' }
    });
    assert.equal(p.visible.value, true);

    p.close();
    assert.equal(p.visible.value, false);
  });

  it('onVisibleChange 回调', async () => {
    const calls = [];
    const triggerRef = ref(mkEl(100, 200, 120, 32));
    const panelRef = ref(mkEl(0, 0, 180, 200));
    const p = usePopper({
      triggerRef,
      panelRef,
      onVisibleChange: (v) => calls.push(v)
    });
    await p.open();
    p.close();
    assert.deepEqual(calls, [true, false]);
  });

  it('disabled 时 open 不生效', async () => {
    const disabled = ref(true);
    const triggerRef = ref(mkEl(100, 200, 120, 32));
    const panelRef = ref(mkEl(0, 0, 180, 200));
    const p = usePopper({ triggerRef, panelRef, disabled });
    await p.open();
    assert.equal(p.visible.value, false);
  });
});
