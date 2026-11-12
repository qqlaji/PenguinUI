<template>
  <div class="sg-demo">
    <t-signature
      ref="sigRef"
      title="签名区"
      :width="520"
      :height="200"
      tip="鼠标或手指拖动书写"
      @change="onChange"
    />

    <div class="sg-demo__actions">
      <t-button size="small" @click="undo">撤销</t-button>
      <t-button size="small" @click="clear">清空</t-button>
      <t-button size="small" type="primary" :disabled="!signed" @click="save">保存签名</t-button>
      <t-tag v-if="signed" type="success" effect="light" size="small">已签名</t-tag>
      <t-tag v-else size="small">未签名</t-tag>
    </div>

    <div v-if="preview" class="sg-demo__preview">
      <t-typography type="secondary" size="small" block>导出结果：</t-typography>
      <img :src="preview" alt="签名预览" class="sg-demo__img" />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();
const sigRef = ref(null);
const signed = ref(false);
const preview = ref('');

const onChange = (url) => {
  signed.value = !!url;
};

const undo = () => sigRef.value && sigRef.value.undo();
const clear = () => {
  if (sigRef.value) sigRef.value.clear();
  preview.value = '';
};

const save = () => {
  if (!sigRef.value) return;
  preview.value = sigRef.value.toDataURL('image/png', 1, '#ffffff');
  proxy.$message({ text: '签名已导出', type: 'success', timeout: 1400 });
};
</script>

<style lang="scss" scoped>
.sg-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 540px;
}
.sg-demo__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.sg-demo__preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sg-demo__img {
  max-width: 260px;
  border: 1px solid var(--pui-border, #e7ecf3);
  border-radius: 10px;
  background: #fff;
}
</style>
