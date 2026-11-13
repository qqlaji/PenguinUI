/**
 * 轻量 Markdown 渲染器
 * ---------------------------------------------------------------------------
 * Chat 组件需要渲染 AI 回复里的 Markdown（标题、列表、表格、代码块、行内代码、
 * 加粗/斜体/删除线、链接、引用、分割线）。
 *
 * 为什么不引第三方库：
 *   组件库到目前为止是零运行时依赖，为了一个 Markdown 引入 markdown-it + 插件
 *   会把包体积翻倍。这里实现够用的子集，并且**默认转义 HTML**，
 *   只有显式开启 allowHtml 才放行原始标签，避免 XSS。
 *
 * MDX：不解析 JSX（需要完整解析器）。传 MDX 时按 Markdown 渲染，
 * 形如 <Component /> 的孤立标签会被转义成纯文本，不会报错。
 */

/** HTML 转义 */
export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 行内语法：代码 → 图片 → 链接 → 强调 → 删除线
 *
 * 约定：传入的是**原始文本**，本函数内部统一做 HTML 转义，
 * 调用方不要再转义一次（否则会出现 &amp;lt; 这种双重转义）。
 */
function inline(text) {
  let s = String(text ?? '');

  // ---- 1. 行内代码最先摘出并转义，避免里面的符号被当成语法 ----
  const codes = [];
  s = s.replace(/`([^`\n]+)`/g, (_, code) => {
    codes.push(`<code class="pui-md__code-inline">${escapeHtml(code)}</code>`);
    return `\u0000CODE${codes.length - 1}\u0000`;
  });

  // ---- 2. 图片与链接：先按原始文本解析出 URL，做协议白名单校验 ----
  const links = [];
  const stash = (html) => {
    links.push(html);
    return `\u0000LINK${links.length - 1}\u0000`;
  };

  // 图片 ![alt](src)
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) => {
    // 只放行 http/https/data:image 与相对路径，挡掉 javascript: 等
    if (!/^(https?:|data:image\/|\/|\.\/|\.\.\/)/i.test(src)) return alt;
    const t = title ? ` title="${escapeHtml(title)}"` : '';
    return stash(
      `<img class="pui-md__img" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${t} loading="lazy" />`
    );
  });

  // 链接 [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, label, href, title) => {
    if (!/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(href)) return label;
    const t = title ? ` title="${escapeHtml(title)}"` : '';
    return stash(
      `<a class="pui-md__link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"${t}>${inline(label)}</a>`
    );
  });

  // ---- 3. 其余文本统一转义（此时代码/链接已换成占位符，不会被转义破坏）----
  s = escapeHtml(s);

  // ---- 4. 强调 ----
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');

  // ---- 5. 还原占位符 ----
  s = s.replace(/\u0000LINK(\d+)\u0000/g, (_, i) => links[Number(i)]);
  s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codes[Number(i)]);

  return s;
}

/** 代码块：带语言标签 */
function renderCodeBlock(lang, code) {
  const safeLang = escapeHtml(lang || 'text');
  return (
    `<div class="pui-md__pre-wrap">` +
    `<div class="pui-md__pre-head"><span class="pui-md__pre-lang">${safeLang}</span></div>` +
    `<pre class="pui-md__pre"><code>${escapeHtml(code)}</code></pre>` +
    `</div>`
  );
}

/** 表格 */
function renderTable(lines) {
  const rows = lines.map((l) =>
    l
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())
  );

  if (rows.length < 2) return '';

  const header = rows[0];
  // 第二行是分隔行（---），跳过后作为对齐依据
  const aligns = rows[1].map((c) => {
    const left = c.startsWith(':');
    const right = c.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    if (left) return 'left';
    return '';
  });

  const body = rows.slice(2);

  const th = header
    .map((c, i) => {
      const a = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
      return `<th${a}>${inline(c)}</th>`;
    })
    .join('');

  const tb = body
    .map((r) => {
      const tds = header
        .map((_, i) => {
          const a = aligns[i] ? ` style="text-align:${aligns[i]}"` : '';
          return `<td${a}>${inline(r[i] ?? '')}</td>`;
        })
        .join('');
      return `<tr>${tds}</tr>`;
    })
    .join('');

  return `<div class="pui-md__table-wrap"><table class="pui-md__table"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`;
}

/**
 * 主渲染函数
 * @param {string} markdown
 * @param {object} [options]
 * @param {boolean} [options.allowHtml=false] 是否放行原始 HTML
 * @returns {string} HTML 字符串
 */
export function renderMarkdown(markdown, options = {}) {
  const { allowHtml = false } = options;
  const src = String(markdown ?? '').replace(/\r\n?/g, '\n');

  if (!src.trim()) return '';

  const lines = src.split('\n');
  const out = [];

  let i = 0;
  let listStack = []; // [{ type: 'ul'|'ol', indent }]

  const closeLists = (toIndent = -1) => {
    while (listStack.length && listStack[listStack.length - 1].indent > toIndent) {
      out.push(listStack.pop().type === 'ol' ? '</ol>' : '</ul>');
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    /* ---------- 围栏代码块 ---------- */
    const fence = line.match(/^\s*```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || '';
      const buf = [];
      i += 1;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // 跳过结束围栏
      closeLists();
      out.push(renderCodeBlock(lang, buf.join('\n')));
      continue;
    }

    /* ---------- 空行 ---------- */
    if (!line.trim()) {
      closeLists();
      i += 1;
      continue;
    }

    /* ---------- 分割线 ---------- */
    if (/^\s*([-*_])\s*\1\s*\1[\s\S]*$/.test(line) && line.replace(/[\s\-*_]/g, '') === '') {
      closeLists();
      out.push('<hr class="pui-md__hr" />');
      i += 1;
      continue;
    }

    /* ---------- 标题 ---------- */
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeLists();
      const level = heading[1].length;
      out.push(`<h${level} class="pui-md__h${level}">${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    /* ---------- 引用 ---------- */
    if (/^\s*>\s?/.test(line)) {
      closeLists();
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote class="pui-md__quote">${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    /* ---------- 表格（当前行与下一行都含 |） ---------- */
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:-]+\|[\s:|-]*$/.test(lines[i + 1])
    ) {
      closeLists();
      const buf = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        buf.push(lines[i]);
        i += 1;
      }
      out.push(renderTable(buf));
      continue;
    }

    /* ---------- 列表 ---------- */
    const listItem = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (listItem) {
      const indent = listItem[1].length;
      const isOrdered = /\d/.test(listItem[2]);
      const type = isOrdered ? 'ol' : 'ul';
      const content = listItem[3];

      // 处理层级
      closeLists(indent);
      const top = listStack[listStack.length - 1];
      if (!top || top.indent < indent) {
        listStack.push({ type, indent });
        out.push(type === 'ol' ? '<ol class="pui-md__ol">' : '<ul class="pui-md__ul">');
      }

      // 任务列表 - [ ] / - [x]
      const task = content.match(/^\[([ xX])\]\s+(.*)$/);
      if (task) {
        const checked = task[1].toLowerCase() === 'x';
        out.push(
          `<li class="pui-md__li pui-md__li--task">` +
            `<span class="pui-md__task ${checked ? 'is-checked' : ''}" aria-hidden="true">` +
            (checked
              ? '<svg viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
              : '') +
            `</span>` +
            `<span>${inline(task[2])}</span></li>`
        );
      } else {
        out.push(`<li class="pui-md__li">${inline(content)}</li>`);
      }

      i += 1;
      continue;
    }

    /* ---------- 段落 ---------- */
    closeLists();
    const buf = [line];
    i += 1;
    // 连续的普通行合并为一个段落
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*```/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*>/.test(lines[i]) &&
      !/^(\s*)([-*+]|\d+[.)])\s+/.test(lines[i]) &&
      !lines[i].includes('|')
    ) {
      buf.push(lines[i]);
      i += 1;
    }

    const text = buf.join(' ');
    /*
     * inline() 内部已做 HTML 转义，默认策略始终安全。
     * allowHtml 时只额外放行段落里的原始标签，行内语法仍按 Markdown 解析。
     */
    out.push(
      allowHtml
        ? `<p class="pui-md__p">${inline(text).replace(/&lt;(\/?[a-z][\w-]*)([^&]*?)&gt;/gi, '<$1$2>')}</p>`
        : `<p class="pui-md__p">${inline(text)}</p>`
    );
  }

  closeLists();
  return out.join('\n');
}

/** 去掉 Markdown 标记，用于摘要 / 标题 */
export function stripMarkdown(markdown) {
  return String(markdown ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export default renderMarkdown;
