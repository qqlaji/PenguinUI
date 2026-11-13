/**
 * 表单校验器单元测试
 * 运行：npm test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runRules, rulePresets } from '../packages/form/validate.js';

describe('runRules 基础', () => {
  it('必填为空时报错', async () => {
    const errs = await runRules('', [{ required: true }]);
    assert.equal(errs.length, 1);
    assert.equal(errs[0], '该项为必填项');
  });

  it('必填有值不报错', async () => {
    assert.deepEqual(await runRules('x', [{ required: true }]), []);
  });

  it('0 与 false 不算空值', async () => {
    assert.deepEqual(await runRules(0, [{ required: true }]), []);
    assert.deepEqual(await runRules(false, [{ required: true }]), []);
  });

  it('空数组算空值', async () => {
    assert.equal((await runRules([], [{ required: true }])).length, 1);
  });

  it('纯空格算空值', async () => {
    assert.equal((await runRules('   ', [{ required: true }])).length, 1);
  });

  it('自定义 message 生效', async () => {
    const errs = await runRules('', [{ required: true, message: '请填写姓名' }]);
    assert.equal(errs[0], '请填写姓名');
  });
});

describe('runRules 类型校验', () => {
  it('email 正确 / 错误', async () => {
    assert.deepEqual(await runRules('a@b.co', [{ type: 'email' }]), []);
    assert.equal((await runRules('not-mail', [{ type: 'email' }])).length, 1);
  });

  it('url 正确 / 错误', async () => {
    assert.deepEqual(await runRules('https://x.com/a', [{ type: 'url' }]), []);
    assert.equal((await runRules('x.com', [{ type: 'url' }])).length, 1);
  });

  it('integer 拒绝小数', async () => {
    assert.deepEqual(await runRules(5, [{ type: 'integer' }]), []);
    assert.equal((await runRules(5.5, [{ type: 'integer' }])).length, 1);
  });

  it('number 拒绝字符串数字', async () => {
    assert.equal((await runRules('5', [{ type: 'number' }])).length, 1);
  });

  it('类型不符时不再跑 min/max', async () => {
    // 只应报「不是数字」一条，不应再报「不能小于 1」
    const errs = await runRules('abc', [{ type: 'number', min: 1 }]);
    assert.equal(errs.length, 1);
  });
});

describe('runRules 长度与值域', () => {
  it('字符串 min / max', async () => {
    assert.equal((await runRules('ab', [{ min: 3 }])).length, 1);
    assert.equal((await runRules('abcd', [{ max: 3 }])).length, 1);
  });

  it('数组按长度校验', async () => {
    assert.equal((await runRules([1], [{ min: 2 }])).length, 1);
  });

  it('len 精确长度', async () => {
    assert.deepEqual(await runRules('abc', [{ len: 3 }]), []);
    assert.equal((await runRules('ab', [{ len: 3 }])).length, 1);
  });

  it('数字值域', async () => {
    assert.equal((await runRules(1, [{ type: 'number', min: 5 }])).length, 1);
    assert.equal((await runRules(10, [{ type: 'number', max: 5 }])).length, 1);
    assert.deepEqual(await runRules(5, [{ type: 'number', min: 1, max: 10 }]), []);
  });

  it('label 参与报错文案', async () => {
    const errs = await runRules(1, [{ type: 'number', min: 5, label: '年龄' }]);
    assert.ok(errs[0].includes('年龄'));
  });
});

describe('runRules pattern / enum / transform', () => {
  it('pattern 正向与反向', async () => {
    const re = /^1[3-9]\d{9}$/;
    assert.deepEqual(await runRules('13800138000', [{ pattern: re }]), []);
    assert.equal((await runRules('123', [{ pattern: re }])).length, 1);
  });

  it('枚举白名单', async () => {
    assert.deepEqual(await runRules('b', [{ enum: ['a', 'b'] }]), []);
    assert.equal((await runRules('c', [{ enum: ['a', 'b'] }])).length, 1);
  });

  it('transform 先 trim 再判空', async () => {
    const errs = await runRules('  ', [
      { transform: (v) => String(v).trim(), required: true }
    ]);
    assert.equal(errs.length, 1);
  });

  it('transform 字符串转数字后通过 number', async () => {
    const errs = await runRules('5', [{ transform: (v) => Number(v), type: 'number' }]);
    assert.deepEqual(errs, []);
  });
});

describe('runRules 自定义校验', () => {
  it('返回 false 视为失败', async () => {
    assert.equal((await runRules('x', [{ validator: () => false }])).length, 1);
  });

  it('返回字符串作为错误信息', async () => {
    const errs = await runRules('x', [{ validator: () => '自定义错误' }]);
    assert.ok(errs.includes('自定义错误'));
  });

  it('返回 true 视为通过', async () => {
    assert.deepEqual(await runRules('x', [{ validator: () => true }]), []);
  });

  it('抛错时提取 message', async () => {
    const errs = await runRules('x', [
      {
        validator: async () => {
          throw new Error('异步失败');
        }
      }
    ]);
    assert.ok(errs.includes('异步失败'));
  });

  it('能拿到整个 model 做联动', async () => {
    const model = { password: 'abc', confirm: 'abc' };
    let captured = null;
    await runRules(
      'abc',
      [
        {
          validator: (_r, v, m) => {
            captured = m;
            return v === m.password;
          }
        }
      ],
      model
    );
    assert.equal(captured, model);
  });
});

describe('runRules 空值跳过', () => {
  it('非必填且为空时跳过 pattern', async () => {
    assert.deepEqual(await runRules('', [{ pattern: /^\d+$/ }]), []);
  });

  it('非必填且为 null 时跳过 type', async () => {
    assert.deepEqual(await runRules(null, [{ type: 'email' }]), []);
  });
});

describe('runRules 多规则累积', () => {
  it('多个规则各自报错', async () => {
    const errs = await runRules('ab', [
      { min: 3, message: '太短' },
      { pattern: /^\d+$/, message: '要数字' }
    ]);
    assert.equal(errs.length, 2);
    assert.deepEqual(errs, ['太短', '要数字']);
  });
});

describe('rulePresets', () => {
  it('required 预设', async () => {
    const errs = await runRules('', [rulePresets.required('姓名')]);
    assert.ok(errs[0].includes('姓名'));
  });

  it('phone 预设', async () => {
    assert.deepEqual(await runRules('13800138000', [rulePresets.phone()]), []);
    assert.equal((await runRules('123', [rulePresets.phone()])).length, 1);
  });

  it('range 预设', async () => {
    assert.deepEqual(await runRules(5, [rulePresets.range(1, 10)]), []);
    const errs = await runRules(20, [rulePresets.range(1, 10, '年龄')]);
    assert.ok(errs[0].includes('年龄需在 1 ~ 10 之间'));
  });
});
