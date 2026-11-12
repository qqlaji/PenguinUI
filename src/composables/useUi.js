import { ref } from 'vue';

// 文档站级别的轻量 UI 状态（不引入额外状态管理依赖）
export const searchOpen = ref(false);
export const sidebarOpen = ref(false);

export const openSearch = () => {
  searchOpen.value = true;
};
export const closeSearch = () => {
  searchOpen.value = false;
};
export const toggleSearch = () => {
  searchOpen.value = !searchOpen.value;
};
export const closeSidebar = () => {
  sidebarOpen.value = false;
};
export const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
