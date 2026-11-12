<template>
  <div class="demo-row">
    <t-avatar size="small" text="P" />
    <t-avatar text="P" />
    <t-avatar size="large" text="P" />
    <t-avatar :size="64" text="64" bgColor="#efe9ff" color="#7b5cff" />
  </div>
  <div class="demo-row">
    <t-avatar shape="square" text="方" bgColor="#e6f8ee" color="#09b63d" />
    <t-avatar icon="t-icon-user" />
    <t-avatar icon="t-icon-penguin" bgColor="#fff3e8" color="#f57b29" />
    <t-avatar bordered text="描" />
    <t-avatar :src="avatarSrc" alt="企鹅" />
    <t-avatar src="/not-exist.png" alt="回退" />
  </div>
</template>

<script setup>
const avatarSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%230e80eb'/%3E%3Ctext x='32' y='42' font-size='30' text-anchor='middle' fill='white'%3EP%3C/text%3E%3C/svg%3E"
</script>

<style scoped>
.demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-bottom: 20px; }
</style>
