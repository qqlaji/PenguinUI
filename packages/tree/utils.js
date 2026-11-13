/**
 * Tree 的纯逻辑工具
 * ---------------------------------------------------------------------------
 * 设计原则：
 * 1. **绝不修改传入的 options**。旧实现直接 `item.key = ...`、`item.isOpen = ...`
 *    往原始数据上写运行时状态，父组件数据是 props 时会直接报错。
 *    这里改为构建一份带 key / parent 的「扁平快照」，UI 状态一律用 Set 存。
 * 2. key 由路径生成（'0-2-1'），与旧版 `defaultOpenNodes` 的写法保持一致，
 *    老代码传 ['0-2'] 依然能展开对应节点。
 */

/** 生成稳定 key：优先用数据自带 key/id，否则用「父路径-序号」 */
export function buildFlatTree(nodes, opts = {}) {
  const {
    labelField = 'label',
    childrenField = 'children',
    disabledField = 'disabled',
    isLeafField = 'isLeaf'
  } = opts;

  const flat = [];
  const byKey = new Map();

  const walk = (list, parentKey, level, parentNode) => {
    (list || []).forEach((raw, index) => {
      const path = parentKey === '' ? String(index) : `${parentKey}-${index}`;
      const key = raw && raw.key !== undefined && raw.key !== null ? String(raw.key) : path;
      const children = raw ? raw[childrenField] : null;
      const hasChildren = Array.isArray(children) && children.length > 0;

      const node = {
        key,
        path,
        level,
        label: raw ? raw[labelField] : '',
        disabled: !!(raw && raw[disabledField]),
        isLeaf: raw && raw[isLeafField] !== undefined ? !!raw[isLeafField] : !hasChildren,
        hasChildren,
        // 原始数据引用，供插槽与事件回传
        raw,
        parentKey: parentKey === '' ? null : parentNode ? parentNode.key : null,
        childKeys: []
      };

      flat.push(node);
      byKey.set(key, node);

      if (hasChildren) {
        node.childKeys = children.map((c, i) => {
          const childPath = `${path}-${i}`;
          return c && c.key !== undefined && c.key !== null ? String(c.key) : childPath;
        });
        walk(children, path, level + 1, node);
      }
    });
  };

  walk(nodes, '', 0, null);

  return { flat, byKey };
}

/** 取某节点的全部后代 key（含自身可选） */
export function collectDescendantKeys(byKey, key, includeSelf = false) {
  const out = [];
  const node = byKey.get(key);
  if (!node) return out;

  const walk = (n) => {
    (n.childKeys || []).forEach((ck) => {
      const child = byKey.get(ck);
      if (child) {
        out.push(ck);
        walk(child);
      }
    });
  };

  walk(node);
  if (includeSelf) out.unshift(key);
  return out;
}

/** 取从根到某节点的祖先 key 链（不含自身），用于「选中即展开父级」 */
export function collectAncestorKeys(byKey, key) {
  const out = [];
  let node = byKey.get(key);
  while (node && node.parentKey !== null) {
    out.unshift(node.parentKey);
    node = byKey.get(node.parentKey);
  }
  return out;
}

/**
 * 计算勾选态：返回 { checked: Set, half: Set }
 * - checkStrictly=true 时父子互不影响，half 恒为空
 * - 否则：叶子勾选即计入；父节点「子全选」则为勾选，「部分选中」则为半选
 */
export function computeCheckState(byKey, checkedKeys, checkStrictly) {
  if (checkStrictly) {
    return { checked: new Set(checkedKeys), half: new Set() };
  }

  const checked = new Set();
  const half = new Set();

  // 自底向上重算：按 level 倒序保证子节点先算完
  const nodes = [...byKey.values()].sort((a, b) => b.level - a.level);

  // 先把「叶子 / 无子节点」的原始勾选原样标记
  nodes.forEach((node) => {
    const isCheckedLeaf = checkedKeys.includes(node.key);
    if (node.isLeaf || node.childKeys.length === 0) {
      if (isCheckedLeaf) checked.add(node.key);
      return;
    }

    const childCount = node.childKeys.length;
    let allChecked = childCount > 0;
    let someChecked = false;

    node.childKeys.forEach((ck) => {
      if (checked.has(ck)) someChecked = true;
      else if (half.has(ck)) someChecked = true;
      if (!checked.has(ck)) allChecked = false;
    });

    // 显式把自己勾上也算勾选（用于「只给父节点传 key」的场景）
    if (allChecked || (isCheckedLeaf && !someChecked)) {
      checked.add(node.key);
    } else if (someChecked) {
      half.add(node.key);
    }
  });

  return { checked, half };
}

/**
 * 勾选某节点后，推导应写回 v-model 的 key 列表
 * - 勾选父节点 → 后代全选；取消 → 后代全取消
 * - 子节点变化后，父节点按「全选则加入、否则移除」同步
 */
export function resolveCheckedKeys(byKey, prevKeys, key, nextChecked, checkStrictly) {
  if (checkStrictly) {
    const set = new Set(prevKeys);
    if (nextChecked) set.add(key);
    else set.delete(key);
    return [...set];
  }

  const set = new Set(prevKeys);

  // 自身与后代一起处理
  const affected = collectDescendantKeys(byKey, key, true);
  affected.forEach((k) => {
    if (nextChecked) set.add(k);
    else set.delete(k);
  });

  // 向上回溯父节点，重新评估「是否全选」
  let node = byKey.get(key);
  while (node && node.parentKey !== null) {
    const parent = byKey.get(node.parentKey);
    if (!parent) break;

    const allSelected = parent.childKeys.every((ck) => set.has(ck));
    if (allSelected) set.add(parent.key);
    else set.delete(parent.key);

    node = parent;
  }

  return [...set];
}

/**
 * 按关键字过滤：命中节点的祖先链保留，其余剪掉
 * 返回需要保留的 key 集合（用于隐藏未命中节点，而不是真的重建树）
 */
export function filterKeys(byKey, keyword, labelField) {
  const kw = String(keyword || '').trim().toLowerCase();
  if (!kw) return null; // null 表示不过滤

  const keep = new Set();

  byKey.forEach((node) => {
    const text = String(node.label ?? '').toLowerCase();
    if (text.includes(kw)) {
      keep.add(node.key);
      // 保留祖先链，否则节点无处挂载
      collectAncestorKeys(byKey, node.key).forEach((k) => keep.add(k));
    }
  });

  return keep;
}
