<template>
  <div class="cb-demo">
    <t-code-block :code="installCode" lang="bash" title="安装" />

    <div class="cb-demo__row">
      <t-code-block :code="jsCode" lang="js" title="基本用法" />
      <t-code-block :code="tsCode" lang="ts" title="TypeScript" />
    </div>
  </div>
</template>

<script setup>
const installCode = `# 使用 npm
npm install penguinui --save

# 或使用 pnpm
pnpm add penguinui

# 启动文档站
npm run dev`;

const jsCode = `import { tTable, tButton } from 'penguinui'

// 组件既可全局注册，也可按需引入
app.component('t-button', tButton)

const columns = [
  { field: 'name', title: '名称', sortable: true },
  { field: 'price', title: '价格', align: 'right' }
]`;

const tsCode = `interface Column<T> {
  field: keyof T
  title: string
  sortable?: boolean
}

export function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

type Status = 'idle' | 'loading' | 'done'`;
</script>

<style lang="scss" scoped>
.cb-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cb-demo__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
}
</style>
