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
  tIcon
];
const install = (app) => {
  components.forEach((i) => {
    app.use(i)
  })
  app.config.globalProperties.$message = Message
  app.config.globalProperties.$Confirm = Confirm
  app.config.globalProperties.$Loading = Loading
  app.config.globalProperties.$penguin = $penguin
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
  tIcon
}
export default penguinUi
