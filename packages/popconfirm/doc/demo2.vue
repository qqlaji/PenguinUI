<template>
  <div class="pc-demo2">
    <t-popconfirm title="上方弹出" placement="top">
      <t-button>上方 top</t-button>
    </t-popconfirm>
    <t-popconfirm title="下方弹出" placement="bottom">
      <t-button>下方 bottom</t-button>
    </t-popconfirm>
    <t-popconfirm title="左侧弹出" placement="left">
      <t-button>左侧 left</t-button>
    </t-popconfirm>
    <t-popconfirm title="右侧弹出" placement="right">
      <t-button>右侧 right</t-button>
    </t-popconfirm>
  </div>
</template>

<script setup></script>

<style scoped>
.pc-demo2 { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
