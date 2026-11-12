// 演示用图片：全部用内联 SVG data URI 生成，不依赖任何外部资源
const makeImage = (title, bg1, bg2, accent) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg1}"/>
        <stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="520" fill="url(#g)"/>
    <circle cx="646" cy="118" r="76" fill="${accent}" opacity="0.55"/>
    <circle cx="120" cy="410" r="46" fill="${accent}" opacity="0.32"/>
    <path d="M0 400 Q200 320 400 392 T800 356 V520 H0Z" fill="${accent}" opacity="0.22"/>
    <text x="56" y="252" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${title}</text>
    <text x="58" y="292" font-family="system-ui, sans-serif" font-size="17" fill="#ffffff" opacity="0.82">PenguinUI ImageViewer · 800 × 520</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const demoImages = [
  { src: makeImage('组件总览', '#0e80eb', '#0a68c4', '#7cc4ff'), alt: '组件总览', caption: '滚动缩放 / 拖拽平移 / 方向键切换' },
  { src: makeImage('设计令牌', '#13a065', '#0b7d4c', '#8ce8b8'), alt: '设计令牌', caption: '圆角、间距、语义色统一由 CSS 变量下发' },
  { src: makeImage('主题切换', '#6d3bd1', '#4b23a0', '#c3a6ff'), alt: '主题切换', caption: '明暗双主题，同一套令牌两套取值' },
  { src: makeImage('数据可视化', '#c85a12', '#9c430b', '#ffc48c'), alt: '数据可视化', caption: '表格、统计、进度等数据类组件' }
];

export default demoImages;
