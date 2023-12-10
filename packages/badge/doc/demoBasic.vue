<template>
  <t-space :size="[0, 60]">
    <t-badge :value="99" type="primary">
      <t-button>默认</t-button>
    </t-badge>
    <t-badge :value="100" type="success">
      <t-button>成功</t-button>
    </t-badge>
    <t-badge :value="10" type="warning">
      <t-button>警告</t-button>
    </t-badge>
    <t-badge :value="3" type="danger">
      <t-button>危险</t-button>
    </t-badge>
    <t-badge :value="3" type="info">
      <t-button>危险</t-button>
    </t-badge>
    <t-badge :value="50" isDot>
      <t-button>小红点</t-button>
    </t-badge>
  </t-space>
</template>