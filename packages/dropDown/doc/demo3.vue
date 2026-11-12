<!-- html -->
<template>
  <t-space>
    <t-dropdown title="图标菜单" :options="dorpoptions"></t-dropdown>
    <t-dropdown title="带图标的头像菜单" :options="dorpoptions" size="small">
      <template #Img>
        <img :src="avatar" alt="" />
      </template>
    </t-dropdown>
  </t-space>
</template>

<!-- js -->
<script setup>
import { reactive } from "vue";

// 内联头像，避免示例依赖外部域名
const avatar =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2040%2040'%3E%3Ccircle%20cx%3D'20'%20cy%3D'20'%20r%3D'20'%20fill%3D'%230e80eb'%2F%3E%3Ccircle%20cx%3D'20'%20cy%3D'16'%20r%3D'6'%20fill%3D'%23fff'%2F%3E%3Cpath%20d%3D'M9%2034a11%2011%200%200%201%2022%200'%20fill%3D'%23fff'%2F%3E%3C%2Fsvg%3E";

const state = reactive({
  dorpoptions: [
    { label: "新建文件", icon: "t-icon-file", value: "new" },
    { label: "上传文件", icon: "t-icon-upload", value: "upload" },
    { label: "下载文件", icon: "t-icon-download", value: "download" },
    { label: "复制链接", icon: "t-icon-link", value: "link" },
    { label: "编辑", icon: "t-icon-edit", value: "edit" }
  ]
});
const { dorpoptions } = state;
</script>
