<!-- html -->
<template>
  <t-space>
    <t-button @click="openMsg1">消息提示</t-button>
    <t-button @click="openMsg2">5秒后消失</t-button>
  </t-space>
</template>

<!-- js -->
<script setup>
import Message from "../index.js"; //此处为本地示例，请使用import {Message} from "penguin-ui";引入
const openMsg1 = () => {
  Message({
    text: "自定义Icon！",
    icon: "t-icon-collection_fill",
  });
};
const openMsg2 = () => {
  Message({
    text: "5秒后消失！",
    icon: "t-icon-good",
    timeout: 5000,
  });
};
</script>