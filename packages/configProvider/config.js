import { inject, computed } from 'vue';

/** 全局配置注入的 key —— 必须是字符串，Symbol 会导致跨包实例取不到 */
export const CONFIG_KEY = 'puiConfig';

export const defaultConfig = {
  /** 组件默认尺寸 */
  size: 'default',
  /** 主色 */
  primaryColor: '#0e80eb',
  /** 圆角基准（px） */
  radius: 10,
  /** 是否使用暗色 */
  theme: 'light',
  /** 空状态文案 */
  emptyText: '暂无数据',
  /** 加载中文案 */
  loadingText: '加载中...',
  /** 分页每页条数 */
  pageSize: 10,
  /** 分页可选条数 */
  pageSizes: [10, 20, 50, 100],
  /** 表单校验失败提示位置 */
  validateMessagePlacement: 'top',
  /** 日期格式 */
  dateFormat: 'YYYY-MM-DD'
};

/**
 * 读取上层 ConfigProvider 提供的配置
 * 未包裹 ConfigProvider 时返回默认值，组件无需判空
 */
export function useConfig() {
  const injected = inject(CONFIG_KEY, null);

  const config = computed(() => ({
    ...defaultConfig,
    ...(injected && injected.value ? injected.value : {})
  }));

  const size = computed(() => config.value.size);
  const theme = computed(() => config.value.theme);
  const primaryColor = computed(() => config.value.primaryColor);

  return { config, size, theme, primaryColor };
}
