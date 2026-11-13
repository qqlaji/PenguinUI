/**
 * Cascader 的纯逻辑工具
 * ---------------------------------------------------------------------------
 * 关键设计：多选时的数据形状
 * 单选：modelValue = ['zj', 'hz', 'xh']            —— 一条路径
 * 多选：modelValue = [['zj','hz'], ['fj','xm']]    —— 多条路径
 * 两者靠「第一项是不是数组」区分，这样旧代码完全不受影响。
 */

const isPath = (v) => Array.isArray(v);

/** 判断传入的 modelValue 是否是多选形状 */
export function isMultiValue(v) {
  if (!Array.isArray(v) || v.length === 0) return false;
  return v.every((item) => Array.isArray(item));
}

/** 建立 value → { node, path, level } 索引，value 需全局唯一 */
export function indexOptions(options, opts = {}) {
  const { valueField = 'value', labelField = 'label', childrenField = 'children', disabledField = 'disabled', isLeafField = 'isLeaf' } = opts;

  const map = new Map();
  const leaves = [];

  const walk = (list, parentPath, level) => {
    (list || []).forEach((raw) => {
      const value = raw ? raw[valueField] : undefined;
      if (value === undefined || value === null) return;

      const children = raw[childrenField];
      const hasChildren = Array.isArray(children) && children.length > 0;
      const path = [...parentPath, value];

      const entry = {
        value,
        label: raw[labelField],
        path,
        level,
        raw,
        hasChildren,
        isLeaf: raw[isLeafField] !== undefined ? !!raw[isLeafField] : !hasChildren,
        disabled: !!(raw && raw[disabledField])
      };

      // 同一 value 重复时保留第一个，避免索引被覆盖
      if (!map.has(value)) map.set(value, entry);
      if (!hasChildren) leaves.push(entry);

      if (hasChildren) walk(children, path, level + 1);
    });
  };

  walk(options, [], 0);
  return { map, leaves };
}

/** 按路径取各级节点（用于渲染已选标签） */
export function resolvePath(index, path) {
  return (path || []).map((v) => index.map.get(v)).filter(Boolean);
}

/** 路径 → 文本 */
export function pathToLabel(index, path, separator = ' / ') {
  return resolvePath(index, path)
    .map((n) => n.label)
    .join(separator);
}

/** 取某节点的全部后代 value */
export function collectDescendantValues(index, value) {
  const out = [];
  const root = index.map.get(value);
  if (!root) return out;

  const walk = (entry) => {
    const node = entry.raw;
    const children = node ? node.children : null;
    if (!Array.isArray(children)) return;
    children.forEach((c) => {
      const childEntry = index.map.get(c.value);
      if (childEntry) {
        out.push(childEntry.value);
        walk(childEntry);
      }
    });
  };

  walk(root);
  return out;
}

/**
 * 计算多选勾选态
 * - checkStrictly：按传入的路径显式认定，父级可单独选中
 * - 否则：父级的勾选/半选完全由「其下叶子的选中比例」推导
 *   全部叶子选中 → checked；部分选中 → half
 */
export function computeMultiState(index, paths, checkStrictly) {
  const checked = new Set();
  const half = new Set();

  const pathKeySet = new Set((paths || []).filter(Array.isArray).map((p) => p.join('>')));

  // 叶子：显式出现在路径里即勾选
  pathKeySet.forEach((k) => {
    const entry = index.map.get(k.split('>').pop());
    if (entry && !entry.hasChildren) checked.add(entry.value);
  });

  if (checkStrictly) {
    // 不联动模式：父级也可以被单独勾选
    pathKeySet.forEach((k) => {
      const entry = index.map.get(k.split('>').pop());
      if (entry && entry.hasChildren) checked.add(entry.value);
    });
    return { checked, half };
  }

  // 有子节点的父级：按叶子选中比例推导
  const parents = [...index.map.values()].filter((e) => e.hasChildren).sort((a, b) => b.level - a.level);

  parents.forEach((parent) => {
    const leaves = getDescendantLeaves(index, parent);
    if (!leaves.length) return;

    const selectedCount = leaves.filter((p) => pathKeySet.has(p.join('>'))).length;

    if (selectedCount === leaves.length) {
      checked.add(parent.value);
      half.delete(parent.value);
    } else if (selectedCount > 0) {
      half.add(parent.value);
      checked.delete(parent.value);
    }
  });

  return { checked, half };
}

/**
 * 多选时点击某节点，推导应写回 v-model 的路径列表
 *
 * 约定：**modelValue 只存叶子路径**（除非 checkStrictly 或该节点本身就是叶子）。
 * 父级的「已选 / 半选」状态由 computeMultiState 从叶子推导，
 * 这样标签不会出现「浙江省」和「浙江省/杭州市/西湖区」重复的情况。
 */
export function resolveMultiPaths(index, prevPaths, path, nextChecked, checkStrictly) {
  const keyOf = (p) => p.join('>');
  const prevKeySet = new Set((prevPaths || []).filter(Array.isArray).map(keyOf));
  const prevByKey = new Map((prevPaths || []).filter(Array.isArray).map((p) => [keyOf(p), p]));

  const target = index.map.get(path[path.length - 1]);
  if (!target) return prevPaths;

  if (checkStrictly) {
    // 不联动：点谁就记谁本身，允许记录父级路径
    if (nextChecked) prevKeySet.add(keyOf(path));
    else prevKeySet.delete(keyOf(path));
  } else {
    const selfKey = keyOf(path);

    if (target.hasChildren) {
      // 点到父级：展开成它下面所有叶子（父级自身不入库）
      const leafPaths = getDescendantLeaves(index, target).map((p) => p.join('>'));
      if (nextChecked) {
        prevKeySet.delete(selfKey);
        leafPaths.forEach((k) => prevKeySet.add(k));
      } else {
        prevKeySet.delete(selfKey);
        leafPaths.forEach((k) => prevKeySet.delete(k));
      }
    } else {
      // 点到叶子：只增删这一条
      if (nextChecked) prevKeySet.add(selfKey);
      else prevKeySet.delete(selfKey);
    }

    // 清理掉可能残留的父级路径（历史数据里若含父级，应该被叶子替代）
    prevKeySet.forEach((k) => {
      const entry = index.map.get(k.split('>').pop());
      if (entry && entry.hasChildren && hasAllLeavesSelected(index, entry, prevKeySet)) {
        prevKeySet.delete(k);
      }
    });
  }

  // 保持插入顺序稳定：先保留原有顺序，再追加新增项
  const result = [];
  const emitted = new Set();
  (prevPaths || []).filter(Array.isArray).forEach((p) => {
    const k = keyOf(p);
    if (prevKeySet.has(k) && !emitted.has(k)) {
      result.push(p);
      emitted.add(k);
    }
  });
  prevKeySet.forEach((k) => {
    if (!emitted.has(k)) {
      const p = prevByKey.get(k) || k.split('>');
      result.push(p);
      emitted.add(k);
    }
  });

  return result;
}

/** 某父节点下的叶子是否全部已选 */
function hasAllLeavesSelected(index, entry, keySet) {
  const leaves = getDescendantLeaves(index, entry);
  return leaves.length > 0 && leaves.every((p) => keySet.has(p.join('>')));
}

/** 取某节点下所有叶子的路径 */
function getDescendantLeaves(index, entry) {
  const out = [];
  const walk = (e) => {
    const children = e.raw.children;
    if (!Array.isArray(children) || !children.length) {
      out.push(e.path);
      return;
    }
    children.forEach((c) => {
      const ce = index.map.get(c.value);
      if (ce) walk(ce);
    });
  };
  walk(entry);
  return out;
}

/** 扁平化所有节点，供搜索使用 */
export function flattenForSearch(index) {
  return [...index.map.values()].filter((e) => !e.hasChildren);
}
