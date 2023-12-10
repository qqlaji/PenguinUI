
<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count += 1;
    },
    decrement() {
      this.count -= 1;
    }
  }
};
</script><!-- html -->
<template>
  <div>
    <p>{{ count }}</p>
    <t-button type="custom" round custotColor="#9935f5" @click="increment">加一</t-button>
    <t-button type="custom" round custotColor="#1ba7dd" @click="decrement">减一</t-button>
  </div><br/><br/><br/>
  <t-space>
    <t-button>默认按钮</t-button>
    <t-button type="primary">主要按钮</t-button>
    <t-button type="success">成功按钮</t-button>
    <t-button type="danger">危险按钮</t-button>
    <t-button type="warning">警告按钮</t-button>
    <t-button type="dashed">虚线按钮</t-button>
    <t-button type="text">文本按钮</t-button>
  </t-space>
  <t-space>
    <t-button round>默认按钮</t-button>
    <t-button type="primary" round>主要按钮</t-button>
    <t-button type="success" round>成功按钮</t-button>
    <t-button type="danger" round>危险按钮</t-button>
    <t-button type="warning" round>警告按钮</t-button>
    <t-button type="dashed" round>虚线按钮</t-button>
  </t-space>
  <t-space>
    <t-button leftIcon="t-icon-electronics"></t-button>
    <t-button type="primary" leftIcon="t-icon-edit"></t-button>
    <t-button type="success" leftIcon="t-icon-add-circle" disabled></t-button>
    <t-button type="danger" leftIcon="t-icon-home" disabled></t-button>
    <t-button type="warning" leftIcon="t-icon-calendar"></t-button>
    <t-button type="dashed" leftIcon="t-icon-upload"></t-button>
    <t-button type="text" leftIcon="t-icon-ashbin">删除</t-button>
  </t-space>
</template>