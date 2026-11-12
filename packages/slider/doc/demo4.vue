<template>
  <div class="sl-demo4">
    <t-slider v-model="range" range show-input :min="0" :max="100" />
    <p class="sl-demo4__val">价格区间：<b>{{ range[0] }} - {{ range[1] }}</b></p>

    <t-slider
      v-model="price"
      range
      :min="0"
      :max="1000"
      :step="50"
      :show-stops="true"
      :format-tooltip="(v) => '¥' + v"
    />
    <p class="sl-demo4__val">预算区间：<b>¥{{ price[0] }} - ¥{{ price[1] }}</b></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const range = ref([20, 60])
const price = ref([200, 700])
</script>

<style scoped>
.sl-demo4 { display: flex; flex-direction: column; gap: 18px; padding: 6px 4px; }
.sl-demo4__val { margin: 0; color: var(--pui-text-sub); font-size: 13px; }
.sl-demo4__val b { color: var(--pui-brand); }
</style>
