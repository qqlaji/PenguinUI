<template>
    <t-space :size="[0, 60]">
        <t-badge value="一张图片">
            <img src="/src/assets/logo.png" alt="">
        </t-badge>
        <t-badge value="button按钮">
            <t-button type="primary">button按钮</t-button>
        </t-badge>
    </t-space>
</template>

<style scoped>
img {
    width: 100px;
}
</style>