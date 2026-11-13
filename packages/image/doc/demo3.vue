<template>
  <div class="img-demo">
    <t-image :src="pic1" width="64" height="64" fit="cover" round :preview="false" />

    <t-image :src="pic2" width="120" height="120" fit="cover" :radius="20" :preview="false" />

    <t-image
      :src="brokenSrc"
      width="120"
      height="120"
      :preview="false"
    />

    <t-image src="" width="120" height="120" :preview="false">
      <template #error>
        <span style="font-size:12px">暂无图片</span>
      </template>
    </t-image>
  </div>
  <p class="img-tip">圆形头像、自定义圆角、加载失败兜底、自定义 error 插槽</p>
</template>

<script setup>
import { pic1, pic2 } from './pics';

// 故意非法的 data URI：触发 error 分支展示兜底，但不产生 404 网络请求
const brokenSrc = 'data:image/png;base64,AAAA';
</script>

<style scoped>
.img-demo {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.img-tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--pui-text-3, #6b7280);
}
</style>
