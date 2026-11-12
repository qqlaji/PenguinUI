<template>
  <Transition name="slide-fade">
    <div :class="['penguin-message', customClass]" :style="[currentStyle, { top: `${top}px` }]" v-show="isShow">
      <template v-if="isText">
        <i class="iconfont" :class="[currentStyle.icon]"></i>
        <span class="text">{{ text }}</span>
      </template>
      <template v-else>
        <slot />
      </template>
      <button v-if="closable" type="button" class="penguin-message__close" aria-label="关闭" @click="close">
        <i class="iconfont t-icon-close"></i>
      </button>
    </div>
  </Transition>
</template>
<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
const props = defineProps({
  text: { type: [String, Object], default: '' },
  type: { type: String, default: 'info' },
  icon: String,
  textColor: String,
  bgColor: String,
  customClass: String,
  // ===== v1.9 新增 =====
  closable: Boolean,
  top: { type: Number, default: 25 },
  closeHandler: { type: Function, default: null }
})
const state = reactive({
  style: {
    info: { icon: props.icon || 't-icon-prompt-filling', color: '#505050', backgroundColor: 'rgb(229 227 224)', borderColor: 'rgb(229 227 224)' },
    warn: { icon: props.icon || 't-icon-warning', color: '#f57b29', backgroundColor: 'rgb(243 233 220)', borderColor: 'rgb(243 233 220)' },
    error: { icon: props.icon || 't-icon-delete-filling', color: '#ec3437', backgroundColor: 'rgb(251 228 228)', borderColor: 'rgb(251 228 228)' },
    success: { icon: props.icon || 't-icon-success', color: '#09b63d', backgroundColor: 'rgb(223 243 212)', borderColor: 'rgb(223 243 212)' },
    custom: { icon: props.icon, color: props.textColor, backgroundColor: props.bgColor, borderColor: props.bgColor }
  }
})
const { style } = state
// 未知 type 时回退到 info，避免读取 undefined.icon 报错
const currentStyle = computed(() => style[props.type] || style.info)
const isShow = ref(false)
const isText = computed(() => typeof props.text === 'string')
const close = () => {
  isShow.value = false
  setTimeout(() => props.closeHandler?.(), 300)
}
onMounted(() => {
  isShow.value = true
})
</script>
<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

div.slide-fade-enter-from,
div.slide-fade-leave-to {
  transform: translate3d(-50%, -75px, 0);
}
.penguin-message {
  position: fixed;
  z-index: 9999;
  left: 50%;
  top: 25px;
  transform: translateX(-50%);
  height: auto;
  display: flex;
  align-items: center;
  min-height: 45px;
  padding: 5px 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  i {
    margin-right: 8px;
    vertical-align: middle;
    font-size: 16px;
    height: 100%;
    display: inline-block;
    float: left;
  }
  .text {
    vertical-align: middle;
    font-size: 14px;
    line-height: 22px;
  }
}
/* ===== v1.9 新增：手动关闭 ===== */
.penguin-message__close {
  margin-left: 14px;
  margin-right: -8px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.6;
  padding: 2px;
  i { margin: 0; font-size: 13px; float: none; }
  &:hover { opacity: 1; }
}
</style>
