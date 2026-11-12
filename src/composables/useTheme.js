import { ref, watch } from 'vue';

const STORAGE_KEY = 'penguinui-doc-theme';

const readInitial = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // 隐私模式下 localStorage 可能不可用，忽略即可
  }
  return 'light';
};

export const theme = ref(readInitial());

export const applyTheme = (value) => {
  if (typeof document === 'undefined') return;
  const next = value === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // 忽略存储失败
  }
};

export const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

let initialized = false;
export const initTheme = () => {
  if (initialized) return;
  initialized = true;
  applyTheme(theme.value);
  watch(theme, applyTheme);
};
