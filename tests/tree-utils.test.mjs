/**
 * Tree 纯逻辑单元测试
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFlatTree,
  collectAncestorKeys,
  collectDescendantKeys,
  computeCheckState,
  filterKeys,
  resolveCheckedKeys
} from '../packages/tree/utils.js';

/** 测试用树：2 个根，共 11 个节点 */
const data = () => [
  {
    label: '一级',
    children: [
      { label: '一级1' },
      { label: '一级2' },
      {
        label: '一级3',
        children: [
          { label: '一级3-1' },
          { label: '一级3-2', children: [{ label: '一级3-2-1' }, { label: '一级3-2-2' }] }
        ]
      }
    ]
  },
  {
    label: '二级',
    children: [{ label: '二级1', disabled: true }, { label: '二级2' }]
  }
];

describe('buildFlatTree', () => {
  it('扁平化节点数量正确', () => {
    const { flat } = buildFlatTree(data());
    assert.equal(flat.length, 11);
  });

  it('路径 key 规则正确', () => {
    const { byKey } = buildFlatTree(data());
    assert.ok(byKey.has('0'));
    assert.ok(byKey.has('0-2-1-0'));
    assert.equal(byKey.get('0-2-1-0').label, '一级3-2-1');
  });

  it('level 层级正确', () => {
    const { byKey } = buildFlatTree(data());
    assert.equal(byKey.get('0').level, 0);
    assert.equal(byKey.get('0-2-1-0').level, 3);
  });

  it('不污染原始数据', () => {
    const d = data();
    buildFlatTree(d);
    assert.equal(d[0].key, undefined);
    assert.equal(d[0].isOpen, undefined);
    assert.equal(d[0].children[0].isSelected, undefined);
  });

  it('透传 disabled', () => {
    const { byKey } = buildFlatTree(data());
    assert.equal(byKey.get('1-0').disabled, true);
  });

  it('数据自带 key 优先', () => {
    const { byKey } = buildFlatTree([
      { key: 'x1', label: 'X' },
      { key: 'x2', label: 'Y' }
    ]);
    assert.ok(byKey.has('x1'));
    assert.ok(byKey.has('x2'));
  });

  it('支持自定义字段名', () => {
    const { flat } = buildFlatTree(
      [{ name: 'A', kids: [{ name: 'A1' }] }],
      { labelField: 'name', childrenField: 'kids' }
    );
    assert.equal(flat.length, 2);
    assert.equal(flat[1].label, 'A1');
  });
});

describe('collectAncestorKeys / collectDescendantKeys', () => {
  it('祖先链顺序由根到父', () => {
    const { byKey } = buildFlatTree(data());
    assert.deepEqual(collectAncestorKeys(byKey, '0-2-1-0'), ['0', '0-2', '0-2-1']);
  });

  it('后代集合包含所有层级', () => {
    const { byKey } = buildFlatTree(data());
    const d = collectDescendantKeys(byKey, '0');
    assert.equal(d.length, 7);
    assert.ok(d.includes('0-0'));
    assert.ok(d.includes('0-2-1-1'));
  });

  it('includeSelf 把自己也带上', () => {
    const { byKey } = buildFlatTree(data());
    const d = collectDescendantKeys(byKey, '0-2', true);
    assert.equal(d[0], '0-2');
  });
});

describe('computeCheckState 勾选联动', () => {
  it('勾父级后所有后代都是勾选态', () => {
    const { byKey } = buildFlatTree(data());
    const keys = resolveCheckedKeys(byKey, [], '0', true, false);
    const st = computeCheckState(byKey, keys, false);
    assert.equal(keys.length, 8);
    assert.equal(st.half.size, 0);
  });

  it('取消一个叶子后父链变半选', () => {
    const { byKey } = buildFlatTree(data());
    let keys = resolveCheckedKeys(byKey, [], '0', true, false);
    keys = resolveCheckedKeys(byKey, keys, '0-2-1-0', false, false);
    const st = computeCheckState(byKey, keys, false);
    assert.ok(st.half.has('0'));
    assert.ok(st.half.has('0-2'));
    assert.ok(st.half.has('0-2-1'));
    assert.ok(!st.checked.has('0'));
  });

  it('勾回后父节点恢复勾选', () => {
    const { byKey } = buildFlatTree(data());
    let keys = resolveCheckedKeys(byKey, [], '0', true, false);
    keys = resolveCheckedKeys(byKey, keys, '0-2-1-0', false, false);
    keys = resolveCheckedKeys(byKey, keys, '0-2-1-0', true, false);
    const st = computeCheckState(byKey, keys, false);
    assert.ok(st.checked.has('0'));
    assert.equal(st.half.size, 0);
  });

  it('只勾一个子节点时根为半选', () => {
    const { byKey } = buildFlatTree(data());
    const keys = resolveCheckedKeys(byKey, [], '0-0', true, false);
    const st = computeCheckState(byKey, keys, false);
    assert.ok(st.half.has('0'));
    assert.ok(!st.checked.has('0'));
  });

  it('checkStrictly 不级联', () => {
    const { byKey } = buildFlatTree(data());
    const keys = resolveCheckedKeys(byKey, [], '0', true, true);
    assert.deepEqual(keys, ['0']);
  });

  it('checkStrictly 无半选', () => {
    const { byKey } = buildFlatTree(data());
    const st = computeCheckState(byKey, ['0', '0-1'], true);
    assert.equal(st.half.size, 0);
  });
});

describe('filterKeys 搜索过滤', () => {
  it('保留命中节点与祖先链', () => {
    const { byKey } = buildFlatTree(data());
    const keep = filterKeys(byKey, '3-2-1', 'label');
    assert.ok(keep.has('0-2-1-0'));
    assert.ok(keep.has('0-2-1'));
    assert.ok(keep.has('0-2'));
    assert.ok(keep.has('0'));
  });

  it('排除无关节点', () => {
    const { byKey } = buildFlatTree(data());
    const keep = filterKeys(byKey, '3-2-1', 'label');
    assert.ok(!keep.has('1'));
    assert.ok(!keep.has('0-1'));
  });

  it('空关键字返回 null（表示不过滤）', () => {
    const { byKey } = buildFlatTree(data());
    assert.equal(filterKeys(byKey, '   ', 'label'), null);
  });

  it('大小写不敏感', () => {
    const { byKey } = buildFlatTree([{ label: 'Alpha' }, { label: 'Beta' }]);
    const keep = filterKeys(byKey, 'alpha', 'label');
    assert.ok(keep.has('0'));
    assert.ok(!keep.has('1'));
  });
});
