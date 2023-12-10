<!-- html -->
<template>
  <t-popover v-model="visible" trigger="manual" placement="top-start">
    <p>这是一段内容这是一段内容确定删除吗？</p>
    <div style="text-align: right; margin: 0">
      <t-button size="mini" type="text" @click="visible = false">取消</t-button>
      <t-button type="primary" size="mini" @click="visible = false"
        >确定</t-button
      >
    </div>
    <template #reference>
      <t-button size="medium" @click="handler">删除</t-button>
    </template>
  </t-popover>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from "vue";

const visible = ref(false);
function handler() {
  visible.value = !visible.value;
  console.log(visible.value);
}
</script>
