<template>
  <div class="demo-stack">
    <div>
      <p class="demo-label">语义类型</p>
      <div class="demo-row">
        <t-tag v-for="t in types" :key="t" :type="t">{{ t }}</t-tag>
      </div>
    </div>

    <div>
      <p class="demo-label">light / dark / plain</p>
      <div class="demo-row">
        <t-tag v-for="t in types" :key="'d' + t" :type="t" effect="dark">{{ t }}</t-tag>
      </div>
      <div class="demo-row">
        <t-tag v-for="t in types" :key="'p' + t" :type="t" effect="plain">{{ t }}</t-tag>
      </div>
    </div>

    <div>
      <p class="demo-label">尺寸与形态</p>
      <div class="demo-row">
        <t-tag size="small">小</t-tag>
        <t-tag>默认</t-tag>
        <t-tag size="large" type="primary">大</t-tag>
        <t-tag type="success" round>胶囊</t-tag>
        <t-tag type="danger" bordered>描边</t-tag>
        <t-tag type="primary" icon="t-icon-calendar">带图标</t-tag>
        <t-tag type="success" dot>状态点</t-tag>
        <t-tag color="#9b5cff">自定义色</t-tag>
        <t-tag color="#9b5cff" effect="dark" dot>自定义深色</t-tag>
      </div>
    </div>

    <div>
      <p class="demo-label">交互：可关闭 / 可点击 / 可选中 / 禁用</p>
      <div class="demo-row">
        <t-tag v-if="show" type="danger" closable @close="show = false">点 × 关闭</t-tag>
        <t-tag type="warning" clickable @click="count += 1">点我 {{ count }} 次</t-tag>

        <t-tag
          v-for="c in cats"
          :key="c.value"
          :type="c.type"
          checkable
          :checked="selected.includes(c.value)"
          @change="(v) => toggle(c.value, v)"
        >{{ c.label }}</t-tag>
        <span class="demo-hint">已选 {{ selected.length }} 个</span>

        <t-tag type="info" disabled>禁用</t-tag>
        <t-tag type="info" disabled closable>禁用可关闭</t-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const types = ['default', 'primary', 'success', 'warning', 'danger', 'info']
const show = ref(true)
const count = ref(0)

const cats = [
  { value: 'vue', label: 'Vue', type: 'success' },
  { value: 'ts', label: 'TypeScript', type: 'primary' },
  { value: 'ui', label: 'UI 设计', type: 'warning' },
]
const selected = ref(['vue'])
const toggle = (val, checked) => {
  if (checked) {
    if (!selected.value.includes(val)) selected.value.push(val)
  } else {
    selected.value = selected.value.filter((v) => v !== val)
  }
}
</script>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 18px; }
.demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.demo-row + .demo-row { margin-top: 10px; }
.demo-label { margin: 0 0 10px; font-size: 12px; color: var(--pui-text-muted); }
.demo-hint { font-size: 12px; color: var(--pui-text-muted); }
</style>
