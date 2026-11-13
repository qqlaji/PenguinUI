// 演示数据：省市区三级
export const regionOptions = [
  {
    value: 'zj',
    label: '浙江省',
    children: [
      {
        value: 'hz',
        label: '杭州市',
        children: [
          { value: 'xh', label: '西湖区' },
          { value: 'bj', label: '滨江区' },
          { value: 'yh', label: '余杭区' }
        ]
      },
      {
        value: 'wz',
        label: '温州市',
        children: [{ value: 'luc', label: '鹿城区' }, { value: 'oh', label: '瓯海区' }]
      },
      {
        value: 'nb',
        label: '宁波市',
        children: [{ value: 'hs', label: '海曙区' }, { value: 'yz', label: '鄞州区' }]
      }
    ]
  },
  {
    value: 'fj',
    label: '福建省',
    children: [
      {
        value: 'xm',
        label: '厦门市',
        children: [{ value: 'smq', label: '思明区' }, { value: 'hlq', label: '湖里区' }]
      },
      { value: 'fz', label: '福州市', children: [{ value: 'glq', label: '鼓楼区' }] }
    ]
  },
  {
    value: 'gd',
    label: '广东省',
    children: [
      {
        value: 'sz',
        label: '深圳市',
        children: [{ value: 'nsq', label: '南山区' }, { value: 'ftq', label: '福田区' }]
      },
      {
        value: 'gz',
        label: '广州市',
        children: [{ value: 'thq', label: '天河区' }, { value: 'hzh', label: '海珠区' }]
      }
    ]
  }
];

// 带禁用节点的分类树
export const categoryOptions = [
  {
    value: 'tech',
    label: '技术文档',
    children: [
      { value: 'fe', label: '前端开发' },
      { value: 'be', label: '后端开发' },
      { value: 'ops', label: '运维部署', disabled: true }
    ]
  },
  {
    value: 'design',
    label: '设计资源',
    children: [
      { value: 'ui', label: 'UI 规范' },
      { value: 'icon', label: '图标库' },
      { value: 'font', label: '字体方案' }
    ]
  },
  {
    value: 'biz',
    label: '业务模块',
    disabled: true,
    children: [{ value: 'order', label: '订单' }]
  }
];

export default regionOptions;
