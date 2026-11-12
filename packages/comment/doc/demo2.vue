<template>
  <div class="cm-demo2">
    <t-comment
      author="blue-sf"
      datetime="刚刚"
      content="我把这次的改动整理了一下，主要包含三个部分："
      :actions="[{ label: '回复', icon: 't-icon-comment' }]"
      collapsed-text="展开修改清单"
    >
      <template #replies>
        <t-comment
          nested
          author="Cindy"
          datetime="1 分钟前"
          content="收到，我这边补一下文档示例。"
          :actions="[{ label: '回复' }]"
        >
          <template #avatar>
            <t-avatar text="C" size="small" bg-color="#eef2ff" color="#6d3bd1" />
          </template>
        </t-comment>
        <t-comment
          nested
          author="David"
          datetime="刚刚"
          content="类型声明我已经验证过，strict 模式下也能通过。"
          :actions="[{ label: '回复' }]"
        >
          <template #avatar>
            <t-avatar text="D" size="small" bg-color="#ecfdf3" color="#0f9d58" />
          </template>
        </t-comment>
      </template>
    </t-comment>

    <t-divider />

    <t-comment author="系统通知" datetime="5 分钟前">
      <template #avatar>
        <t-avatar icon="t-icon-customer-service" size="small" bg-color="#fff4e8" color="#c85a12" />
      </template>
      <p class="cm-demo2__p">
        默认插槽用于渲染富文本内容，可以放 <t-tag size="small" type="success" effect="light">标签</t-tag>、
        <t-typography code>代码</t-typography> 或链接。
      </p>
      <template #actions>
        <t-button size="small" type="primary">查看详情</t-button>
        <t-button size="small">忽略</t-button>
      </template>
    </t-comment>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.cm-demo2 {
  max-width: 620px;
}
.cm-demo2__p {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--pui-text-sub, #5b6879);
}
</style>
