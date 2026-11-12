/**
 * 用内联 SVG 生成示例图，避免依赖外网图片
 */
const svg = (c1, c2, label) => {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="640" cy="120" r="150" fill="rgba(255,255,255,0.12)"/>
  <circle cx="120" cy="420" r="200" fill="rgba(255,255,255,0.08)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="-apple-system, PingFang SC, Microsoft YaHei, sans-serif"
        font-size="72" font-weight="700" fill="rgba(255,255,255,0.92)">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}`;
};

export const pic1 = svg('#0e80eb', '#0a4fa8', '01');
export const pic2 = svg('#6d3bd1', '#3b1d80', '02');
export const pic3 = svg('#0f9d6e', '#08663f', '03');
export const picList = [pic1, pic2, pic3];
