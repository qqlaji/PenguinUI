<template>
  <div class="fo-demo7">
    <t-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="88"
      scroll-to-error
      @submit="onSubmit"
    >
      <t-form-item label="用户名" prop="username">
        <t-input v-model="form.username" placeholder="3-16 位，字母开头" />
      </t-form-item>

      <t-form-item label="邮箱" prop="email">
        <t-input v-model="form.email" placeholder="name@example.com" />
      </t-form-item>

      <t-form-item label="年龄" prop="age">
        <t-input v-model="form.age" placeholder="18 ~ 60" />
      </t-form-item>

      <t-form-item label="密码" prop="password">
        <t-input v-model="form.password" type="password" placeholder="至少 8 位" />
      </t-form-item>

      <t-form-item label="确认密码" prop="confirm">
        <t-input v-model="form.confirm" type="password" placeholder="再输入一次" />
      </t-form-item>

      <t-form-item label="昵称" prop="nickname">
        <t-input v-model="form.nickname" placeholder="异步校验：已存在的昵称会报错" />
      </t-form-item>

      <t-form-item>
        <div class="fo-demo7__actions">
          <t-button type="primary" @click="submitByValidate">提交（validate）</t-button>
          <t-button @click="submitQuietly">提交（validateQuietly）</t-button>
          <t-button @click="reset">重置</t-button>
          <t-button @click="clearOnly">只清校验</t-button>
        </div>
      </t-form-item>
    </t-form>

    <div v-if="result" class="fo-demo7__result" :class="result.ok ? 'is-ok' : 'is-err'">
      {{ result.text }}
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue';

const { proxy } = getCurrentInstance();
const formRef = ref(null);
const result = ref(null);

const form = reactive({
  username: '',
  email: '',
  age: '',
  password: '',
  confirm: '',
  nickname: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[A-Za-z][A-Za-z0-9_]{2,15}$/, message: '3-16 位，字母开头', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  age: [
    {
      // transform 先把字符串转成数字，再走数值区间校验
      transform: (v) => (v === '' || v === null ? v : Number(v)),
      type: 'number',
      min: 18,
      max: 60,
      message: '年龄需在 18 ~ 60 之间',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码至少 8 位', trigger: 'blur' }
  ],
  confirm: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      // validator 能拿到整个 model，方便做联动校验
      validator: (_rule, value, model) =>
        value === model.password ? true : '两次输入的密码不一致',
      trigger: 'blur'
    }
  ],
  nickname: [
    {
      // 模拟"昵称是否已被占用"的异步接口
      validator: async (_rule, value) => {
        if (!value) return true;
        await new Promise((r) => setTimeout(r, 420));
        return ['admin', 'root', 'penguin'].includes(String(value).toLowerCase())
          ? `昵称「${value}」已被占用`
          : true;
      },
      trigger: 'blur'
    }
  ]
};

/** 方式一：try/catch —— 失败时 validate() 会 reject，可拿到第一个错误的 message */
const submitByValidate = async () => {
  try {
    await formRef.value.validate();
    result.value = { ok: true, text: '✓ 校验通过，可以提交' };
    proxy.$message({ text: '校验通过', type: 'success', timeout: 1500 });
  } catch (e) {
    result.value = { ok: false, text: `✗ ${e.message}（共 ${e.fields.length} 项未通过）` };
  }
};

/** 方式二：不抛异常的布尔版本，适合只想判断"能不能提交"的场景 */
const submitQuietly = async () => {
  const ok = await formRef.value.validateQuietly();
  result.value = ok
    ? { ok: true, text: '✓ 校验通过（validateQuietly 返回 true）' }
    : { ok: false, text: '✗ 校验未通过（validateQuietly 返回 false）' };
};

const onSubmit = (model) => {
  proxy.$message({ text: '表单已提交', type: 'success', timeout: 1400 });
  console.log('submit payload:', model);
};

const reset = () => {
  formRef.value.resetFields();
  result.value = null;
  proxy.$message({ text: '已重置为初始值', type: 'info', timeout: 1400 });
};

const clearOnly = () => {
  formRef.value.clearValidate();
  result.value = null;
};
</script>

<style lang="scss" scoped>
.fo-demo7 {
  max-width: 520px;
}
.fo-demo7__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.fo-demo7__result {
  margin-top: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;

  &.is-ok {
    background: rgba(19, 160, 101, 0.1);
    color: var(--pui-success, #13a065);
  }
  &.is-err {
    background: rgba(236, 52, 55, 0.09);
    color: var(--pui-danger, #ec3437);
  }
}
</style>
