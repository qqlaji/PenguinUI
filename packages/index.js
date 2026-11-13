// 图标与全局样式统一在库入口引入：构建后自动输出到 dist/style.css，
// 按需引入任意组件时图标也不会丢失，且完全不依赖外部 CDN。
import "../styles/iconfont.css";
import "../styles/main.css";
// 版本号统一从 package.json 读取，避免多处硬编码造成不一致
import { version as PKG_VERSION } from "../package.json";

//导入组件
import tButton from "./button/index";
import tInput from "./input/index";
import tTable from "./table/index";
import tSelect from "./select/index";
import tDropdown from "./dropDown/index";
import tRadio from "./radio/index";
import tCheckbox from "./checkbox/index";
import Message from "./message/index";
import Confirm from "./confirm/index";
import tModal from "./modal/index";
import tDrawer from "./drawer/index";
import Loading from "./loading/index";
import tSwitch from "./switch/index";
import tTree from "./tree/index";
import tOptfile from "./optfile/index";
import tTextarea from "./textarea/index";
import tRow from "./mrow/index";
import tCol from "./mcol/index";
import tPagination from "./pagination/index";
import $penguin from "./function/index";
import tDate from "./date/index";
import tBacktop from "./backtop/index";
import tCollapse from "./collapse/index";
import tCollapseItem from "./collapse/item/index";
import tMenu from "./menu/index";
import tTabs from "./tabs/index";
import tSpace from "./Space/index";
import tPopover from './popover/index';
import tProgress from './progress/index';
import tColorPicker from './colorPicker/index';
import tBreadcrumb from './breadcrumb/index';
import tBadge from './badge/index';
import tDivider from './divider/index';
import tIcon from './icon/index';
import tAlert from './alert/index';
import tTag from './tag/index';
import tAvatar from './avatar/index';
import tCard from './card/index';
import tSkeleton from './skeleton/index';
import tEmpty from './empty/index';
import tTooltip from './tooltip/index';
import tRate from './rate/index'
import tInputNumber from './inputNumber/index'
import tSlider from './slider/index'
import tSteps, { tStep } from './steps/index'
import tTimeline, { tTimelineItem } from './timeline/index'
import tPopconfirm from './popconfirm/index'
import Notification from './notification/index'
import tForm, { tFormItem } from './form/index'
import tTimePicker from './timePicker/index'
import tCascader from './cascader/index'
import tCarousel, { tCarouselItem } from './carousel/index';
import tUpload from './upload/index';
import tResult from './result/index';
import tStatistic from './statistic/index';
import tAffix from './affix/index';
import tDatePicker from './datePicker/index';
import tTreeSelect from './treeSelect/index';
import tTransfer from './transfer/index';
import tAnchor from './anchor/index';
import tDescriptions, { tDescriptionsItem } from './descriptions/index';
import tCalendar from './calendar/index';
import tImage from './image/index';
import tSegmented from './segmented/index';
import tWatermark from './watermark/index';
import tFlex from './flex/index';
import tSplitter from './splitter/index';
import tResizable, { tResizableGroup } from './resizable/index';
import tDragMove from './dragMove/index';
import tAudioPlayer from './audioPlayer/index';
import tVideoPlayer from './videoPlayer/index';
import tChat from './chat/index';
import tList from './list/index';
import tInputOTP from './inputOtp/index';
import tTypography from './typography/index';
import tScrollbar from './scrollbar/index';
import tAutoComplete from './autoComplete/index';
import tMentions from './mentions/index';
import tFloatButton from './floatButton/index';
import tTour from './tour/index';
import tQrcode from './qrcode/index';
import tComment from './comment/index';
import tCountdown from './countdown/index';
import tPageHeader from './pageHeader/index';
import tConfigProvider from './configProvider/index';
import tVirtualList from './virtualList/index';
import tBubble from './bubble/index';
import tSignature from './signature/index';
import tImageViewer from './imageViewer/index';
import tCodeBlock from './codeBlock/index';
//存在所有组件
const components = [
  tButton,
  tInput,
  tTable,
  tSelect,
  tDropdown,
  tRadio,
  tCheckbox,
  tModal,
  tDrawer,
  tSwitch,
  tTree,
  tOptfile,
  tTextarea,
  tRow,
  tCol,
  tPagination,
  tDate,
  tBacktop,
  tCollapse,
  tCollapseItem,
  tMenu,
  tTabs,
  tSpace,
  tPopover,
  tProgress,
  tColorPicker,
  tBreadcrumb,
  tBadge,
  tDivider,
  tIcon,
  tAlert,
  tTag,
  tAvatar,
  tCard,
  tSkeleton,
  tEmpty,
  tTooltip,
  tRate,
  tInputNumber,
  tSlider,
  tSteps,
  tStep,
  tTimeline,
  tTimelineItem,
  tPopconfirm,
  tForm,
  tFormItem,
  tTimePicker,
  tCascader,
  tCarousel,
  tCarouselItem,
  tUpload,
  tResult,
  tStatistic,
  tAffix,
  tDatePicker,
  tTreeSelect,
  tTransfer,
  tAnchor,
  tDescriptions,
  tDescriptionsItem,
  tCalendar,
  tImage,
  tSegmented,
  tWatermark,
  tFlex,
  tSplitter,
  tResizable,
  tResizableGroup,
  tDragMove,
  tAudioPlayer,
  tVideoPlayer,
  tChat,
  tList,
  tInputOTP,
  tTypography,
  tScrollbar,
  tAutoComplete,
  tMentions,
  tFloatButton,
  tTour,
  tQrcode,
  tComment,
  tCountdown,
  tPageHeader,
  tConfigProvider,
  tVirtualList,
  tBubble,
  tSignature,
  tImageViewer,
  tCodeBlock
];
const install = (app) => {
  components.forEach((i) => {
    app.use(i)
  })
  app.config.globalProperties.$message = Message
  app.config.globalProperties.$Confirm = Confirm
  app.config.globalProperties.$Loading = Loading
  app.config.globalProperties.$penguin = $penguin
  app.config.globalProperties.$notification = Notification
}
const penguinUi = {
  version: PKG_VERSION,
  install
}
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export {
  // 导出的对象必须具有 install，才能被 app.use() 方法安装
  install,
  // 以下是具体的组件列表
  tButton,
  tInput,
  tTable,
  tSelect,
  tDropdown,
  tRadio,
  tCheckbox,
  Message,
  Confirm,
  tModal,
  tDrawer,
  Loading,
  tSwitch,
  tTree,
  tOptfile,
  tTextarea,
  tRow,
  tCol,
  tPagination,
  $penguin,
  tDate,
  tBacktop,
  tCollapse,
  tCollapseItem,
  tMenu,
  tTabs,
  tPopover,
  tSpace,
  tProgress,
  tColorPicker,
  tBreadcrumb,
  tBadge,
  tDivider,
  tIcon,
  tAlert,
  tTag,
  tAvatar,
  tCard,
  tSkeleton,
  tEmpty,
  tTooltip,
  tRate,
  tInputNumber,
  tSlider,
  tSteps,
  tStep,
  tTimeline,
  tTimelineItem,
  tPopconfirm,
  tForm,
  tFormItem,
  tTimePicker,
  tCascader,
  tCarousel,
  tCarouselItem,
  tUpload,
  tResult,
  tStatistic,
  tAffix,
  tDatePicker,
  tTreeSelect,
  tTransfer,
  tAnchor,
  tDescriptions,
  tDescriptionsItem,
  tCalendar,
  tImage,
  tSegmented,
  tWatermark,
  tFlex,
  tSplitter,
  tResizable,
  tResizableGroup,
  tDragMove,
  tAudioPlayer,
  tVideoPlayer,
  tChat,
  tList,
  tInputOTP,
  tTypography,
  tScrollbar,
  tAutoComplete,
  tMentions,
  tFloatButton,
  tTour,
  tQrcode,
  tComment,
  tCountdown,
  tPageHeader,
  tConfigProvider,
  tVirtualList,
  tBubble,
  tSignature,
  tImageViewer,
  tCodeBlock,
  Notification
}

// ---- 组合式工具函数 ----
export { useConfig } from './configProvider/config';
export { usePopper } from './use/usePopper';
export { highlight, highlightLines, normalizeLang } from './codeBlock/highlighter';
export { runRules, rulePresets } from './form/validate';
export { renderMarkdown, stripMarkdown } from './chat/markdown';

export default penguinUi
