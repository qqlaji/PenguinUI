<template>
  <Teleport to="body">
    <transition name="fade">
      <div :class="['penguin-modal-default',customClass]" v-if="modelValue" @click="closeModal($event)">
        <div class="penguin-modal-contentbox" :style="{'width':width,'top':top}">
          <div class="penguin-modal-header">
            <p class="penguin-modal-title" :style="{'text-align':align=='center'?align:''}">
              <slot name="header" v-if="$slot['header']"></slot>
              <span v-else>{{title}}</span>
            </p>
            <i class="penguin-modal-close t-icon-close" @click="close" v-if="showClose"></i>
          </div>
          <div class="penguin-modal-content">
            <slot name="content"></slot>
          </div>
          <div class="penguin-modal-footer" :style="{'text-align':align=='center'?align:''}">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport> 
</template>
<script>
export default{
  name:"tModal"
}
</script>
<script setup>
import {useSlots,ref,watchEffect,onMounted} from 'vue'
const props = defineProps({
  title:{
    type:String,
    default:"标题"
  },
  modelValue:Boolean,
  align:{
    type:String,
    default:""
  },
  scrollLock: {
    type:Boolean,
    default:true
  },
  width:{
    type:String,
    default:'35%'
  },
  top:{
    type:String,
    default:'15%'
  },
  showClose:{
    type:Boolean,
    default:true
  },
  closeOnModal:{
    type:Boolean,
    default:true
  },
  customClass:String
})
const emit = defineEmits(['update:modelValue','close'])
const $slot = useSlots()
const close = () =>{
  emit('close')
  emit('update:modelValue',false)
}
onMounted(() => {
  watchEffect(()=>{
    if(props.modelValue){
      if(props.scrollLock){
        if(typeof document !== 'undefined'){
          document.body.style['overflow'] = 'hidden'
        }
      }
    }else{
      if(typeof document !== 'undefined'){
        document.body.style['overflow'] = 'initial'
      }
    }
  })
})
const closeModal = (e) =>{
  if(props.closeOnModal){
    if(e.target.className=='penguin-modal-default'){
      emit('update:modelValue',false)
      emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.penguin-modal-default{
  width:100%;
  height:100%;
  position: fixed;
  top:0;
  left:0;
  background: rgba(0,0,0,.4);
  z-index: 8880;
  .penguin-modal-contentbox{
    width:35%;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 12px 0 rgba(7, 7, 7, 0.1);
    .penguin-modal-header{
      width:100%;
      height: 50px;
      position: relative;
      padding:0 20px;
      box-sizing: border-box;
      border-bottom:1px solid #f0f0f0;
      .penguin-modal-title{
        margin:0;
        line-height: 50px;
        color:#505050;
        font-size:17px;
      }
      i.penguin-modal-close{
        line-height: 50px;
        font-size:17px;
        position: absolute;
        right:20px;
        top:0;
        cursor: pointer;
      }
    }
    .penguin-modal-content{
      padding:20px;
      box-sizing: border-box;
    }
    .penguin-modal-footer{
      border-top:1px solid #f0f0f0;
      text-align: right;
      padding:10px 20px;
      box-sizing: border-box;
    }
  }
}

/* ===== v1.11 视觉统一：圆角 / 阴影 / 遮罩 / 居中 ===== */
.penguin-modal-default {
  background: rgba(20, 28, 44, 0.45);
  backdrop-filter: blur(2px);
}
.penguin-modal-default .penguin-modal-contentbox {
  width: min(520px, calc(100vw - 32px));
  top: 50%;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(24, 44, 78, 0.22);
  overflow: hidden;
}
.penguin-modal-default .penguin-modal-header { border-bottom-color: var(--pui-border, #e7ecf3); }
.penguin-modal-default .penguin-modal-title { color: var(--pui-text, #1c2534); font-weight: 650; }
.penguin-modal-default .penguin-modal-footer { border-top-color: var(--pui-border, #e7ecf3); }
.penguin-modal-default i.penguin-modal-close {
  color: var(--pui-text-muted, #8b96a6);
  transition: color 0.15s ease;

  &:hover { color: var(--pui-text, #1c2534); }
}
</style>
