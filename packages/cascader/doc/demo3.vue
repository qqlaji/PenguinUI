<template>
  <div class="cs-demo3">
    <div class="cs-demo3__row">
      <t-cascader
        v-model="checked"
        :options="regionOptions"
        multiple
        filterable
        :check-strictly="strict"
        :show-checked-strategy="strategy"
        placeholder="请选择地区（可多选）"
        style="width: 300px"
      />
      <t-button size="small" @click="checked = []">清空</t-button>
    </div>

    <div class="cs-demo3__row">
      <t-segmented v-model="strategy" :options="strategies" size="small" />
      <span class="cs-demo3__switch">
        <t-switch v-model="strict" />
        <span class="cs-demo3__switch-text">父子不关联（checkStrictly）</span>
      </span>
    </div>

    <div class="cs-demo3__panel">
      <span class="cs-demo3__label">已选 <b>{{ checked.length }}</b> 条路径</span>
      <div class="cs-demo3__tags">
        <t-tag v-for="(p, i) in checked" :key="i" size="small" effect="light">
          {{ p.join(' / ') }}
        </t-tag>
        <span v-if="!checked.length" class="cs-demo3__ph">点击选择器试试多选</span>
      </div>
    </div>

    <t-typography type="secondary" size="small" block>
      _multiple_ 开启多选，父子默认联动：勾「杭州市」会自动选中其下所有区，勾一个区时父级显示半选。
      勾上 _checkStrictly_ 后父子互不影响，适合「只授权某个父节点」的场景。
    </t-typography>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { regionOptions } from './data';

const checked = ref([['zj', 'hz', 'xh']]);
const strict = ref(false);
const strategy = ref('leaf');
const strategies = [
  { label: '标签显示叶子路径', value: 'leaf' },
  { label: '标签显示父级', value: 'parent' }
];
</script>

<style lang="scss" scoped>
.cs-demo3 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 660px;
}
.cs-demo3__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cs-demo3__panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  background: var(--pui-bg-soft, #f7f9fc);
}
.cs-demo3__label {
  font-size: 12px;
  color: var(--pui-text-sub, #5b6879);

  b {
    color: var(--pui-brand, #0e80eb);
    font-variant-numeric: tabular-nums;
    margin: 0 2px;
  }
}
.cs-demo3__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cs-demo3__ph {
  font-size: 12px;
  color: var(--pui-text-muted, #8b96a6);
}
.cs-demo3__switch {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.cs-demo3__switch-text {
  font-size: 13px;
  color: var(--pui-text-sub, #5b6879);
}
</style>
