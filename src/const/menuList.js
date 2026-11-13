// 文档站菜单：既是侧栏数据源，也是全站搜索的组件索引
// 分组字段：key / icon / tone / caption 驱动侧栏与首页的分类色板
// 条目可选字段：isNew（NEW 徽标）、keywords（搜索关键词）、icon（搜索结果图标）
//              doc（纯文档页，不是组件，不计入组件总数）
export default [
    {
        'title-cn': '快速上手',
        'title-en': 'Quick start',
        key: 'start',
        icon: 'cat-start',
        tone: 'start',
        caption: 'GET STARTED',
        list: [
            {
                'title-cn': '安装使用',
                'title-en': 'Install and use',
                path: '/penguinui/install',
                keywords: 'install 安装 快速上手 引入 配置 npm',
                doc: true
            }
        ]
    },
    {
        'title-cn': '常规',
        'title-en': 'Conventional',
        key: 'basic',
        icon: 'cat-basic',
        tone: 'basic',
        caption: 'FOUNDATION',
        list: [
            { 'title-cn': 'layout 布局', 'title-en': 'layout', path: '/penguinui/layout', keywords: 'layout row col 栅格 布局' },
            { 'title-cn': 'ConfigProvider 全局配置', 'title-en': 'ConfigProvider', path: '/penguinui/configProvider', keywords: 'configprovider 全局 配置 主题 主色 尺寸 圆角', isNew: true },
            { 'title-cn': 'Typography 排版', 'title-en': 'Typography', path: '/penguinui/typography', keywords: 'typography 排版 标题 正文 省略 复制 文本', isNew: true },
            { 'title-cn': 'PageHeader 页头', 'title-en': 'PageHeader', path: '/penguinui/pageHeader', keywords: 'pageheader 页头 标题 面包屑 返回', isNew: true },
            { 'title-cn': 'Scrollbar 滚动条', 'title-en': 'Scrollbar', path: '/penguinui/scrollbar', keywords: 'scrollbar 滚动条 自定义 滚动 拖拽', isNew: true },
            { 'title-cn': 'Color 颜色', 'title-en': 'Colors', path: '/penguinui/color', keywords: 'color 颜色 语义色 主题', doc: true },
            { 'title-cn': 'Icon 图标', 'title-en': 'Icons', path: '/penguinui/icon', keywords: 'icon 图标 iconfont svg 字体' }
        ]
    },
    {
        'title-cn': '通用',
        'title-en': 'Universal',
        key: 'general',
        icon: 'cat-general',
        tone: 'general',
        caption: 'GENERAL',
        list: [
            { 'title-cn': 'Button 按钮', 'title-en': 'Buttons', path: '/penguinui/button', keywords: 'button 按钮 点击' },
            { 'title-cn': 'FloatButton 悬浮按钮', 'title-en': 'FloatButton', path: '/penguinui/floatButton', keywords: 'floatbutton 悬浮按钮 浮动 回到顶部 徽标', isNew: true },
            { 'title-cn': 'Input 输入框', 'title-en': 'Inputs', path: '/penguinui/input', keywords: 'input 输入框 表单' },
            { 'title-cn': 'AutoComplete 自动补全', 'title-en': 'AutoComplete', path: '/penguinui/autoComplete', keywords: 'autocomplete 自动补全 联想 搜索建议 输入', isNew: true },
            { 'title-cn': 'Mentions 提及', 'title-en': 'Mentions', path: '/penguinui/mentions', keywords: 'mentions 提及 @ 话题 成员 输入', isNew: true },
            { 'title-cn': 'Textarea 文本域', 'title-en': 'Textarea', path: '/penguinui/textarea', keywords: 'textarea 文本域 多行' },
            { 'title-cn': 'Space 间距', 'title-en': 'Space', path: '/penguinui/Space', keywords: 'space 间距 布局' },
            { 'title-cn': 'Select 下拉框', 'title-en': 'Select', path: '/penguinui/select', keywords: 'select 下拉 选择' },
            { 'title-cn': 'TreeSelect 树选择', 'title-en': 'TreeSelect', path: '/penguinui/treeSelect', keywords: 'treeselect 树 选择 多选 部门', isNew: true },
            { 'title-cn': 'Transfer 穿梭框', 'title-en': 'Transfer', path: '/penguinui/transfer', keywords: 'transfer 穿梭框 移动 分配', isNew: true },
            { 'title-cn': 'Dropdown 下拉菜单', 'title-en': 'Dropdown', path: '/penguinui/dropDown', keywords: 'dropdown 下拉菜单' },
            { 'title-cn': 'Radio 单选', 'title-en': 'Radios', path: '/penguinui/radio', keywords: 'radio 单选' },
            { 'title-cn': 'Checkbox 多选', 'title-en': 'Checkbox', path: '/penguinui/checkbox', keywords: 'checkbox 多选 复选' },
            { 'title-cn': 'Switch 开关', 'title-en': 'Switch', path: '/penguinui/switch', keywords: 'switch 开关' },
            { 'title-cn': 'OptFile 文件选择', 'title-en': 'OptFile', path: '/penguinui/optfile', keywords: 'optfile 文件 上传' },
            { 'title-cn': 'ColorPicker 取色器', 'title-en': 'ColorPicker', path: '/penguinui/colorPicker', keywords: 'colorpicker 取色 颜色选择' },
            { 'title-cn': 'Rate 评分', 'title-en': 'Rate', path: '/penguinui/rate', keywords: 'rate 评分 星星 半星', isNew: true },
    { 'title-cn': 'Form 表单', 'title-en': 'Form', path: '/penguinui/form', keywords: 'form 表单 校验 输入', isNew: true },
    { 'title-cn': 'InputNumber 数字框', 'title-en': 'InputNumber', path: '/penguinui/inputNumber', keywords: 'inputnumber 数字 步进 计数器', isNew: true },
    { 'title-cn': 'Slider 滑块', 'title-en': 'Slider', path: '/penguinui/slider', keywords: 'slider 滑块 拖动 范围', isNew: true },
    { 'title-cn': 'Upload 上传', 'title-en': 'Upload', path: '/penguinui/upload', keywords: 'upload 上传 文件 拖拽 进度 队列', isNew: true },
    { 'title-cn': 'InputOTP 验证码', 'title-en': 'InputOTP', path: '/penguinui/inputOtp', keywords: 'inputotp 验证码 短信 一次性密码 otp', isNew: true },
    { 'title-cn': 'Flex 弹性布局', 'title-en': 'Flex', path: '/penguinui/flex', keywords: 'flex 弹性 布局 居中 间距', isNew: true },
    { 'title-cn': 'Splitter 分隔面板', 'title-en': 'Splitter', path: '/penguinui/splitter', keywords: 'splitter 分隔 拖拽 分栏 面板', isNew: true },
    { 'title-cn': 'Resizable 伸缩框', 'title-en': 'Resizable', path: '/penguinui/resizable', keywords: 'resizable 伸缩 缩放 拖拽 改变大小 resize 组合', isNew: true },
    { 'title-cn': 'DragMove 拖拽移动', 'title-en': 'DragMove', path: '/penguinui/dragMove', keywords: 'dragmove 拖拽 拖动 移动 位置 自由 drag', isNew: true }
        ]
    },
    {
        'title-cn': '数据',
        'title-en': 'Data',
        key: 'data',
        icon: 'cat-data',
        tone: 'data',
        caption: 'DATA DISPLAY',
        list: [
            { 'title-cn': 'Badge 徽章', 'title-en': 'Badge', path: '/penguinui/badge', keywords: 'badge 徽章 标记' },
            { 'title-cn': 'Table 表格', 'title-en': 'Table', path: '/penguinui/table', keywords: 'table 表格 数据' },
            { 'title-cn': 'Pagination 分页', 'title-en': 'Pagination', path: '/penguinui/pagination', keywords: 'pagination 分页' },
            { 'title-cn': 'Date 日期选择', 'title-en': 'Datepicker', path: '/penguinui/date', keywords: 'date 日期 日历' },
            { 'title-cn': 'DatePicker 日期选择器', 'title-en': 'DatePicker', path: '/penguinui/datePicker', keywords: 'datepicker 日期 时间 时分秒 范围 开始 结束 range datetime', isNew: true },
            { 'title-cn': 'Tree 树形控件', 'title-en': 'Tree', path: '/penguinui/tree', keywords: 'tree 树形' },
            { 'title-cn': 'Menu 菜单', 'title-en': 'Menu', path: '/penguinui/menu', keywords: 'menu 菜单 导航' },
            { 'title-cn': 'Tab 切换', 'title-en': 'Tabs', path: '/penguinui/tabs', keywords: 'tabs 标签页 切换' },
            { 'title-cn': 'Progress 进度条', 'title-en': 'Progress', path: '/penguinui/progress', keywords: 'progress 进度条' },
            { 'title-cn': 'Breadcrumb 面包屑', 'title-en': 'Breadcrumb', path: '/penguinui/breadcrumb', keywords: 'breadcrumb 面包屑 导航' },
    { 'title-cn': 'Steps 步骤条', 'title-en': 'Steps', path: '/penguinui/steps', keywords: 'steps 步骤 流程 向导', isNew: true },
    { 'title-cn': 'Timeline 时间轴', 'title-en': 'Timeline', path: '/penguinui/timeline', keywords: 'timeline 时间轴 记录 历史', isNew: true },
    { 'title-cn': 'TimePicker 时间选择', 'title-en': 'TimePicker', path: '/penguinui/timePicker', keywords: 'timepicker 时间 时分秒', isNew: true },
    { 'title-cn': 'Cascader 级联选择', 'title-en': 'Cascader', path: '/penguinui/cascader', keywords: 'cascader 级联 省市区 树', isNew: true },
    { 'title-cn': 'Statistic 统计数值', 'title-en': 'Statistic', path: '/penguinui/statistic', keywords: 'statistic 统计 数值 数字 看板 countup', isNew: true },
    { 'title-cn': 'Countdown 倒计时', 'title-en': 'Countdown', path: '/penguinui/countdown', keywords: 'countdown 倒计时 计时 秒杀 剩余时间', isNew: true },
    { 'title-cn': 'VirtualList 虚拟列表', 'title-en': 'VirtualList', path: '/penguinui/virtualList', keywords: 'virtuallist 虚拟列表 长列表 性能 滚动 大数据', isNew: true },
    { 'title-cn': 'Calendar 日历', 'title-en': 'Calendar', path: '/penguinui/calendar', keywords: 'calendar 日历 日程 月视图', isNew: true },
    { 'title-cn': 'Descriptions 描述列表', 'title-en': 'Descriptions', path: '/penguinui/descriptions', keywords: 'descriptions 描述 列表 详情 字段', isNew: true }
        ]
    },
    {
        'title-cn': '交互',
        'title-en': 'Interactive',
        key: 'interaction',
        icon: 'cat-interaction',
        tone: 'interaction',
        caption: 'INTERACTION',
        list: [
            { 'title-cn': 'Message 消息提示', 'title-en': 'Message', path: '/penguinui/message', keywords: 'message 消息 toast 提示' },
            { 'title-cn': 'Popover 弹出框', 'title-en': 'Popover', path: '/penguinui/popover', keywords: 'popover 弹出框' },
            { 'title-cn': 'Confirm 消息确认', 'title-en': 'Confirm', path: '/penguinui/confirm', keywords: 'confirm 确认框' },
            { 'title-cn': 'Modal 弹窗', 'title-en': 'Modal', path: '/penguinui/modal', keywords: 'modal 弹窗 对话框' },
            { 'title-cn': 'Drawer 抽屉', 'title-en': 'Drawer', path: '/penguinui/drawer', keywords: 'drawer 抽屉' },
            { 'title-cn': 'Loading 加载中', 'title-en': 'Loading', path: '/penguinui/loading', keywords: 'loading 加载' },
            { 'title-cn': 'Backtop 回到顶部', 'title-en': 'Backtop', path: '/penguinui/backtop', keywords: 'backtop 回到顶部' },
    { 'title-cn': 'Popconfirm 气泡确认', 'title-en': 'Popconfirm', path: '/penguinui/popconfirm', keywords: 'popconfirm 确认 气泡 二次确认', isNew: true },
    { 'title-cn': 'Affix 固钉', 'title-en': 'Affix', path: '/penguinui/affix', keywords: 'affix 固钉 吸顶 固定 滚动', isNew: true },
    { 'title-cn': 'Anchor 锚点', 'title-en': 'Anchor', path: '/penguinui/anchor', keywords: 'anchor 锚点 定位 目录 滚动', isNew: true },
    { 'title-cn': 'Tour 漫游引导', 'title-en': 'Tour', path: '/penguinui/tour', keywords: 'tour 漫游 引导 新手 高亮 遮罩 聚光灯', isNew: true }
        ]
    },
    {
        'title-cn': '展示',
        'title-en': 'Display',
        key: 'display',
        icon: 'cat-display',
        tone: 'display',
        caption: 'PRESENTATION',
        list: [
            { 'title-cn': 'Card 卡片', 'title-en': 'Card', path: '/penguinui/card', keywords: 'card 卡片 容器', isNew: true },
            { 'title-cn': 'Collapse 折叠面板', 'title-en': 'Collapse', path: '/penguinui/collapse', keywords: 'collapse 折叠面板 手风琴 accordion', isNew: true },
            { 'title-cn': 'Avatar 头像', 'title-en': 'Avatar', path: '/penguinui/avatar', keywords: 'avatar 头像 用户', isNew: true },
            { 'title-cn': 'Tag 标签', 'title-en': 'Tag', path: '/penguinui/tag', keywords: 'tag 标签 状态', isNew: true },
            { 'title-cn': 'Empty 空状态', 'title-en': 'Empty', path: '/penguinui/empty', keywords: 'empty 空状态 无数据', isNew: true },
            { 'title-cn': 'Skeleton 骨架屏', 'title-en': 'Skeleton', path: '/penguinui/skeleton', keywords: 'skeleton 骨架屏 加载占位', isNew: true },
    { 'title-cn': 'Carousel 轮播图', 'title-en': 'Carousel', path: '/penguinui/carousel', keywords: 'carousel 走马灯 轮播 banner', isNew: true },
    { 'title-cn': 'Image 图片', 'title-en': 'Image', path: '/penguinui/image', keywords: 'image 图片 预览 放大 缩放', isNew: true },
    { 'title-cn': 'Segmented 分段控制器', 'title-en': 'Segmented', path: '/penguinui/segmented', keywords: 'segmented 分段 切换 选项卡', isNew: true },
    { 'title-cn': 'List 列表', 'title-en': 'List', path: '/penguinui/list', keywords: 'list 列表 容器 加载 空状态', isNew: true },
    { 'title-cn': 'Comment 评论', 'title-en': 'Comment', path: '/penguinui/comment', keywords: 'comment 评论 回复 讨论 留言 头像', isNew: true },
    { 'title-cn': 'Bubble 气泡', 'title-en': 'Bubble', path: '/penguinui/bubble', keywords: 'bubble 气泡 聊天 对话 消息 客服', isNew: true },
    { 'title-cn': 'Signature 手写签名', 'title-en': 'Signature', path: '/penguinui/signature', keywords: 'signature 签名 手写 画板 canvas 签字', isNew: true },
    { 'title-cn': 'ImageViewer 图片查看器', 'title-en': 'ImageViewer', path: '/penguinui/imageViewer', keywords: 'imageviewer 图片 查看器 预览 放大 缩放 画廊', isNew: true },
    { 'title-cn': 'CodeBlock 代码块', 'title-en': 'CodeBlock', path: '/penguinui/codeBlock', keywords: 'codeblock 代码块 高亮 语法 复制 行号', isNew: true },
    { 'title-cn': 'QRCode 二维码', 'title-en': 'QRCode', path: '/penguinui/qrcode', keywords: 'qrcode 二维码 扫码 编码 logo', isNew: true },
    { 'title-cn': 'Watermark 水印', 'title-en': 'Watermark', path: '/penguinui/watermark', keywords: 'watermark 水印 防泄漏 图片', isNew: true },
    { 'title-cn': 'AudioPlayer 音频播放器', 'title-en': 'AudioPlayer', path: '/penguinui/audioPlayer', keywords: 'audioplayer 音频 播放器 音乐 声音 波形 audio', isNew: true },
    { 'title-cn': 'VideoPlayer 视频播放器', 'title-en': 'VideoPlayer', path: '/penguinui/videoPlayer', keywords: 'videoplayer 视频 播放器 全屏 画中画 弹幕 video', isNew: true },
    { 'title-cn': 'Chat 对话', 'title-en': 'Chat', path: '/penguinui/chat', keywords: 'chat 对话 会话 AI 聊天 消息 markdown 流式', isNew: true }
        ]
    },
    {
        'title-cn': '反馈',
        'title-en': 'Feedback',
        key: 'feedback',
        icon: 'cat-feedback',
        tone: 'feedback',
        caption: 'FEEDBACK',
        list: [
            { 'title-cn': 'Alert 警告提示', 'title-en': 'Alert', path: '/penguinui/alert', keywords: 'alert 警告 提示 通知', isNew: true },
            { 'title-cn': 'Tooltip 文字提示', 'title-en': 'Tooltip', path: '/penguinui/tooltip', keywords: 'tooltip 提示 气泡', isNew: true },
    { 'title-cn': 'Notification 通知', 'title-en': 'Notification', path: '/penguinui/notification', keywords: 'notification 通知 提醒 全局', isNew: true },
    { 'title-cn': 'Result 结果页', 'title-en': 'Result', path: '/penguinui/result', keywords: 'result 结果页 成功 失败 404 500', isNew: true }
        ]
    },
    {
        'title-cn': '其他',
        'title-en': 'Other',
        key: 'other',
        icon: 'cat-other',
        tone: 'other',
        caption: 'MISC',
        list: [
            { 'title-cn': 'Divider 分割线', 'title-en': 'Divider', path: '/penguinui/divider', keywords: 'divider 分割线' }
        ]
    }
]
