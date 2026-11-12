<template>
  <t-form ref="f3" :model="m" :rules="r" label-width="92px">
    <t-form-item label="密码" prop="pwd">
      <t-input v-model="m.pwd" type="password" placeholder="至少 6 位" />
    </t-form-item>
    <t-form-item label="确认密码" prop="pwd2">
      <t-input v-model="m.pwd2" type="password" placeholder="再次输入" />
    </t-form-item>
    <t-form-item label="邀请码" prop="code">
      <t-input v-model="m.code" placeholder="自定义异步校验" />
    </t-form-item>
    <t-form-item>
      <t-button type="primary" @click="check">校验</t-button>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
const f3 = ref(null)
const m = reactive({ pwd: '', pwd2: '', code: '' })
const r = {
  pwd: [{ required: true, min: 6, message: '密码至少 6 位', trigger: 'blur' }],
  pwd2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value) => value === m.pwd || '两次输入的密码不一致',
      trigger: 'blur'
    }
  ],
  code: [
    {
      validator: (rule, value) =>
        new Promise((resolve) => setTimeout(() => resolve(value === 'PENGUIN' || '邀请码无效（试试 PENGUIN）'), 600)),
      trigger: 'blur'
    }
  ]
}
const check = async () => { await f3.value.validate() }
</script>

<style scoped></style>
