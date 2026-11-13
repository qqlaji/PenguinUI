export const treeData = [
  {
    label: '前端工程',
    children: [
      {
        label: '组件库',
        children: [
          { label: 'Button 按钮' },
          { label: 'Table 表格' },
          { label: 'Tree 树形控件', children: [{ label: '勾选联动' }, { label: '搜索过滤' }] }
        ]
      },
      {
        label: '构建工具',
        children: [{ label: 'Vite 配置' }, { label: 'Rollup 插件' }]
      }
    ]
  },
  {
    label: '服务端',
    children: [
      { label: 'Nginx 反向代理' },
      { label: 'Docker 部署' },
      { label: '日志采集', disabled: true }
    ]
  },
  {
    label: '设计规范',
    children: [
      { label: '色彩令牌' },
      { label: '间距与圆角' },
      { label: '暗色主题' }
    ]
  }
];

/** 数据可视化（级别扁平） */
export const flatTreeData = [
  { label: '华东区', children: [{ label: '上海' }, { label: '杭州' }, { label: '南京' }] },
  { label: '华南区', children: [{ label: '广州' }, { label: '深圳' }] },
  { label: '华北区', children: [{ label: '北京' }, { label: '天津' }] }
];

export default treeData;
