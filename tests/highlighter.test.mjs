/**
 * 代码高亮器单元测试
 * 重点验证：不产生非法 HTML、标签闭合平衡、行数一致
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { highlight, highlightLines, normalizeLang } from '../packages/codeBlock/highlighter.js';

const CASES = [
  {
    lang: 'js',
    code: `// 注释里有 "引号" 不能误判
const re = /abc/g;
function greet(name) {
  const msg = \`Hello \${name}\`;
  return msg + 42;
}`
  },
  {
    lang: 'vue',
    code: `<template>
  <div class="box" :id="1">
    <!-- 这是注释 -->
    <t-button type="primary">提交</t-button>
  </div>
</template>`
  },
  {
    lang: 'ts',
    code: `interface User {
  id: number;
  name?: string;
}
export const pick = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];`
  },
  {
    lang: 'bash',
    code: `# 安装依赖
npm install penguinui --save
npm run build`
  },
  {
    lang: 'css',
    code: `.box {
  color: #0e80eb;
  margin: 0 auto;
}`
  },
  {
    lang: 'json',
    code: `{
  "name": "penguinui",
  "version": "1.19.0"
}`
  },
  {
    lang: 'python',
    code: `def hello():\n    print("hi")  # 未知语言只转义`
  }
];

describe('normalizeLang', () => {
  it('别名映射', () => {
    assert.equal(normalizeLang('javascript'), 'js');
    assert.equal(normalizeLang('typescript'), 'ts');
    assert.equal(normalizeLang('vue'), 'html');
    assert.equal(normalizeLang('scss'), 'css');
    assert.equal(normalizeLang('sh'), 'bash');
  });

  it('未知语言原样返回', () => {
    assert.equal(normalizeLang('python'), 'python');
  });

  it('大小写不敏感', () => {
    assert.equal(normalizeLang('JavaScript'), 'js');
  });
});

describe('highlight 输出合法性', () => {
  CASES.forEach(({ lang, code }) => {
    describe(lang, () => {
      it('span 标签开闭平衡', () => {
        const html = highlight(code, lang);
        const opens = (html.match(/<span/g) || []).length;
        const closes = (html.match(/<\/span>/g) || []).length;
        assert.equal(opens, closes);
      });

      it('不产生未转义的裸标签', () => {
        const html = highlight(code, lang);
        // 去掉我们自己生成的 span 后，不应残留 < 或 >
        const stripped = html.replace(/<\/?span[^>]*>/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '');
        assert.ok(!/[<>]/.test(stripped));
      });

      it('行数与原文一致', () => {
        const lines = highlightLines(code, lang);
        assert.equal(lines.length, code.split('\n').length);
      });

      it('逐行标签平衡', () => {
        const lines = highlightLines(code, lang);
        lines.forEach((line) => {
          const opens = (line.match(/<span/g) || []).length;
          const closes = (line.match(/<\/span>/g) || []).length;
          assert.equal(opens, closes, `行内容：${line}`);
        });
      });
    });
  });
});

describe('highlight 染色正确性', () => {
  it('JS 关键字染色', () => {
    const html = highlight('function foo() {}', 'js');
    assert.ok(html.includes('pui-code__keyword'));
  });

  it('JS 字符串染色', () => {
    const html = highlight(`const a = 'hello'`, 'js');
    assert.ok(html.includes('pui-code__string'));
  });

  it('JS 注释染色', () => {
    const html = highlight('// hi', 'js');
    assert.ok(html.includes('pui-code__comment'));
  });

  it('JS 数字染色', () => {
    const html = highlight('const a = 42', 'js');
    assert.ok(html.includes('pui-code__number'));
  });

  it('JS 函数名染色', () => {
    const html = highlight('greet()', 'js');
    assert.ok(html.includes('pui-code__function'));
  });

  it('HTML 标签染色', () => {
    const html = highlight('<div class="a"></div>', 'vue');
    assert.ok(html.includes('pui-code__tag'));
  });

  it('未知语言不染色', () => {
    const html = highlight('def foo(): pass', 'python');
    assert.ok(!html.includes('pui-code__keyword'));
  });
});

describe('highlight 安全性', () => {
  it('转义 HTML 特殊字符', () => {
    const html = highlight('<script>alert(1)</script>', 'js');
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;'));
  });

  it('转义引号', () => {
    const html = highlight('const a = "x"', 'js');
    // 原文的引号在字符串 token 内，应被转义为 &quot;
    assert.ok(html.includes('&quot;'));
  });

  it('注释里的标签也被转义', () => {
    const html = highlight('// <b>bold</b>', 'js');
    assert.ok(!html.includes('<b>'));
  });
});

describe('highlight 边界情况', () => {
  it('空字符串', () => {
    assert.equal(highlight('', 'js'), '');
  });

  it('只有空白', () => {
    assert.doesNotThrow(() => highlight('   \n  ', 'js'));
  });

  it('未闭合字符串不崩', () => {
    assert.doesNotThrow(() => highlight(`const a = 'unclosed`, 'js'));
  });

  it('未闭合多行注释不崩', () => {
    assert.doesNotThrow(() => highlight('/* unclosed', 'js'));
  });

  it('null / undefined 不崩', () => {
    assert.doesNotThrow(() => highlight(null, 'js'));
    assert.doesNotThrow(() => highlight(undefined, 'js'));
  });
});
