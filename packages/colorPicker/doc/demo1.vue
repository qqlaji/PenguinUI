<template>
  <t-row style="display: flex; align-items: center">
    <t-col :span="4"><t-button @click.stop="showColorPicker">显示colorPicker面板</t-button></t-col>
    <t-col :span="6"><div :style="{ color: color }">结果颜色</div></t-col>
  </t-row>
  <m-colorPicker ref="colorPicker" v-model="color" :autoClose="autoClose"></m-colorPicker>
</template>

<script setup>
import { ref } from 'vue'
const color = ref('#000')
const autoClose = ref(false)
const colorPicker = ref()
const showColorPicker = () => {
  colorPicker.value.show()
}
</script>

<style lang="scss" scoped></style>
