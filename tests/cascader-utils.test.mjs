/**
 * Cascader 多选逻辑单元测试
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  collectDescendantValues,
  computeMultiState,
  indexOptions,
  isMultiValue,
  pathToLabel,
  resolveMultiPaths
} from '../packages/cascader/utils.js';

const opts = () => [
  {
    value: 'zj',
    label: '浙江',
    children: [
      {
        value: 'hz',
        label: '杭州',
        children: [
          { value: 'xh', label: '西湖区' },
          { value: 'bj', label: '滨江区' }
        ]
      },
      { value: 'wz', label: '温州', children: [{ value: 'luc', label: '鹿城区' }] }
    ]
  },
  {
    value: 'fj',
    label: '福建',
    children: [
      { value: 'xm', label: '厦门', children: [{ value: 'sm', label: '思明区' }] },
      { value: 'fz', label: '福州' }
    ]
  }
];

const flat = (paths) => paths.map((p) => p.join('>'));

describe('isMultiValue 形状识别', () => {
  it('单选形状', () => {
    assert.equal(isMultiValue(['zj', 'hz']), false);
  });

  it('多选形状', () => {
    assert.equal(isMultiValue([['zj', 'hz'], ['fj', 'xm']]), true);
  });

  it('空数组不算多选', () => {
    assert.equal(isMultiValue([]), false);
  });
});

describe('indexOptions 索引', () => {
  it('节点数量与路径正确', () => {
    const idx = indexOptions(opts());
    assert.equal(idx.map.size, 10);
    assert.deepEqual(idx.map.get('xh').path, ['zj', 'hz', 'xh']);
  });

  it('叶子判定', () => {
    const idx = indexOptions(opts());
    assert.equal(idx.map.get('fz').isLeaf, true);
    assert.equal(idx.map.get('zj').isLeaf, false);
  });

  it('后代收集', () => {
    const idx = indexOptions(opts());
    assert.equal(collectDescendantValues(idx, 'zj').length, 5);
  });

  it('路径转文本', () => {
    const idx = indexOptions(opts());
    assert.equal(pathToLabel(idx, ['zj', 'hz', 'xh']), '浙江 / 杭州 / 西湖区');
  });

  it('透传 disabled', () => {
    const idx = indexOptions([{ value: 'a', label: 'A', disabled: true }]);
    assert.equal(idx.map.get('a').disabled, true);
  });
});

describe('resolveMultiPaths 勾选推导', () => {
  it('勾单个叶子只存该路径', () => {
    const idx = indexOptions(opts());
    const res = resolveMultiPaths(idx, [], ['zj', 'hz', 'xh'], true, false);
    assert.deepEqual(flat(res), ['zj>hz>xh']);
  });

  it('勾父级存其全部叶子，不含父级本身', () => {
    const idx = indexOptions(opts());
    const res = resolveMultiPaths(idx, [], ['zj'], true, false);
    assert.equal(res.length, 3);
    assert.ok(!flat(res).includes('zj'));
  });

  it('取消父级清空所有后代', () => {
    const idx = indexOptions(opts());
    let res = resolveMultiPaths(idx, [], ['zj'], true, false);
    res = resolveMultiPaths(idx, res, ['zj'], false, false);
    assert.equal(res.length, 0);
  });

  it('取消单个叶子', () => {
    const idx = indexOptions(opts());
    let res = resolveMultiPaths(idx, [], ['zj'], true, false);
    res = resolveMultiPaths(idx, res, ['zj', 'hz', 'xh'], false, false);
    assert.equal(res.length, 2);
    assert.ok(!flat(res).includes('zj>hz>xh'));
  });

  it('checkStrictly 只记自身', () => {
    const idx = indexOptions(opts());
    const res = resolveMultiPaths(idx, [], ['zj'], true, true);
    assert.deepEqual(flat(res), ['zj']);
  });

  it('已有选中项顺序保持在前', () => {
    const idx = indexOptions(opts());
    const res = resolveMultiPaths(idx, [['fj', 'xm', 'sm']], ['zj', 'hz', 'xh'], true, false);
    assert.equal(flat(res)[0], 'fj>xm>sm');
  });

  it('不产生重复项', () => {
    const idx = indexOptions(opts());
    const res = resolveMultiPaths(idx, [['zj', 'hz']], ['zj', 'hz', 'xh'], true, false);
    assert.equal(new Set(flat(res)).size, res.length);
  });
});

describe('computeMultiState 勾选态', () => {
  it('单叶子选中时父链半选', () => {
    const idx = indexOptions(opts());
    const paths = resolveMultiPaths(idx, [], ['zj', 'hz', 'xh'], true, false);
    const st = computeMultiState(idx, paths, false);
    assert.ok(st.checked.has('xh'));
    assert.ok(st.half.has('hz'));
    assert.ok(st.half.has('zj'));
  });

  it('兄弟叶子全选时父级勾选', () => {
    const idx = indexOptions(opts());
    let p = resolveMultiPaths(idx, [], ['zj', 'hz', 'xh'], true, false);
    p = resolveMultiPaths(idx, p, ['zj', 'hz', 'bj'], true, false);
    const st = computeMultiState(idx, p, false);
    assert.ok(st.checked.has('hz'));
    assert.ok(!st.half.has('hz'));
    assert.ok(st.half.has('zj'));
  });

  it('全部叶子选中时祖先全勾选', () => {
    const idx = indexOptions(opts());
    const p = resolveMultiPaths(idx, [], ['zj'], true, false);
    const st = computeMultiState(idx, p, false);
    assert.ok(st.checked.has('zj'));
    assert.equal(st.half.size, 0);
  });

  it('checkStrictly 下父级可单独勾选', () => {
    const idx = indexOptions(opts());
    const p = resolveMultiPaths(idx, [], ['zj'], true, true);
    const st = computeMultiState(idx, p, true);
    assert.ok(st.checked.has('zj'));
    assert.equal(st.half.size, 0);
  });

  it('空选中无任何状态', () => {
    const idx = indexOptions(opts());
    const st = computeMultiState(idx, [], false);
    assert.equal(st.checked.size, 0);
    assert.equal(st.half.size, 0);
  });
});
