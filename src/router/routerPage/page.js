export default [
    {
        path: '/',
        name: '主页',
        component: () => import('@/views/index.vue')
    },
    {
        path: '/penguinui',
        name: '组件页面',
        component: () => import('@/views/home.vue'),
        redirect: '/penguinui/install',
        children: [
            {
                path: 'install',
                name: '安装使用',
                component: () => import('/packages/install/doc/doc.md')
            },
            {
                path: 'layout',
                name: 'Layout 布局',
                component: () => import('/packages/layout/doc/doc.md')
            },
            {
                path: 'color',
                name: 'Color 颜色',
                component: () => import('/packages/color/doc/doc.md')
            },
            {
                path: 'icon',
                name: 'Icon 图标',
                component: () => import('/packages/icon/doc/doc.md')
            },
            {
                path: 'button',
                name: 'Button 按钮',
                component: () => import('/packages/button/doc/doc.md')
            },
            {
                path: 'input',
                name: 'Input 输入框',
                component: () => import('/packages/input/doc/doc.md')
            },
            {
                path: 'textarea',
                name: 'Textarea 文本域',
                component: () => import('/packages/textarea/doc/doc.md')
            },
            {
                path: 'Space',
                name: 'Space 间距',
                component: () => import('/packages/Space/doc/doc.md')
            },
            {
                path: 'select',
                name: 'Select 下拉框',
                component: () => import('/packages/select/doc/doc.md')
            },
            {
                path: 'treeSelect',
                name: 'TreeSelect 树选择',
                component: () => import('/packages/treeSelect/doc/doc.md')
            },
            {
                path: 'transfer',
                name: 'Transfer 穿梭框',
                component: () => import('/packages/transfer/doc/doc.md')
            },
            {
                path: 'dropDown',
                name: 'Dropdown 下拉菜单',
                component: () => import('/packages/dropDown/doc/doc.md')
            },
            {
                path: 'radio',
                name: 'Radio 单选',
                component: () => import('/packages/radio/doc/doc.md')
            },
            {
                path: 'checkbox',
                name: 'Checkbox 多选',
                component: () => import('/packages/checkbox/doc/doc.md')
            },
            {
                path: 'switch',
                name: 'Switch 开关',
                component: () => import('/packages/switch/doc/doc.md')
            },
            {
                path: 'optfile',
                name: 'Optfile 文件选择',
                component: () => import('/packages/optfile/doc/doc.md')
            },
            {
                path: 'badge',
                name: 'badge 徽章',
                component: () => import('/packages/badge/doc/doc.md')
            },
            {
                path: 'table',
                name: 'Table 表格',
                component: () => import('/packages/table/doc/doc.md')
            },
            {
                path: 'pagination',
                name: 'Pagination 分页',
                component: () => import('/packages/pagination/doc/doc.md')
            },
            {
                path: 'date',
                name: 'Datepicker 日期组件',
                component: () => import('/packages/date/doc/doc.md')
            },
            {
                path: 'datePicker',
                name: 'DatePicker 日期选择器',
                component: () => import('/packages/datePicker/doc/doc.md')
            },
            {
                path: 'tree',
                name: 'Tree 树形控件',
                component: () => import('/packages/tree/doc/doc.md')
            },
            {
                path: 'menu',
                name: 'Menu 菜单',
                component: () => import('/packages/menu/doc/doc.md')
            },
            {
                path: 'tabs',
                name: 'Tab 切换',
                component: () => import('/packages/tabs/doc/doc.md')
            },
            {
                path: 'progress',
                name: 'Progress 进度条',
                component: () => import('/packages/progress/doc/doc.md')
            },
            {
                path: 'message',
                name: 'Message 消息提示',
                component: () => import('/packages/message/doc/doc.md')
            },
            {
                path: 'confirm',
                name: 'Confirm 消息确认',
                component: () => import('/packages/confirm/doc/doc.md')
            },
            {
                path: 'modal',
                name: 'Modal 弹窗',
                component: () => import('/packages/modal/doc/doc.md')
            },
            {
                path: 'drawer',
                name: 'Drawer 抽屉',
                component: () => import('/packages/drawer/doc/doc.md')
            },
            {
                path: 'loading',
                name: 'Loading 加载中',
                component: () => import('/packages/loading/doc/doc.md')
            },
            {
                path: 'backtop',
                name: 'Backtop 回到顶部',
                component: () => import('/packages/backtop/doc/doc.md')
            },
            {
                path: 'popover',
                name: 'Popover 弹窗框',
                component: () => import('/packages/popover/doc/doc.md')
            },
            {
                path: 'colorPicker',
                name: 'colorPicker 颜色选择器',
                component: () => import('/packages/colorPicker/doc/doc.md')
            },
            {
                path: 'breadcrumb',
                name: 'breadcrumb 面包屑',
                component: () => import('/packages/breadcrumb/doc/doc.md')
            },
            {
                path: 'divider',
                name: 'divider 分割线',
                component: () => import('/packages/divider/doc/doc.md')
            },
            {
                path: 'alert',
                name: 'Alert 警告提示',
                component: () => import('/packages/alert/doc/doc.md')
            },
            {
                path: 'tag',
                name: 'Tag 标签',
                component: () => import('/packages/tag/doc/doc.md')
            },
            {
                path: 'avatar',
                name: 'Avatar 头像',
                component: () => import('/packages/avatar/doc/doc.md')
            },
            {
                path: 'card',
                name: 'Card 卡片',
                component: () => import('/packages/card/doc/doc.md')
            },
            {
                path: 'collapse',
                name: 'Collapse 折叠面板',
                component: () => import('/packages/collapse/doc/doc.md')
            },
            {
                path: 'skeleton',
                name: 'Skeleton 骨架屏',
                component: () => import('/packages/skeleton/doc/doc.md')
            },
            {
                path: 'empty',
                name: 'Empty 空状态',
                component: () => import('/packages/empty/doc/doc.md')
            },
            {
                path: 'tooltip',
                name: 'Tooltip 文字提示',
                component: () => import('/packages/tooltip/doc/doc.md')
            },
            {
                path: 'rate',
                name: 'Rate 评分',
                component: () => import('/packages/rate/doc/doc.md')
            },
            {
                path: 'inputNumber',
                name: 'InputNumber 数字框',
                component: () => import('/packages/inputNumber/doc/doc.md')
            },
            {
                path: 'slider',
                name: 'Slider 滑块',
                component: () => import('/packages/slider/doc/doc.md')
            },
            {
                path: 'steps',
                name: 'Steps 步骤条',
                component: () => import('/packages/steps/doc/doc.md')
            },
            {
                path: 'timeline',
                name: 'Timeline 时间轴',
                component: () => import('/packages/timeline/doc/doc.md')
            },
            {
                path: 'popconfirm',
                name: 'Popconfirm 气泡确认',
                component: () => import('/packages/popconfirm/doc/doc.md')
            },
            {
                path: 'notification',
                name: 'Notification 通知',
                component: () => import('/packages/notification/doc/doc.md')
            },
            {
                path: 'form',
                name: 'Form 表单',
                component: () => import('/packages/form/doc/doc.md')
            },
            {
                path: 'timePicker',
                name: 'TimePicker 时间选择',
                component: () => import('/packages/timePicker/doc/doc.md')
            },
            {
                path: 'cascader',
                name: 'Cascader 级联选择',
                component: () => import('/packages/cascader/doc/doc.md')
            },
            {
                path: 'carousel',
                name: 'Carousel 轮播图',
                component: () => import('/packages/carousel/doc/doc.md')
            },
            {
                path: 'upload',
                name: 'Upload 上传',
                component: () => import('/packages/upload/doc/doc.md')
            },
            {
                path: 'result',
                name: 'Result 结果页',
                component: () => import('/packages/result/doc/doc.md')
            },
            {
                path: 'statistic',
                name: 'Statistic 统计数值',
                component: () => import('/packages/statistic/doc/doc.md')
            },
            {
                path: 'affix',
                name: 'Affix 固钉',
                component: () => import('/packages/affix/doc/doc.md')
            },
            {
                path: 'anchor',
                name: 'Anchor 锚点',
                component: () => import('/packages/anchor/doc/doc.md')
            },
            {
                path: 'calendar',
                name: 'Calendar 日历',
                component: () => import('/packages/calendar/doc/doc.md')
            },
            {
                path: 'descriptions',
                name: 'Descriptions 描述列表',
                component: () => import('/packages/descriptions/doc/doc.md')
            },
            {
                path: 'image',
                name: 'Image 图片',
                component: () => import('/packages/image/doc/doc.md')
            },
            {
                path: 'segmented',
                name: 'Segmented 分段控制器',
                component: () => import('/packages/segmented/doc/doc.md')
            },
            {
                path: 'inputOtp',
                name: 'InputOTP 验证码',
                component: () => import('/packages/inputOtp/doc/doc.md')
            },
            {
                path: 'flex',
                name: 'Flex 弹性布局',
                component: () => import('/packages/flex/doc/doc.md')
            },
            {
                path: 'splitter',
                name: 'Splitter 分隔面板',
                component: () => import('/packages/splitter/doc/doc.md')
            },
            {
                path: 'resizable',
                name: 'Resizable 伸缩框',
                component: () => import('/packages/resizable/doc/doc.md')
            },
            {
                path: 'dragMove',
                name: 'DragMove 拖拽移动',
                component: () => import('/packages/dragMove/doc/doc.md')
            },
            {
                path: 'audioPlayer',
                name: 'AudioPlayer 音频播放器',
                component: () => import('/packages/audioPlayer/doc/doc.md')
            },
            {
                path: 'videoPlayer',
                name: 'VideoPlayer 视频播放器',
                component: () => import('/packages/videoPlayer/doc/doc.md')
            },
            {
                path: 'chat',
                name: 'Chat 对话',
                component: () => import('/packages/chat/doc/doc.md')
            },
            {
                path: 'list',
                name: 'List 列表',
                component: () => import('/packages/list/doc/doc.md')
            },
            {
                path: 'watermark',
                name: 'Watermark 水印',
                component: () => import('/packages/watermark/doc/doc.md')
            },
            {
                path: 'typography',
                name: 'Typography 排版',
                component: () => import('/packages/typography/doc/doc.md')
            },
            {
                path: 'scrollbar',
                name: 'Scrollbar 滚动条',
                component: () => import('/packages/scrollbar/doc/doc.md')
            },
            {
                path: 'autoComplete',
                name: 'AutoComplete 自动补全',
                component: () => import('/packages/autoComplete/doc/doc.md')
            },
            {
                path: 'mentions',
                name: 'Mentions 提及',
                component: () => import('/packages/mentions/doc/doc.md')
            },
            {
                path: 'floatButton',
                name: 'FloatButton 悬浮按钮',
                component: () => import('/packages/floatButton/doc/doc.md')
            },
            {
                path: 'tour',
                name: 'Tour 漫游式引导',
                component: () => import('/packages/tour/doc/doc.md')
            },
            {
                path: 'qrcode',
                name: 'QRCode 二维码',
                component: () => import('/packages/qrcode/doc/doc.md')
            },
            {
                path: 'comment',
                name: 'Comment 评论',
                component: () => import('/packages/comment/doc/doc.md')
            },
            {
                path: 'countdown',
                name: 'Countdown 倒计时',
                component: () => import('/packages/countdown/doc/doc.md')
            },
            {
                path: 'pageHeader',
                name: 'PageHeader 页头',
                component: () => import('/packages/pageHeader/doc/doc.md')
            },
            {
                path: 'configProvider',
                name: 'ConfigProvider 全局配置',
                component: () => import('/packages/configProvider/doc/doc.md')
            },
            {
                path: 'virtualList',
                name: 'VirtualList 虚拟列表',
                component: () => import('/packages/virtualList/doc/doc.md')
            },
            {
                path: 'bubble',
                name: 'Bubble 气泡',
                component: () => import('/packages/bubble/doc/doc.md')
            },
            {
                path: 'signature',
                name: 'Signature 手写签名',
                component: () => import('/packages/signature/doc/doc.md')
            },
            {
                path: 'imageViewer',
                name: 'ImageViewer 图片查看器',
                component: () => import('/packages/imageViewer/doc/doc.md')
            },
            {
                path: 'codeBlock',
                name: 'CodeBlock 代码块',
                component: () => import('/packages/codeBlock/doc/doc.md')
            }
        ]
    }
]
