<!-- html -->
<template>
  <t-popover class="space" trigger="hover" placement="top-start" content="hover激活">
    <template #reference>
      <t-button size="medium">hover激活</t-button>
    </template>
  </t-popover>
  <t-popover class="space" trigger="click" placement="bottom" content="click激活"  title="标题">
    <template #reference>
      <t-button  size="medium">click激活</t-button>
    </template>
  </t-popover>
  <t-popover class="space" trigger="focus" placement="right" content="focus激活">
    <template #reference>
      <t-button size="medium">focus激活</t-button>
    </template>
  </t-popover>
  <t-popover
    class="space"
    trigger="manual"
    v-model="visible"
    placement="bottom-end"
    content="手动激活"
  >
    <template #reference>
      <t-button size="medium" @click="handler">手动激活</t-button>
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
<style lang="scss" scoped>
.space+.space {
  margin-left: 16px;
}
</style>
