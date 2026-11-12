<template>
  <t-form ref="formRef" :model="form" :rules="rules" label-width="84px">
    <t-form-item label="用户名" prop="name">
      <t-input v-model="form.name" placeholder="请输入用户名" />
    </t-form-item>
    <t-form-item label="邮箱" prop="email">
      <t-input v-model="form.email" placeholder="name@example.com" />
    </t-form-item>
    <t-form-item label="年龄" prop="age">
      <t-input-number v-model="form.age" :min="0" :max="120" />
    </t-form-item>
    <t-form-item label="城市" prop="city">
      <t-select v-model="form.city" :options="cityOptions" placeholder="请选择城市" />
    </t-form-item>
    <t-form-item>
      <t-button type="primary" @click="submit">提交校验</t-button>
      <t-button style="margin-left:10px" @click="reset">重置</t-button>
    </t-form-item>
  </t-form>
  <p v-if="result" class="f-demo__result" :class="result.ok ? 'ok' : 'bad'">{{ result.text }}</p>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Notification from '../../notification/index'
const formRef = ref(null)
const form = reactive({ name: '', email: '', age: undefined, city: '' })
const cityOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' }
]
const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  age: [{ required: true, type: 'number', min: 18, message: '年龄需满 18 岁', trigger: 'change' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }]
}
const result = ref(null)
const submit = async () => {
  const { valid } = await formRef.value.validate()
  result.value = valid ? { ok: true, text: '校验通过 ✓' } : { ok: false, text: '请修正上方错误' }
  if (valid) Notification.success({ title: '提交成功', message: `欢迎，${form.name}` })
}
const reset = () => { formRef.value.resetFields(); result.value = null }
</script>

<style scoped>
.f-demo__result { margin: 4px 0 0; font-size: 13px; }
.f-demo__result.ok { color: var(--pui-success); }
.f-demo__result.bad { color: var(--pui-danger); }
</style>
