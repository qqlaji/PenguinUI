/**
 * Markdown 渲染器单元测试
 * 重点：正确性 + XSS 安全
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, stripMarkdown, escapeHtml } from '../packages/chat/markdown.js';

describe('escapeHtml', () => {
  it('转义所有特殊字符', () => {
    assert.equal(
      escapeHtml(`<div class="a">'x' & y</div>`),
      '&lt;div class=&quot;a&quot;&gt;&#39;x&#39; &amp; y&lt;/div&gt;'
    );
  });

  it('处理 null / undefined', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
  });
});

describe('标题', () => {
  it('h1 ~ h6', () => {
    assert.ok(renderMarkdown('# 标题').includes('<h1 class="pui-md__h1">标题</h1>'));
    assert.ok(renderMarkdown('### 三级').includes('<h3 class="pui-md__h3">三级</h3>'));
    assert.ok(renderMarkdown('###### 六级').includes('<h6'));
  });

  it('标题内的行内代码', () => {
    const html = renderMarkdown('## 使用 `npm` 安装');
    assert.ok(html.includes('<code class="pui-md__code-inline">npm</code>'));
  });
});

describe('段落与强调', () => {
  it('独立段落', () => {
    assert.ok(renderMarkdown('一段文字').includes('<p class="pui-md__p">一段文字</p>'));
  });

  it('多行合并为一个段落', () => {
    const html = renderMarkdown('第一行\n第二行');
    assert.equal((html.match(/<p class="pui-md__p">/g) || []).length, 1);
    assert.ok(html.includes('第一行 第二行'));
  });

  it('空行分隔成两个段落', () => {
    const html = renderMarkdown('A\n\nB');
    assert.equal((html.match(/<p class="pui-md__p">/g) || []).length, 2);
  });

  it('加粗 / 斜体 / 删除线', () => {
    assert.ok(renderMarkdown('**粗**').includes('<strong>粗</strong>'));
    assert.ok(renderMarkdown('*斜*').includes('<em>斜</em>'));
    assert.ok(renderMarkdown('~~删~~').includes('<del>删</del>'));
  });

  it('加粗内的斜体不误判', () => {
    const html = renderMarkdown('**a** 和 *b*');
    assert.ok(html.includes('<strong>a</strong>'));
    assert.ok(html.includes('<em>b</em>'));
  });
});

describe('行内代码', () => {
  it('代码内的 Markdown 不被解析', () => {
    const html = renderMarkdown('`**不该加粗**`');
    assert.ok(html.includes('**不该加粗**'));
    assert.ok(!html.includes('<strong>'));
  });

  it('代码内容被转义', () => {
    const html = renderMarkdown('`<script>`');
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;script&gt;'));
  });
});

describe('代码块', () => {
  it('保留语言标签与原始内容', () => {
    const html = renderMarkdown('```js\nconst a = 1;\n```');
    assert.ok(html.includes('pui-md__pre-lang'));
    assert.ok(html.includes('>js<'));
    assert.ok(html.includes('const a = 1;'));
  });

  it('代码块内的特殊字符被转义', () => {
    const html = renderMarkdown('```html\n<div class="x"></div>\n```');
    assert.ok(!html.includes('<div class="x">'));
    assert.ok(html.includes('&lt;div'));
  });

  it('多行代码完整保留', () => {
    const html = renderMarkdown('```\na\nb\nc\n```');
    assert.ok(html.includes('a\nb\nc'));
  });

  it('未闭合代码块不崩', () => {
    assert.doesNotThrow(() => renderMarkdown('```js\nconst a = 1;'));
  });
});

describe('列表', () => {
  it('无序列表', () => {
    const html = renderMarkdown('- A\n- B');
    assert.equal((html.match(/<ul class="pui-md__ul">/g) || []).length, 1);
    assert.equal((html.match(/<li class="pui-md__li">/g) || []).length, 2);
    assert.ok(html.includes('</ul>'));
  });

  it('有序列表', () => {
    const html = renderMarkdown('1. 第一\n2. 第二');
    assert.ok(html.includes('<ol class="pui-md__ol">'));
    assert.equal((html.match(/<li/g) || []).length, 2);
  });

  it('任务列表', () => {
    const html = renderMarkdown('- [x] 已完成\n- [ ] 未完成');
    assert.ok(html.includes('is-checked'));
    assert.equal((html.match(/pui-md__li--task/g) || []).length, 2);
  });

  it('列表项内的强调生效', () => {
    const html = renderMarkdown('- **重点**');
    assert.ok(html.includes('<strong>重点</strong>'));
  });
});

describe('表格', () => {
  it('渲染表头与数据行', () => {
    const html = renderMarkdown('| A | B |\n| --- | --- |\n| 1 | 2 |');
    assert.ok(html.includes('<table class="pui-md__table">'));
    assert.ok(html.includes('<th>A</th>'));
    assert.ok(html.includes('<td>1</td>'));
  });

  it('对齐方式', () => {
    const html = renderMarkdown('| L | C | R |\n| :-- | :-: | --: |\n| a | b | c |');
    assert.ok(html.includes('text-align:left'));
    assert.ok(html.includes('text-align:center'));
    assert.ok(html.includes('text-align:right'));
  });

  it('表格单元格内的行内语法', () => {
    const html = renderMarkdown('| A |\n| --- |\n| **粗** |');
    assert.ok(html.includes('<strong>粗</strong>'));
  });
});

describe('链接与图片', () => {
  it('正常链接带安全属性', () => {
    const html = renderMarkdown('[文档](https://example.com)');
    assert.ok(html.includes('href="https://example.com"'));
    assert.ok(html.includes('rel="noopener noreferrer"'));
    assert.ok(html.includes('target="_blank"'));
  });

  it('图片渲染', () => {
    const html = renderMarkdown('![图](https://example.com/a.png)');
    assert.ok(html.includes('<img'));
    assert.ok(html.includes('loading="lazy"'));
  });
});

describe('引用与分割线', () => {
  it('引用块', () => {
    const html = renderMarkdown('> 引用内容');
    assert.ok(html.includes('<blockquote class="pui-md__quote">引用内容</blockquote>'));
  });

  it('分割线', () => {
    assert.ok(renderMarkdown('---').includes('<hr class="pui-md__hr" />'));
    assert.ok(renderMarkdown('***').includes('<hr'));
  });
});

describe('XSS 安全', () => {
  it('原始 script 标签被转义', () => {
    const html = renderMarkdown('<script>alert(1)</script>');
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;script&gt;'));
  });

  it('img onerror 被转义', () => {
    const html = renderMarkdown('<img src=x onerror="alert(1)">');
    assert.ok(!html.includes('onerror="alert'));
    assert.ok(html.includes('&lt;img'));
  });

  it('javascript: 链接被拒绝', () => {
    const html = renderMarkdown('[点我](javascript:alert(1))');
    assert.ok(!html.includes('href="javascript'));
  });

  it('data: 非图片协议被拒绝', () => {
    const html = renderMarkdown('[x](data:text/html;base64,xxx)');
    assert.ok(!html.includes('href="data:text'));
  });

  it('markdown 链接里的引号不会突破属性', () => {
    const html = renderMarkdown('[a](https://x.com/"onmouseover="alert(1))');
    assert.ok(!html.includes('onmouseover="alert'));
  });

  it('HTML 实体注入被正确处理', () => {
    const html = renderMarkdown('&lt;script&gt;');
    // 原文的 & 会被再次转义，最终显示为字面量而不是执行
    assert.ok(!html.includes('<script>'));
  });

  it('MDX 组件标签不会执行', () => {
    const html = renderMarkdown('<MyComponent prop={1} />');
    assert.ok(!html.includes('<MyComponent'));
  });

  it('allowHtml 开启时放行标签', () => {
    const html = renderMarkdown('<b>粗</b>', { allowHtml: true });
    assert.ok(html.includes('<b>粗</b>'));
  });
});

describe('MDX 兼容', () => {
  it('MDX 文本按 Markdown 渲染不报错', () => {
    const mdx = '# 标题\n\n这是一段 **MDX** 文本，含 `<Code />` 标签。\n\n```jsx\n<Button />\n```';
    assert.doesNotThrow(() => renderMarkdown(mdx));
    const html = renderMarkdown(mdx);
    assert.ok(html.includes('<strong>MDX</strong>'));
    assert.ok(html.includes('&lt;Button /&gt;'));
  });

  it('JSX 表达式被当纯文本', () => {
    const html = renderMarkdown('值：{count}');
    assert.ok(html.includes('{count}'));
  });
});

describe('边界情况', () => {
  it('空字符串', () => {
    assert.equal(renderMarkdown(''), '');
  });

  it('null / undefined', () => {
    assert.equal(renderMarkdown(null), '');
    assert.equal(renderMarkdown(undefined), '');
  });

  it('纯空白', () => {
    assert.equal(renderMarkdown('   \n\n  '), '');
  });

  it('只有换行', () => {
    assert.equal(renderMarkdown('\n\n\n'), '');
  });

  it('Windows 换行符', () => {
    const html = renderMarkdown('# A\r\n\r\n正文');
    assert.ok(html.includes('<h1'));
    assert.ok(html.includes('正文'));
  });

  it('标签开闭平衡（复杂文档）', () => {
    const md = `# 标题

段落 **粗** 与 *斜*。

- 列表 A
- 列表 B

| X | Y |
| --- | --- |
| 1 | 2 |

\`\`\`js
const a = 1;
\`\`\`

> 引用`;
    const html = renderMarkdown(md);
    ['p', 'ul', 'li', 'table', 'thead', 'tbody', 'tr', 'div', 'blockquote'].forEach((tag) => {
      const opens = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
      const closes = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
      assert.equal(opens, closes, `<${tag}> 不平衡：${opens} vs ${closes}`);
    });
  });
});

describe('stripMarkdown', () => {
  it('去掉标记保留文字', () => {
    const text = stripMarkdown('# 标题\n\n**粗体** 和 `代码`\n\n```js\ncode\n```');
    assert.ok(!text.includes('#'));
    assert.ok(!text.includes('**'));
    assert.ok(!text.includes('```'));
    assert.ok(text.includes('标题'));
    assert.ok(text.includes('粗体'));
  });

  it('去掉链接保留文字', () => {
    const text = stripMarkdown('[文档](https://x.com)');
    assert.equal(text, '文档');
  });

  it('空输入', () => {
    assert.equal(stripMarkdown(''), '');
    assert.equal(stripMarkdown(null), '');
  });
});
