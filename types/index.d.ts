/**
 * PenguinUI 类型声明
 * ---------------------------------------------------------------------------
 * 覆盖：组件 Props、事件、实例方法、服务式 API（Message / Confirm / Loading /
 * Notification）、插件安装，以及 Volar 模板全局组件提示。
 */

import type { App, DefineComponent, Plugin } from 'vue';

/* =========================================================================
 * 通用类型
 * ========================================================================= */

/** 组件尺寸 */
export type ComponentSize = 'large' | 'default' | 'small' | 'mini';

/** 语义状态色 */
export type ComponentStatus = 'success' | 'warning' | 'error' | 'info' | 'primary';

/** 弹出层位置 */
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** 下拉选项（Select / Radio / Checkbox / Dropdown 等通用结构） */
export interface OptionItem {
  label?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  icon?: string;
  [key: string]: any;
}

/** 带 install 的组件类型 */
export type SFCWithInstall<T> = T & Plugin;

/* =========================================================================
 * 服务式 API
 * ========================================================================= */

export interface MessageOptions {
  /** 文本内容（也支持直接传字符串） */
  text?: string;
  /** 主题类型 */
  type?: 'success' | 'warning' | 'error' | 'info' | 'loading' | '';
  /** 自动关闭时间（毫秒），duration 的别名 */
  timeout?: number;
  /** 自动关闭时间（毫秒） */
  duration?: number;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 自定义图标类名 */
  icon?: string;
  textColor?: string;
  bgColor?: string;
  customClass?: string;
  /** 距顶部偏移（px），不传则按堆叠自动计算 */
  offset?: number;
}

/** 手动销毁函数 */
export type MessageDestroy = () => void;

export interface MessageApi {
  (options: MessageOptions | string): MessageDestroy | undefined;
}

export interface ConfirmOptions {
  title?: string;
  text?: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  /** 是否显示确认按钮 */
  confirmShow?: boolean;
  /** 是否显示取消按钮 */
  cancelShow?: boolean;
  /** 是否显示右上角关闭 */
  closeShow?: boolean;
  customClass?: string;
}

export interface LoadingOptions {
  text?: string;
  /** 挂载目标，CSS 选择器，默认 body */
  target?: string;
  /** 是否锁定滚动 */
  scrollLock?: boolean;
  /** 内置图标类名 */
  icon?: string;
  textColor?: string;
  bgColor?: string;
  showIcon?: boolean;
  /** 自定义图片地址 */
  img?: string;
}

export interface LoadingApi {
  show(options?: LoadingOptions): void;
  hide(): void;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'none';

export interface NotificationOptions {
  title?: string;
  message?: string;
  type?: NotificationType;
  /** 自动关闭时间，0 表示不自动关闭，默认 4500 */
  duration?: number;
  closable?: boolean;
  showIcon?: boolean;
  icon?: string;
  onClose?: (() => void) | null;
}

export interface NotificationHandle {
  close: () => void;
}

export interface NotificationApi {
  (options: NotificationOptions | string): NotificationHandle;
  success(options: NotificationOptions | string, extra?: Partial<NotificationOptions>): NotificationHandle;
  warning(options: NotificationOptions | string, extra?: Partial<NotificationOptions>): NotificationHandle;
  error(options: NotificationOptions | string, extra?: Partial<NotificationOptions>): NotificationHandle;
  info(options: NotificationOptions | string, extra?: Partial<NotificationOptions>): NotificationHandle;
  close(id: number): void;
}

export interface PenguinTools {
  /** 日期格式化，占位符：yyyy / MM / dd / hh / mm / ss */
  formatDate(date: Date, fmt: string): string;
  /** 日期字符串转时间戳（兼容 iOS 的 `-` → `/`） */
  formatTime(strtime: string): number;
}

/* =========================================================================
 * 组件 Props
 * ========================================================================= */

export interface ButtonProps {
  type?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'text';
  size?: ComponentSize;
  disabled?: boolean;
  round?: boolean;
  plain?: boolean;
  circle?: boolean;
  block?: boolean;
  loading?: boolean;
  icon?: string;
  leftIcon?: string;
  rightIcon?: string;
  nativeType?: 'button' | 'submit' | 'reset';
  custotColor?: string;
  customColor?: string;
  localing?: boolean;
}

export interface InputProps {
  modelValue?: string | number;
  type?: string;
  size?: ComponentSize;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  maxlength?: number;
  showWordLimit?: boolean;
  status?: '' | 'success' | 'warning' | 'error';
  autofocus?: boolean;
  focusColor?: string;
  form?: string;
}

export interface TextareaProps {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  maxlength?: number;
  focusColor?: string;
  customClass?: string;
  form?: string;
}

export interface InputNumberProps {
  modelValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  controls?: boolean;
  size?: ComponentSize;
  placeholder?: string;
  name?: string;
}

export interface SelectProps {
  modelValue?: string | number | Array<string | number>;
  options?: OptionItem[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  width?: string | number;
  height?: string | number;
  labelFiled?: string;
  valueFiled?: string;
  customClass?: string;
}

export interface CheckboxProps {
  modelValue?: Array<string | number>;
  options?: OptionItem[];
  size?: ComponentSize;
  labelFiled?: string;
  valueFiled?: string;
  inline?: boolean;
  custotColor?: string;
  customClass?: string;
}

export interface RadioProps {
  modelValue?: string | number;
  options?: OptionItem[];
  size?: ComponentSize;
  labelFiled?: string;
  valueFiled?: string;
  inline?: boolean;
  custotColor?: string;
  customClass?: string;
}

export interface SwitchProps {
  modelValue?: boolean;
  width?: number | string;
  activeColor?: string;
  closeColor?: string;
  activeText?: string;
  closeText?: string;
  textAlign?: 'left' | 'right';
  showTipsText?: boolean;
  disabled?: boolean;
  customClass?: string;
}

export interface TagProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'default' | 'large';
  effect?: 'light' | 'dark' | 'plain';
  round?: boolean;
  bordered?: boolean;
  closable?: boolean;
  clickable?: boolean;
  checkable?: boolean;
  checked?: boolean;
  disabled?: boolean;
  icon?: string;
  dot?: boolean;
  color?: string;
}

export interface AlertProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  showIcon?: boolean;
  closable?: boolean;
  center?: boolean;
  effect?: 'light' | 'dark';
  round?: boolean;
}

export interface BadgeProps {
  value?: string | number;
  max?: number;
  dot?: boolean;
  hidden?: boolean;
  type?: ComponentStatus;
  showZero?: boolean;
}

export interface AvatarProps {
  size?: number | 'large' | 'default' | 'small';
  shape?: 'circle' | 'square';
  src?: string;
  alt?: string;
  icon?: string;
  text?: string;
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  bgColor?: string;
  color?: string;
  bordered?: boolean;
}

export interface DividerProps {
  position?: 'left' | 'center' | 'right';
  direction?: 'horizontal' | 'vertical';
  lineStyle?: string;
  color?: string;
}

export interface ProgressProps {
  percent?: number;
  progressType?: 'line' | 'circle';
  progressHeight?: number;
  circleSize?: number;
  circleHeight?: number;
  isShowText?: boolean;
  currentStatus?: 'success' | 'warning' | 'error';
  bgColor?: string;
  progressSpeed?: number;
  isAnimation?: boolean;
  roundCorner?: boolean;
  setPercentText?: string;
}

export interface RateProps {
  modelValue?: number;
  count?: number;
  allowHalf?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  size?: number;
  color?: string;
  voidColor?: string;
  showText?: boolean;
  texts?: string[];
}

export interface SliderProps {
  modelValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  disabled?: boolean;
  showInput?: boolean;
  showStops?: boolean;
  marks?: Record<string | number, string | { style?: Record<string, string>; label?: string }>;
  vertical?: boolean;
  height?: string | number;
  formatTooltip?: (value: number) => string;
}

export interface StepsProps {
  active?: number;
  direction?: 'horizontal' | 'vertical';
  alignCenter?: boolean;
  finishStatus?: 'success' | 'finish';
}

export interface StepProps {
  title?: string;
  description?: string;
  icon?: string;
  status?: 'wait' | 'process' | 'finish' | 'error' | 'success';
}

export interface TimelineProps {
  reverse?: boolean;
}

export interface TimelineItemProps {
  timestamp?: string;
  placement?: 'top' | 'bottom';
  color?: string;
  icon?: string;
  hollow?: boolean;
  size?: 'normal' | 'large';
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

/** 单条校验规则 */
export interface FormRule {
  required?: boolean;
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'email' | 'url' | 'date';
  pattern?: RegExp | string;
  /** 数字→值域；字符串/数组→长度 */
  min?: number;
  max?: number;
  /** 精确长度 */
  len?: number;
  /** 枚举白名单 */
  enum?: Array<string | number | boolean>;
  /** 触发时机，不写则任何时机都校验 */
  trigger?: 'blur' | 'change' | Array<'blur' | 'change'>;
  /** 校验前对值做转换 */
  transform?: (value: any) => any;
  /** 自定义校验，返回 true / 字符串错误 / Error / Promise */
  validator?: (
    rule: FormRule,
    value: any,
    model: Record<string, any>
  ) => boolean | string | Error | void | Promise<boolean | string | Error | void>;
  message?: string;
  /** 用于 min/max 报错时的字段名 */
  label?: string;
}

export interface FormProps {
  model?: Record<string, any>;
  rules?: Record<string, FormRule[] | FormRule>;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'right' | 'top';
  inline?: boolean;
  disabled?: boolean;
  showMessage?: boolean;
  /** 校验失败时滚动到第一个错误字段 */
  scrollToError?: boolean;
  /** 滚动偏移量 */
  scrollOffset?: number;
}

export interface FormItemProps {
  prop?: string;
  label?: string;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'right' | 'top';
  required?: boolean;
  rules?: FormRule[] | FormRule;
  showMessage?: boolean;
  /** 手动错误信息，优先级最高 */
  error?: string;
  /** 触发校验时机 */
  validateTrigger?: 'blur' | 'change' | Array<'blur' | 'change'>;
  showStatus?: boolean;
}

/** validate() 失败时 reject 的错误对象 */
export interface FormValidateError extends Error {
  isValidateError: true;
  message: string;
  fields: Array<{
    prop: string;
    errors: string[];
    element: HTMLElement | null;
  }>;
}

export interface FormInstance {
  /** 校验全部字段；通过 resolve(true)，失败 reject FormValidateError */
  validate(): Promise<true>;
  /** 校验全部字段但不抛异常 */
  validateQuietly(): Promise<boolean>;
  validateField(prop: string | string[]): Promise<
    Array<{ prop: string; valid: boolean; errors: string[] }>
  >;
  resetFields(): void;
  clearValidate(props?: string | string[]): void;
  setInitialValues(model: Record<string, any>): void;
  submit(): Promise<boolean>;
  fields: import('vue').ComputedRef<Array<{ prop: string }>>;
  el: import('vue').Ref<HTMLElement | null>;
}

/** 规则预设 */
export declare const rulePresets: {
  required(label?: string, trigger?: 'blur' | 'change'): FormRule;
  email(trigger?: 'blur' | 'change'): FormRule;
  phone(trigger?: 'blur' | 'change'): FormRule;
  url(trigger?: 'blur' | 'change'): FormRule;
  range(min: number, max: number, label?: string): FormRule;
};

/** 独立运行的规则校验函数 */
export declare function runRules(
  value: any,
  rules: FormRule[] | FormRule,
  model?: Record<string, any>
): Promise<string[]>;

export interface UploadProps {
  modelValue?: UploadFile[];
  action?: string;
  httpRequest?: (options: any) => any;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  drag?: boolean;
  autoUpload?: boolean;
  listType?: 'text' | 'picture';
  limit?: number;
  maxSize?: number;
  name?: string;
  headers?: Record<string, string>;
  data?: Record<string, any>;
  withCredentials?: boolean;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
}

export interface UploadFile {
  name?: string;
  url?: string;
  status?: 'ready' | 'uploading' | 'success' | 'error';
  percentage?: number;
  size?: number;
  uid?: number | string;
  raw?: File;
  [key: string]: any;
}

export interface UploadInstance {
  submit(): void;
  clearFiles(): void;
  abort(file?: UploadFile): void;
}

/** 表格列定义 */
export interface TableColumn {
  field: string;
  title: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  /** 该列可排序 */
  sortable?: boolean;
  /** 自定义排序取值 */
  sorter?: (row: Record<string, any>) => any;
  /** 排序方向顺序 */
  sortDirections?: Array<'asc' | 'desc'>;
  /** 该列筛选项 */
  filters?: Array<{ label?: string; value: any }>;
}

export interface TableProps {
  options?: {
    fileds: TableColumn[];
    datas: Array<Record<string, any>>;
  };
  size?: ComponentSize;
  showHeader?: boolean;
  headStyle?: Record<string, string>;
  rowStyle?: Record<string, string>;
  customClass?: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;

  /* v1.16 新增 */
  selectable?: boolean;
  selectedKeys?: Array<string | number>;
  rowKeyField?: string;
  striped?: boolean;
  bordered?: boolean;
  fixedHeader?: boolean;
  maxHeight?: string | number;
  showToolbar?: boolean;
  pagination?: boolean;
  page?: number;
  pageSize?: number;
  clickableRow?: boolean;
}

export interface TableInstance {
  clearSelection(): void;
  goPage(page: number): void;
}

export interface ImageViewerItem {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ImageViewerProps {
  modelValue?: boolean;
  images?: Array<ImageViewerItem | string>;
  current?: number;
  step?: number;
  minScale?: number;
  maxScale?: number;
  maskClosable?: boolean;
  showThumbnails?: boolean;
  downloadable?: boolean;
  caption?: string;
  zIndex?: number | string;
}

export interface ImageViewerInstance {
  zoomBy(delta: number): void;
  rotateBy(deg: number): void;
  reset(): void;
  prev(): void;
  next(): void;
  goTo(index: number): void;
  close(): void;
}

export type CodeLang =
  | 'js' | 'javascript' | 'jsx'
  | 'ts' | 'typescript' | 'tsx'
  | 'vue' | 'html' | 'xml'
  | 'css' | 'scss' | 'less'
  | 'json' | 'bash' | 'sh' | 'shell'
  | string;

export interface CodeBlockProps {
  code?: string;
  lang?: CodeLang;
  title?: string;
  theme?: 'dark' | 'light';
  lineNumbers?: boolean;
  showHeader?: boolean;
  copyable?: boolean;
  copyText?: string;
  copiedText?: string;
  collapsible?: boolean;
  collapseHeight?: number;
  expandText?: string;
  collapseText?: string;
  maxHeight?: string | number;
  customClass?: string;
}

export interface CodeBlockInstance {
  copy(): void;
}

/** 语法高亮工具函数 */
export declare function highlight(code: string, lang?: string): string;
export declare function highlightLines(code: string, lang?: string): string[];
export declare function normalizeLang(lang: string): string;

export interface ModalProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  top?: string | number;
  align?: 'top' | 'center';
  showClose?: boolean;
  closeOnModal?: boolean;
  scrollLock?: boolean;
  customClass?: string;
}

export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  height?: string | number;
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt';
  closeOnModal?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showClose?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmShow?: boolean;
  cancelShow?: boolean;
  customClass?: string;
}

export interface TabsProps {
  modelValue?: string | number;
  activeName?: string | number;
  type?: '' | 'card' | 'border-card';
  color?: string;
  active_color?: string;
  addable?: boolean;
  closable?: boolean;
  beforeLeave?: () => boolean | Promise<boolean>;
}

export interface MenuOption {
  title?: string;
  icon?: string;
  index?: string;
  children?: MenuOption[];
  [key: string]: any;
}

export interface MenuProps {
  options?: MenuOption[];
  theme?: 'light' | 'dark';
  type?: string;
}

export interface TreeNode {
  label?: string;
  value?: string | number;
  /** 节点唯一标识，不传则按路径自动生成（如 '0-2-1'） */
  key?: string | number;
  children?: TreeNode[];
  disabled?: boolean;
  /** 异步加载场景写 false 表示「还有子节点未加载」 */
  isLeaf?: boolean;
  [key: string]: any;
}

export interface TreeProps {
  options?: TreeNode[];
  /** 标签字段名 */
  labelField?: string;
  /** 标签字段名（旧写法） */
  labelFiled?: string;
  /** 子节点字段名 */
  childrenField?: string;
  /** 禁用字段名 */
  disabledField?: string;

  /** 开启复选框（与 multiple 等价） */
  checkable?: boolean;
  /** 已勾选的节点 key（v-model） */
  modelValue?: Array<string | number>;
  /** 高亮选中的节点 key（v-model:selected） */
  selected?: Array<string | number>;
  /** 父子勾选不联动 */
  checkStrictly?: boolean;
  /** 只允许勾选叶子节点 */
  onlyLeafCheckable?: boolean;
  /** 无复选框时的单选圆点 */
  selectable?: boolean;

  /** 是否可勾选（旧写法，等价 checkable） */
  multiple?: boolean;
  defaultOpenNodes?: Array<string | number>;
  defaultSelectNodes?: Array<string | number>;

  /** 图标 */
  icon?: string;
  openedIcon?: string;
  leafIcon?: string;
  /** 每层缩进（px） */
  indent?: number;

  /** 搜索过滤 */
  filterable?: boolean;
  filterPlaceholder?: string;
  expandOnFilter?: boolean;
  /** 展开 / 收起全部工具栏 */
  showToolbar?: boolean;

  /** 异步加载 */
  lazy?: boolean;
  loadData?: (node: TreeNode) => Promise<TreeNode[]>;

  emptyText?: string;
  maxHeight?: string | number;
  disabled?: boolean;
  customClass?: string;
}

export interface TreeInstance {
  expandAll(): void;
  collapseAll(): void;
  expand(key: string | number): void;
  getCheckedKeys(): Array<string | number>;
  setCheckedKeys(keys: Array<string | number>): void;
  getFlatNodes(): Array<Record<string, any>>;
}

/** Tree 勾选变化事件负载 */
export interface TreeCheckPayload {
  key: string;
  checked: boolean;
  keys: string[];
  nodes: TreeNode[];
}

/** Tree 展开变化事件负载 */
export interface TreeExpandPayload {
  key: string;
  expanded: boolean;
  node?: TreeNode;
}

export interface TreeSelectProps {
  modelValue?: string | number | Array<string | number>;
  options?: TreeNode[];
  multiple?: boolean;
  filterable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: ComponentSize;
}

export interface TransferProps {
  data?: Array<{ key: string | number; label: string; disabled?: boolean }>;
  modelValue?: Array<string | number>;
  titles?: [string, string];
  filterable?: boolean;
  disabled?: boolean;
}

export interface DatePickerProps {
  modelValue?: string | number | Date | [any, any];
  type?: 'date' | 'month' | 'year';
  range?: boolean;
  showTime?: boolean;
  format?: string;
  valueFormat?: string;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  disabledDate?: (date: Date) => boolean;
}

export interface TimePickerProps {
  modelValue?: string;
  format?: string;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
}

export interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
  /** 异步加载场景写 false 表示「还有子节点未加载」 */
  isLeaf?: boolean;
  [key: string]: any;
}

/** 单选路径 */
export type CascaderPath = Array<string | number>;

export interface CascaderProps {
  /**
   * 单选：一条路径 ['zj','hz']
   * 多选：路径数组 [['zj','hz'],['fj','xm']]
   */
  modelValue?: CascaderPath | CascaderPath[];
  options?: CascaderOption[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  separator?: string;
  changeOnSelect?: boolean;

  /* v1.19 新增 */
  /** 多选 */
  multiple?: boolean;
  /** 父子勾选不联动（多选生效） */
  checkStrictly?: boolean;
  /** 多选最多显示的标签数 */
  maxTagCount?: number;
  /** 标签展示策略 */
  showCheckedStrategy?: 'leaf' | 'parent';

  /** 搜索 */
  filterable?: boolean;
  filterPlaceholder?: string;
  noResultText?: string;

  /** 异步加载子节点 */
  lazyLoad?: (node: CascaderOption) => Promise<CascaderOption[]>;

  /** 字段名自定义 */
  valueField?: string;
  labelField?: string;
  childrenField?: string;
  disabledField?: string;
  isLeafField?: string;
}

export interface CascaderInstance {
  open(): void;
  close(): void;
  clear(): void;
  getCheckedPaths(): CascaderPath[];
}

export interface PaginationProps {
  total?: number;
  current?: number;
  pageSize?: number;
  pagerCount?: number;
  maxSize?: number;
  align?: 'left' | 'center' | 'right';
  prevText?: string;
  nextText?: string;
  disabled?: boolean;
  activeColors?: string;
  border?: boolean;
  size?: ComponentSize;
  showTotal?: boolean;
  jumper?: boolean;
  moreStep?: number;
  hideOnSinglePage?: boolean;
}

export interface CarouselProps {
  height?: string | number;
  autoplay?: boolean;
  interval?: number;
  arrow?: 'hover' | 'always' | 'never';
  indicator?: 'always' | 'hover' | 'never';
  /** 指示器形态：dot 圆点 / line 短横线 / progress 填充进度 / number 数字 */
  indicatorType?: 'dot' | 'line' | 'progress' | 'number';
  direction?: 'horizontal' | 'vertical';
  initialIndex?: number;
  pauseOnHover?: boolean;
}

export interface CollapseProps {
  modelValue?: Array<string | number> | string | number;
  accordion?: boolean;
  borderless?: boolean;
}

export interface CollapseItemProps {
  title?: string;
  name?: string | number;
  disabled?: boolean;
}

export interface DescriptionsProps {
  column?: number;
  direction?: 'horizontal' | 'vertical';
  border?: boolean;
  size?: ComponentSize;
  labelWidth?: string | number;
  labelAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  title?: string;
  extra?: string;
  gutter?: number;
}

export interface DescriptionsItemProps {
  label?: string;
  span?: number;
  labelWidth?: string | number;
}

export interface ResultProps {
  status?: 'success' | 'error' | 'warning' | 'info' | '403' | '404' | '500';
  title?: string;
  subTitle?: string;
  icon?: string;
}

export interface StatisticProps {
  value?: number | string;
  title?: string;
  precision?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  groupSeparator?: string;
  decimalSeparator?: string;
  valueStyle?: Record<string, string>;
  countUp?: boolean;
  duration?: number;
  formatter?: (value: number | string) => string;
}

export interface EmptyProps {
  description?: string;
  imageSize?: number;
}

export interface SkeletonProps {
  loading?: boolean;
  rows?: number;
  animated?: boolean;
  avatar?: boolean;
  avatarShape?: 'circle' | 'square';
  title?: boolean;
  widths?: Array<string | number>;
}

export interface TooltipProps {
  content?: string;
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  visible?: boolean;
  disabled?: boolean;
  dark?: boolean;
  delay?: number;
  maxWidth?: string | number;
  showArrow?: boolean;
  offset?: number;
}

export interface PopoverProps {
  modelValue?: boolean;
  title?: string;
  content?: string;
  width?: string | number;
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  popperClass?: string;
  transition?: string;
  disabled?: boolean;
}

export interface PopconfirmProps {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: string;
  icon?: string;
  placement?: Placement;
  disabled?: boolean;
}

export interface CalendarProps {
  modelValue?: string | number | Date;
  firstDayOfWeek?: 0 | 1;
  showToday?: boolean;
  disabledDate?: (date: Date) => boolean;
  size?: ComponentSize;
}

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  round?: boolean;
  radius?: string | number;
  lazy?: boolean;
  preview?: boolean;
  previewSrcList?: string[];
  initialIndex?: number;
  zIndex?: number;
  closeOnClickMask?: boolean;
}

export interface SegmentedOption {
  label?: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

export interface SegmentedProps {
  modelValue?: string | number;
  options?: Array<SegmentedOption | string | number>;
  size?: ComponentSize;
  block?: boolean;
  disabled?: boolean;
}

export interface AffixProps {
  offsetTop?: number;
  offsetBottom?: number;
  target?: string;
  zIndex?: number;
}

export interface AffixInstance {
  update(): void;
}

export interface AnchorLink {
  href: string;
  title: string;
  children?: AnchorLink[];
}

export interface AnchorProps {
  links?: AnchorLink[];
  offsetTop?: number;
  bounds?: number;
  container?: string;
}

export interface BreadcrumbProps {
  separator?: string;
  separatorIcon?: string;
  gap?: number;
}

export interface BreadcrumbItemProps {
  to?: string | Record<string, any>;
  replace?: boolean;
  target?: string;
}

export interface CardProps {
  title?: string;
  shadow?: 'always' | 'hover' | 'never';
  bordered?: boolean;
  bodyStyle?: Record<string, string>;
  hoverable?: boolean;
}

export interface SpaceProps {
  size?: 'small' | 'default' | 'large' | number | [number, number];
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  fill?: boolean;
}

export interface RowProps {
  gutter?: number;
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  align?: 'top' | 'middle' | 'bottom';
}

export interface ColProps {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
}

export interface ColorPickerProps {
  modelValue?: string;
  defaultColor?: string;
  disabled?: boolean;
  size?: 'default' | 'small';
  clearable?: boolean;
  showAlpha?: boolean;
  predefine?: string[];
  placement?: 'bottom-start' | 'bottom' | 'bottom-end';
  autoClose?: boolean;
  customClass?: string;
}

export interface ColorPickerInstance {
  open(): void;
  close(): void;
  toggle(): void;
}

export interface DropdownOption extends OptionItem {
  divided?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  modelValue?: string | number;
  title?: string;
  trigger?: 'hover' | 'click';
  options?: DropdownOption[];
  size?: 'default' | 'small' | 'mini';
  customClass?: string;
  icon?: string;
  placement?: 'bottom-start' | 'bottom' | 'bottom-end';
  disabled?: boolean;
  hideOnClick?: boolean;
  maxHeight?: number | string;
}

export interface DropdownInstance {
  open(): void;
  close(): void;
  toggle(): void;
}

export interface IconProps {
  name?: string;
  size?: string | number;
  color?: string;
  spin?: boolean;
  rotate?: number;
  flip?: 'horizontal' | 'vertical';
  pulse?: boolean;
  title?: string;
}

export interface BacktopProps {
  target?: string;
  visibilityHeight?: number;
  right?: number;
  bottom?: number;
  fixed?: boolean;
  customClass?: string;
}

export interface OptfileProps {
  accept?: string;
  multiple?: boolean;
  type?: string;
  label?: string;
  size?: ComponentSize;
  targetType?: string;
  icon?: string;
  fileList?: any[];
  drop?: boolean;
  customClass?: string;
  showFileList?: boolean;
  imgListShow?: boolean;
}

export interface DateProps {
  modelValue?: string;
  size?: ComponentSize;
  disabled?: boolean;
  placeholder?: string;
  format?: string;
  clearable?: boolean;
  type?: 'date' | 'month' | 'year';
  showToday?: boolean;
  startDate?: string;
  endDate?: string;
  customClass?: string;
  customActiveColor?: string;
  form?: string;
}

export interface WatermarkProps {
  content?: string | string[];
  image?: string;
  width?: number;
  height?: number;
  gapX?: number;
  gapY?: number;
  rotate?: number;
  opacity?: number;
  fontColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  imageWidth?: number;
  imageHeight?: number;
  zIndex?: number;
  customClass?: string;
}

export interface FlexProps {
  as?: string;
  vertical?: boolean;
  wrap?: boolean;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  gap?: number | string;
  inline?: boolean;
}

export interface SplitterProps {
  modelValue?: number;
  direction?: 'horizontal' | 'vertical';
  min?: number;
  max?: number;
  barSize?: number;
  disabled?: boolean;
  height?: number | string;
  customClass?: string;
}

/* =========================================================================
 * Resizable 伸缩框
 * ========================================================================= */

export type ResizableHandle =
  | 'top' | 'right' | 'bottom' | 'left'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type ResizableHandlesMode =
  | 'all' | 'horizontal' | 'vertical' | 'corner'
  | ResizableHandle[];

export interface ResizePayload {
  width: number;
  height: number;
  dir: ResizableHandle;
}

export interface ResizableProps {
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  handles?: ResizableHandlesMode;
  /** 拖拽步长（px） */
  grid?: number;
  aspectRatio?: boolean;
  ratio?: number;
  disabled?: boolean;
  customClass?: string;
}

export interface ResizableInstance {
  setSize(width?: number, height?: number): void;
  getSize(): { width: number; height: number };
}

export interface ResizableGroupProps {
  /** 各面板占比数组，长度即面板数量 */
  defaultSizes?: number[];
  direction?: 'horizontal' | 'vertical';
  minSize?: number;
  maxSize?: number;
  size?: number | string;
  dividerSize?: number;
  disabled?: boolean;
}

/* =========================================================================
 * DragMove 拖拽移动
 * ========================================================================= */

export type DragBounds =
  | 'parent'
  | 'viewport'
  | string
  | (() => { left: number; top: number; right: number; bottom: number });

export interface DragMoveProps {
  x?: number;
  y?: number;
  defaultX?: number;
  defaultY?: number;
  bounds?: DragBounds;
  /** 只有匹配该选择器的元素能触发拖拽 */
  trigger?: string;
  grid?: number;
  preventSelect?: boolean;
  disabled?: boolean;
  raiseOnDrag?: boolean;
  customClass?: string;
}

export interface DragMoveInstance {
  reset(): void;
  moveTo(x: number, y: number): void;
  getPosition(): { x: number; y: number };
}

/* =========================================================================
 * AudioPlayer 音频播放器
 * ========================================================================= */

export interface AudioPlayerProps {
  src?: string;
  title?: string;
  subtitle?: string;
  cover?: string;
  variant?: 'default' | 'mini' | 'card';
  autoplay?: boolean;
  loop?: boolean;
  loopable?: boolean;
  volume?: number;
  showVolume?: boolean;
  rates?: number[];
  playbackRate?: number;
  downloadable?: boolean;
  downloadName?: string;
  disabled?: boolean;
}

export interface AudioPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  rate: number;
}

export interface AudioPlayerInstance {
  play(): Promise<void>;
  pause(): void;
  seek(seconds: number): void;
  getState(): AudioPlayerState;
}

/* =========================================================================
 * VideoPlayer 视频播放器
 * ========================================================================= */

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  /** 宽高比，如 '16 / 9' */
  aspectRatio?: string;
  width?: number | string;
  preload?: 'none' | 'metadata' | 'auto';
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  showVolume?: boolean;
  rates?: number[];
  playbackRate?: number;
  /** 控制栏自动隐藏延时（ms），0 常驻 */
  controlsTimeout?: number;
  pip?: boolean;
}

export interface VideoPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  rate: number;
  fullscreen: boolean;
}

export interface VideoPlayerInstance {
  play(): Promise<void>;
  pause(): void;
  seek(seconds: number): void;
  toggleFullscreen(): Promise<void>;
  getState(): VideoPlayerState;
}

/* =========================================================================
 * Chat 对话
 * ========================================================================= */

export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessageStatus = 'streaming' | 'done' | 'error';

export interface ChatMessage {
  id?: string | number;
  role: ChatRole;
  content: string;
  avatar?: string;
  name?: string;
  time?: string;
  status?: ChatMessageStatus;
  /** 单条消息覆盖全局 markdown 设置 */
  markdown?: boolean;
  /** 消息内图片：字符串 URL 或 { url, name } */
  images?: Array<string | { url: string; name?: string }>;
}

export interface ChatProps {
  messages?: ChatMessage[];
  modelValue?: string;
  variant?: 'default' | 'compact' | 'plain';
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxlength?: number;
  sendOn?: 'enter' | 'ctrl-enter';
  markdown?: boolean;
  /** 允许 Markdown 原始 HTML（有 XSS 风险，默认关闭） */
  allowHtml?: boolean;
  showAvatar?: boolean;
  showActions?: boolean;
  userAvatar?: string;
  assistantAvatar?: string;
  userLabel?: string;
  assistantLabel?: string;
  emptyTitle?: string;
  emptyHint?: string;
  quickPrompts?: Array<string | { label: string; value?: string }>;
  clearable?: boolean;
  regenerable?: boolean;
  hasMore?: boolean;
  showDisclaimer?: boolean;
  disclaimer?: string;
  /** 是否允许发送图片 */
  allowImage?: boolean;
  /** 单次最多图片数 */
  maxImages?: number;
  /** 单张图片大小上限（MB） */
  maxImageSize?: number;
  /** 单张图片最大边长（px），超出会等比压缩 */
  maxImageEdge?: number;
}

export interface ChatInstance {
  scrollToBottom(smooth?: boolean): void;
  focus(): void;
  getDraft(): string;
}

/** 零依赖的 Markdown 渲染器 */
export declare function renderMarkdown(
  markdown: string,
  options?: { allowHtml?: boolean }
): string;

/** 去掉 Markdown 标记，返回纯文本 */
export declare function stripMarkdown(markdown: string): string;

export interface ListProps {
  data?: any[];
  bordered?: boolean;
  split?: boolean;
  size?: 'small' | 'default' | 'large';
  header?: string;
  footer?: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  customClass?: string;
}

export interface InputOTPProps {
  modelValue?: string;
  length?: number;
  separator?: string | number;
  mask?: boolean;
  disabled?: boolean;
  size?: 'small' | 'default' | 'large';
  status?: '' | 'error' | 'success';
  numberOnly?: boolean;
  autofocus?: boolean;
  customClass?: string;
}

export interface InputOTPInstance {
  focus(): void;
  clear(): void;
}

export interface TypographyProps {
  text?: string | number;
  tag?: string;
  /** 标题级别，只接受 1-5，0 表示不是标题 */
  level?: 0 | 1 | 2 | 3 | 4 | 5;
  type?: '' | 'brand' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: string | number;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  code?: boolean;
  mark?: boolean;
  disabled?: boolean;
  block?: boolean;
  ellipsis?: boolean | number | { rows?: number; expandable?: boolean };
  rows?: number;
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  copyable?: boolean;
  copyText?: string;
  copyTips?: string;
  copiedTips?: string;
  href?: string;
  target?: string;
  customClass?: string;
}

export interface TypographyInstance {
  copy(): Promise<void>;
  toggleExpand(): void;
}

export interface ScrollbarProps {
  height?: number | string;
  maxHeight?: number | string;
  native?: boolean;
  size?: number;
  always?: boolean;
  minSize?: number;
  wrapClass?: string;
  wrapStyle?: Record<string, any> | string;
  viewClass?: string;
  viewStyle?: Record<string, any> | string;
  noresize?: boolean;
}

export interface ScrollbarInstance {
  update(): void;
  scrollTo(options: ScrollToOptions | number, y?: number): void;
  setScrollTop(value: number): void;
  setScrollLeft(value: number): void;
}

export interface AutoCompleteOption {
  label?: string | number;
  value?: string | number;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

export interface AutoCompleteProps {
  modelValue?: string | number;
  options?: Array<AutoCompleteOption | string | number>;
  placeholder?: string;
  size?: 'large' | 'default' | 'small';
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  prefixIcon?: string;
  loading?: boolean;
  emptyText?: string;
  maxHeight?: number | string;
  minChars?: number;
  triggerOnFocus?: boolean;
  filterable?: boolean;
  filterMethod?: ((query: string, option: AutoCompleteOption) => boolean) | null;
  highlight?: boolean;
  placement?: 'bottom-start' | 'bottom' | 'bottom-end';
  maxlength?: number | string;
  customClass?: string;
}

export interface AutoCompleteInstance {
  focus(): void;
  blur(): void;
  open(): void;
  close(): void;
}

export interface MentionOption {
  label?: string;
  value?: string | number;
  description?: string;
  avatar?: string;
  disabled?: boolean;
}

export interface MentionsProps {
  modelValue?: string;
  options?: Array<MentionOption | string>;
  prefix?: string;
  split?: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  filterable?: boolean;
  emptyText?: string;
  maxlength?: number | string;
  showCount?: boolean;
  customClass?: string;
}

export interface MentionsInstance {
  focus(): void;
  blur(): void;
  close(): void;
}

export interface FloatButtonProps {
  icon?: string;
  label?: string;
  type?: 'default' | 'primary';
  shape?: 'circle' | 'square';
  size?: 'small' | 'default' | 'large';
  badge?: number | string;
  dot?: boolean;
  fixed?: boolean;
  right?: number | string;
  bottom?: number | string;
  zIndex?: number | string;
  href?: string;
  target?: string;
  tooltip?: string;
  disabled?: boolean;
  customClass?: string;
}

export interface TourStep {
  target?: string | Element | (() => Element | null) | any;
  title?: string;
  description?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
}

export interface TourProps {
  modelValue?: boolean;
  steps?: TourStep[];
  current?: number | null;
  mask?: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  showIndicator?: boolean;
  gap?: number;
  zIndex?: number | string;
  scrollIntoView?: boolean;
  nextText?: string;
  prevText?: string;
  finishText?: string;
  customClass?: string;
}

export interface TourInstance {
  next(): void;
  prev(): void;
  goTo(index: number): void;
  close(): void;
  update(): void;
}

export interface QrcodeProps {
  value?: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  color?: string;
  bgColor?: string;
  padding?: number | string;
  type?: 'rect' | 'round';
  logo?: string;
  logoScale?: number;
  title?: string;
  description?: string;
  status?: '' | 'loading' | 'expired';
  statusText?: string;
  disabled?: boolean;
  customClass?: string;
}

export interface QrcodeInstance {
  refresh(): void;
  generate(): void;
}

export interface CommentAction {
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface CommentProps {
  author?: string;
  avatar?: string;
  avatarSize?: number | string;
  datetime?: string;
  content?: string;
  actions?: CommentAction[];
  collapsedText?: string;
  nested?: boolean;
  customClass?: string;
}

export interface CountdownProps {
  value?: Date | number | string;
  format?: string;
  separator?: string;
  unitLabel?: boolean;
  pad?: boolean;
  finishText?: string;
  fontSize?: number | string;
  color?: string;
  bordered?: boolean;
  customClass?: string;
}

export interface CountdownInstance {
  start(): void;
  stop(): void;
}

export interface PageHeaderCrumb {
  title: string;
  path?: string;
}

export interface PageHeaderProps {
  title?: string;
  subTitle?: string;
  showBack?: boolean;
  backText?: string;
  breadcrumb?: PageHeaderCrumb[];
  extra?: string;
  ghost?: boolean;
  compact?: boolean;
  customClass?: string;
}

/** ConfigProvider 配置结构 */
export interface PenguinConfig {
  size?: 'large' | 'default' | 'small';
  primaryColor?: string;
  radius?: number | string;
  theme?: 'light' | 'dark';
  emptyText?: string;
  loadingText?: string;
  pageSize?: number;
  pageSizes?: number[];
  validateMessagePlacement?: Placement;
  dateFormat?: string;
  [key: string]: any;
}

export interface ConfigProviderProps {
  size?: '' | 'large' | 'default' | 'small';
  primaryColor?: string;
  radius?: number | string;
  theme?: '' | 'light' | 'dark';
  emptyText?: string;
  loadingText?: string;
  pageSize?: number;
  pageSizes?: number[];
  dateFormat?: string;
  config?: Partial<PenguinConfig>;
}

/** useConfig() 的返回值 */
export interface UseConfigReturn {
  config: import('vue').ComputedRef<PenguinConfig>;
  size: import('vue').ComputedRef<string>;
  theme: import('vue').ComputedRef<string>;
  primaryColor: import('vue').ComputedRef<string>;
}

export interface VirtualListProps {
  data?: any[];
  itemHeight?: number | string;
  height?: number | string;
  buffer?: number;
  itemKey?: string;
  emptyText?: string;
  distance?: number;
  customClass?: string;
}

export interface VirtualListInstance {
  scrollToIndex(index: number): void;
  scrollToTop(): void;
  scrollToBottom(): void;
}

export interface BubbleProps {
  content?: string;
  placement?: 'left' | 'right';
  variant?: 'filled' | 'outlined' | 'text';
  maxWidth?: number | string;
  bgColor?: string;
  textColor?: string;
  loading?: boolean;
  avatar?: string;
  avatarSize?: number | string;
  name?: string;
  time?: string;
  customClass?: string;
}

export interface SignatureProps {
  width?: number | string;
  height?: number | string;
  penColor?: string;
  lineWidth?: number;
  bgColor?: string;
  title?: string;
  placeholder?: string;
  tip?: string;
  showTools?: boolean;
  showBaseline?: boolean;
  exportBgColor?: string;
  undoText?: string;
  clearText?: string;
  disabled?: boolean;
  customClass?: string;
}

export interface SignatureInstance {
  clear(): void;
  undo(): void;
  toDataURL(type?: string, quality?: number, bgColor?: string): string;
  download(filename?: string): void;
  loadImage(src: string): void;
}

/* =========================================================================
 * 组件声明
 * ========================================================================= */

export declare const tButton: DefineComponent<ButtonProps>;
export declare const tInput: DefineComponent<InputProps>;
export declare const tTextarea: DefineComponent<TextareaProps>;
export declare const tInputNumber: DefineComponent<InputNumberProps>;
export declare const tSelect: DefineComponent<SelectProps>;
export declare const tCheckbox: DefineComponent<CheckboxProps>;
export declare const tRadio: DefineComponent<RadioProps>;
export declare const tSwitch: DefineComponent<SwitchProps>;
export declare const tTag: DefineComponent<TagProps>;
export declare const tAlert: DefineComponent<AlertProps>;
export declare const tBadge: DefineComponent<BadgeProps>;
export declare const tAvatar: DefineComponent<AvatarProps>;
export declare const tDivider: DefineComponent<DividerProps>;
export declare const tProgress: DefineComponent<ProgressProps>;
export declare const tRate: DefineComponent<RateProps>;
export declare const tSlider: DefineComponent<SliderProps>;
export declare const tSteps: DefineComponent<StepsProps>;
export declare const tStep: DefineComponent<StepProps>;
export declare const tTimeline: DefineComponent<TimelineProps>;
export declare const tTimelineItem: DefineComponent<TimelineItemProps>;
export declare const tForm: DefineComponent<FormProps>;
export declare const tFormItem: DefineComponent<FormItemProps>;
export declare const tUpload: DefineComponent<UploadProps>;
export declare const tTable: DefineComponent<TableProps>;
export declare const tModal: DefineComponent<ModalProps>;
export declare const tDrawer: DefineComponent<DrawerProps>;
export declare const tTabs: DefineComponent<TabsProps>;
export declare const tMenu: DefineComponent<MenuProps>;
export declare const tTree: DefineComponent<TreeProps>;
export declare const tTreeSelect: DefineComponent<TreeSelectProps>;
export declare const tTransfer: DefineComponent<TransferProps>;
export declare const tDate: DefineComponent<DateProps>;
export declare const tDatePicker: DefineComponent<DatePickerProps>;
export declare const tTimePicker: DefineComponent<TimePickerProps>;
export declare const tCascader: DefineComponent<CascaderProps>;
export declare const tPagination: DefineComponent<PaginationProps>;
export declare const tCarousel: DefineComponent<CarouselProps>;
export declare const tCarouselItem: DefineComponent<Record<string, any>>;
export declare const tCollapse: DefineComponent<CollapseProps>;
export declare const tCollapseItem: DefineComponent<CollapseItemProps>;
export declare const tDescriptions: DefineComponent<DescriptionsProps>;
export declare const tDescriptionsItem: DefineComponent<DescriptionsItemProps>;
export declare const tResult: DefineComponent<ResultProps>;
export declare const tStatistic: DefineComponent<StatisticProps>;
export declare const tEmpty: DefineComponent<EmptyProps>;
export declare const tSkeleton: DefineComponent<SkeletonProps>;
export declare const tTooltip: DefineComponent<TooltipProps>;
export declare const tPopover: DefineComponent<PopoverProps>;
export declare const tPopconfirm: DefineComponent<PopconfirmProps>;
export declare const tCalendar: DefineComponent<CalendarProps>;
export declare const tImage: DefineComponent<ImageProps>;
export declare const tSegmented: DefineComponent<SegmentedProps>;
export declare const tAffix: DefineComponent<AffixProps>;
export declare const tAnchor: DefineComponent<AnchorProps>;
export declare const tBreadcrumb: DefineComponent<BreadcrumbProps>;
export declare const tBreadcrumbItem: DefineComponent<BreadcrumbItemProps>;
export declare const tCard: DefineComponent<CardProps>;
export declare const tSpace: DefineComponent<SpaceProps>;
export declare const tRow: DefineComponent<RowProps>;
export declare const tCol: DefineComponent<ColProps>;
export declare const tColorPicker: DefineComponent<ColorPickerProps>;
export declare const tDropdown: DefineComponent<DropdownProps>;
export declare const tIcon: DefineComponent<IconProps>;
export declare const tBacktop: DefineComponent<BacktopProps>;
export declare const tOptfile: DefineComponent<OptfileProps>;
export declare const tWatermark: DefineComponent<WatermarkProps>;
export declare const tFlex: DefineComponent<FlexProps>;
export declare const tSplitter: DefineComponent<SplitterProps>;
export declare const tResizable: DefineComponent<ResizableProps>;
export declare const tResizableGroup: DefineComponent<ResizableGroupProps>;
export declare const tDragMove: DefineComponent<DragMoveProps>;
export declare const tAudioPlayer: DefineComponent<AudioPlayerProps>;
export declare const tVideoPlayer: DefineComponent<VideoPlayerProps>;
export declare const tChat: DefineComponent<ChatProps>;
export declare const tList: DefineComponent<ListProps>;
export declare const tInputOTP: DefineComponent<InputOTPProps>;
export declare const tTypography: DefineComponent<TypographyProps>;
export declare const tScrollbar: DefineComponent<ScrollbarProps>;
export declare const tAutoComplete: DefineComponent<AutoCompleteProps>;
export declare const tMentions: DefineComponent<MentionsProps>;
export declare const tFloatButton: DefineComponent<FloatButtonProps>;
export declare const tTour: DefineComponent<TourProps>;
export declare const tQrcode: DefineComponent<QrcodeProps>;
export declare const tComment: DefineComponent<CommentProps>;
export declare const tCountdown: DefineComponent<CountdownProps>;
export declare const tPageHeader: DefineComponent<PageHeaderProps>;
export declare const tConfigProvider: DefineComponent<ConfigProviderProps>;
export declare const tVirtualList: DefineComponent<VirtualListProps>;
export declare const tBubble: DefineComponent<BubbleProps>;
export declare const tSignature: DefineComponent<SignatureProps>;
export declare const tImageViewer: DefineComponent<ImageViewerProps>;
export declare const tCodeBlock: DefineComponent<CodeBlockProps>;

/** 读取上层 ConfigProvider 的配置；未包裹时返回默认值 */
export declare function useConfig(): UseConfigReturn;

/* =========================================================================
 * 组合式函数
 * ========================================================================= */

export type PopperPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

export interface UsePopperOptions {
  triggerRef: import('vue').Ref<HTMLElement | null>;
  panelRef: import('vue').Ref<HTMLElement | null>;
  placement?: PopperPlacement;
  /** 与触发元素的间距 */
  offset?: number;
  /** 视口边距 */
  viewportPadding?: number;
  /** 空间不足时翻转 */
  autoFlip?: boolean;
  /** 钳制到视口内 */
  clampToViewport?: boolean;
  /** 面板最小宽度对齐触发元素 */
  matchTriggerWidth?: boolean;
  /** 点击外部关闭 */
  closeOnOutside?: boolean;
  /** Esc 关闭 */
  closeOnEsc?: boolean;
  disabled?: import('vue').Ref<boolean>;
  onVisibleChange?: (visible: boolean) => void;
}

export interface UsePopperReturn {
  visible: import('vue').Ref<boolean>;
  pos: import('vue').Ref<{ top: number; left: number; actualPlacement: string; arrowOffset: number }>;
  panelStyle: import('vue').ComputedRef<Record<string, string>>;
  arrowStyle: import('vue').ComputedRef<Record<string, string>>;
  actualPlacement: import('vue').ComputedRef<string>;
  open(): Promise<void>;
  close(): void;
  toggle(): Promise<void> | void;
  update(): void;
}

/** 浮层定位与开合逻辑（12 方向 / 自动翻转 / 视口钳制 / 跟随滚动） */
export declare function usePopper(options: UsePopperOptions): UsePopperReturn;

/* =========================================================================
 * 服务式 API 声明
 * ========================================================================= */

export declare const Message: MessageApi;
export declare const Confirm: (options?: ConfirmOptions) => Promise<void>;
export declare const Loading: LoadingApi;
export declare const Notification: NotificationApi;
export declare const $penguin: PenguinTools;

/* =========================================================================
 * 插件
 * ========================================================================= */

export declare const install: (app: App) => void;

declare const PenguinUI: {
  version: string;
  install: (app: App) => void;
};

export default PenguinUI;

/* =========================================================================
 * Volar 模板全局组件提示
 * ========================================================================= */

declare module 'vue' {
  export interface GlobalComponents {
    TAffix: typeof tAffix;
    TAlert: typeof tAlert;
    TAnchor: typeof tAnchor;
    TAvatar: typeof tAvatar;
    TBacktop: typeof tBacktop;
    TBadge: typeof tBadge;
    TBreadcrumb: typeof tBreadcrumb;
    TBreadcrumbItem: typeof tBreadcrumbItem;
    TButton: typeof tButton;
    TCalendar: typeof tCalendar;
    TCard: typeof tCard;
    TCarousel: typeof tCarousel;
    TCarouselItem: typeof tCarouselItem;
    TCascader: typeof tCascader;
    TCheckbox: typeof tCheckbox;
    TCol: typeof tCol;
    TCollapse: typeof tCollapse;
    TCollapseItem: typeof tCollapseItem;
    TColorPicker: typeof tColorPicker;
    TDate: typeof tDate;
    TDatePicker: typeof tDatePicker;
    TDescriptions: typeof tDescriptions;
    TDescriptionsItem: typeof tDescriptionsItem;
    TDivider: typeof tDivider;
    TDrawer: typeof tDrawer;
    TDropdown: typeof tDropdown;
    TEmpty: typeof tEmpty;
    TForm: typeof tForm;
    TFormItem: typeof tFormItem;
    TIcon: typeof tIcon;
    TImage: typeof tImage;
    TInput: typeof tInput;
    TInputNumber: typeof tInputNumber;
    TMenu: typeof tMenu;
    TModal: typeof tModal;
    TOptfile: typeof tOptfile;
    TPagination: typeof tPagination;
    TPopconfirm: typeof tPopconfirm;
    TPopover: typeof tPopover;
    TProgress: typeof tProgress;
    TRadio: typeof tRadio;
    TRate: typeof tRate;
    TResult: typeof tResult;
    TRow: typeof tRow;
    TSegmented: typeof tSegmented;
    TSelect: typeof tSelect;
    TSkeleton: typeof tSkeleton;
    TSlider: typeof tSlider;
    TSpace: typeof tSpace;
    TStatistic: typeof tStatistic;
    TStep: typeof tStep;
    TSteps: typeof tSteps;
    TSwitch: typeof tSwitch;
    TTable: typeof tTable;
    TTabs: typeof tTabs;
    TTag: typeof tTag;
    TTextarea: typeof tTextarea;
    TTimeline: typeof tTimeline;
    TTimelineItem: typeof tTimelineItem;
    TTimePicker: typeof tTimePicker;
    TTooltip: typeof tTooltip;
    TTransfer: typeof tTransfer;
    TTree: typeof tTree;
    TTreeSelect: typeof tTreeSelect;
    TUpload: typeof tUpload;
    TWatermark: typeof tWatermark;
    TFlex: typeof tFlex;
    TSplitter: typeof tSplitter;
    TList: typeof tList;
    TInputOtp: typeof tInputOTP;
    TTypography: typeof tTypography;
    TScrollbar: typeof tScrollbar;
    TAutoComplete: typeof tAutoComplete;
    TMentions: typeof tMentions;
    TFloatButton: typeof tFloatButton;
    TTour: typeof tTour;
    TQrcode: typeof tQrcode;
    TComment: typeof tComment;
    TCountdown: typeof tCountdown;
    TPageHeader: typeof tPageHeader;
    TConfigProvider: typeof tConfigProvider;
    TVirtualList: typeof tVirtualList;
    TBubble: typeof tBubble;
    TSignature: typeof tSignature;
    TImageViewer: typeof tImageViewer;
    TCodeBlock: typeof tCodeBlock;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $message: MessageApi;
    $Confirm: (options?: ConfirmOptions) => Promise<void>;
    $Loading: LoadingApi;
    $notification: NotificationApi;
    $penguin: PenguinTools;
  }
}
