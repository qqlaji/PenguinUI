<template>
  <div :class="[`penguin-group-input-${size}`, statusClass]" :style="groupStyle">
    <span v-if="$slots.prefix" class="penguin-input-affix"><slot name="prefix" /></span>
    <div :class="isClass" :style="[isStyle, innerStyle]">
      <i :class="['left-icon','iconfont',resolvedLeftIcon]" v-if="!showPassword&&resolvedLeftIcon!==''"></i>
      <input :type="inptype" @focus="focus" @blur="blur" :value="modelValue"  @input="iptChange" :disabled="disabled" @change="change" :placeholder="placeholder" :autofocus="autofocus" :readonly="readonly" :form="form" :maxlength="maxlength || undefined"/>
       <transition name="slide-fade">
        <i class="clearable-icon iconfont t-icon-close" v-if="!showPassword&&clearable&&modelValue!==''" @click="clear"></i>
      </transition>
      <i :class="['right-icon','iconfont',resolvedRightIcon]" v-if="!showPassword&&resolvedRightIcon!==''"></i>
      <i v-if="showPassword"  :class="['password-icon','iconfont t-icon-browse']" @click="showPwd"></i>
    </div>
    <span v-if="$slots.suffix" class="penguin-input-affix"><slot name="suffix" /></span>
    <span v-if="showWordLimit" class="penguin-input-limit">{{ valueLength }} / {{ maxlength || '∞' }}</span>
    <slot name="btn"/>
  </div>
</template>
<script>
import { reactive, ref,computed, useSlots} from 'vue'
export default {
  name:"tInput"
}
</script>
<script setup>
const emit = defineEmits(['update:modelValue','clear','focus','blur','input','change'])
const props = defineProps({
  modelValue:String|Number,
  disabled:Boolean,
  clearable:Boolean,
  showPassword:Boolean,
  type:String,
  size:{
    type:String,
    default:'default'
  },
  leftIcon:{
    type:String,
    default:""
  },
  rightIcon:{
    type:String,
    default:""
  },
  placeholder:String,
  //当页面加载时 <input> 元素自动获得焦点
  autofocus:Boolean,
  focusColor:{
    type:String,
    default:'#0e80eb'
  },
  readonly:Boolean,
  form:String,
  // ===== v1.9 新增 =====
  // 与 leftIcon / rightIcon 等价的语义化别名
  prefixIcon: { type: String, default: '' },
  suffixIcon: { type: String, default: '' },
  maxlength: { type: [Number, String], default: '' },
  showWordLimit: Boolean,
  status: { type: String, default: '' }   // error | success | warning
})
const slot = useSlots()
// ===== v1.9 新增：图标别名、前后缀、字数统计与状态 =====
const resolvedLeftIcon = computed(() => props.leftIcon || props.prefixIcon)
const resolvedRightIcon = computed(() => props.rightIcon || props.suffixIcon)
const valueLength = computed(() => String(props.modelValue ?? '').length)
const hasAffix = computed(() => !!(slot.prefix || slot.suffix || props.showWordLimit))
const groupStyle = computed(() => hasAffix.value
  ? { 'min-width': 'auto', display: 'flex', 'align-items': 'center', gap: '6px' }
  : { 'min-width': 'auto' })
const innerStyle = computed(() => hasAffix.value
  ? { flex: '1', 'min-width': '0', float: 'none', width: '100%' }
  : {})
const statusClass = computed(() => props.status ? `penguin-input-status-${props.status}` : '')
const isStyle = ref({})
/**
 * 实际渲染的 input type：
 * props.type 变化要能跟随（原来是 ref 只在初始化时读一次，动态改不生效），
 * 同时保留「小眼睛」切换明文的内部状态。
 */
const pwdVisible = ref(false)
const inptype = computed(() => {
  if (props.type === 'password') return pwdVisible.value ? 'text' : 'password'
  return props.type || 'text'
})
let focusStyle = {
  'width':!!slot.btn?'auto':'100%',
  'float':!!slot.btn?'left':'auto',
  'border-radius':!!slot.btn?'10px 0 0 10px':'10px',
  'border-color':'#dcdfe6f6'
}
isStyle.value = focusStyle
const focus  = (e) =>{
  focusStyle['border-color'] = "#0e80eb"
  isStyle.value = {
  'width':!!slot.btn?'auto':'100%',
  'float':!!slot.btn?'left':'auto',
  'border-radius':!!slot.btn?'10px 0 0 10px':'10px',
  'border-color':props.focusColor
}
  emit('focus',e)
}
const blur  = (e) =>{
  isStyle.value = {
    'width':!!slot.btn?'auto':'100%',
    'float':!!slot.btn?'left':'auto',
    'border-radius':!!slot.btn?'10px 0 0 10px':'10px',
  }
  emit('blur',e)
}
const iptChange = (e) => {
  emit('update:modelValue', e.target.value)
  emit('input',e.target.value)
}
const change = (e) =>{
  emit('change',e)
}
const clear = (e) =>{
  emit('update:modelValue', "")
  emit('clear')
}
// 显示密码
const showPwd = () =>{
  pwdVisible.value = !pwdVisible.value
}
const isClass = computed(()=>{
  return [
    props.clearable?'penguin-input-clearable':props.size=='default'?'penguin-input-default':`penguin-input-${props.size}`,
    resolvedLeftIcon.value!=""?`penguin-input-left-icon-${props.size}`:!props.clearable?resolvedRightIcon.value!=""?`penguin-input-right-icon-${props.size}`:'':'',
    props.disabled?'penguin-input-disabled':'',
    props.type=='password'?props.showPassword?`penguin-input-password-showpassword-${props.size}`:`penguin-input-password-${props.size}`:''
  ]
})
</script>
<style scoped lang="scss">
.penguin-input-default,.penguin-input-password-default,.penguin-input-password-showpassword-default,.penguin-group-input-default{
  width:100%;
  height:35px;
  border:1px solid #dcdfe6f6;
  overflow: hidden;
  border-radius:4px;
  transition: all .2s ease;
  position: relative;
  box-sizing: border-box;
  input{
    width:100%;
    font-size:14px;
    outline:none;
    border:0;
    margin:0;
    padding:10px 10px 10px 10px;
    box-sizing: border-box;
    color:#606266;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 14px;
  }
  i.password-icon{
    position:absolute;
    right:10px;
    top:11px;
    color:#94969b;
    transition: all .2s ease;
    cursor: pointer;
  }
}
.penguin-input-password-showpassword-default{
  input{
    padding-right:30px
  }
}
.penguin-input-clearable{
  width:100%;
  height:35px;
  border:1px solid #dcdfe6f6;
  overflow: hidden;
  border-radius:4px;
  transition: all .2s ease;
  position: relative;
  box-sizing: border-box;
  input{
    width:100%;
    font-size:14px;
    outline:none;
    border:0;
    margin:0;
    padding:10px 30px 10px 10px;
    box-sizing: border-box;
    color:#606266;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 14px;
  }
  .clearable-icon{
    position:absolute;
    right:10px;
    top:10px;
    color:#94969b;
    transition: all .2s ease;
    cursor: pointer;
  }
}
.penguin-input-small,.penguin-input-password-small,.penguin-input-password-showpassword-small,.penguin-group-input-small{
  width:100%;
  height:30px;
  border:1px solid #dcdfe6f6;
  overflow: hidden;
  border-radius:4px;
  transition: all .2s ease;
  position: relative;
  box-sizing: border-box;
  input{
    width:100%;
    font-size:13px;
    outline:none;
    border:0;
    margin:0;
    padding:7px 30px 7px 10px;
    box-sizing: border-box;
    color:#606266
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 13px;
  }
  i.password-icon{
    position:absolute;
    right:10px;
    top:8px;
    color:#94969b;
    transition: all .2s ease;
    cursor: pointer;
  }
}
.penguin-input-password-showpassword-small{
  input{
    padding-right:30px
  }
}
.penguin-input-mini,.penguin-input-password-mini,.penguin-input-password-showpassword-mini,.penguin-group-input-mini{
  width:100%;
  height:28px;
  border:1px solid #dcdfe6f6;
  overflow: hidden;
  border-radius:4px;
  transition: all .2s ease;
  position: relative;
  box-sizing: border-box;
  input{
    width:100%;
    font-size:12px;
    outline:none;
    border:0;
    margin:0;
    padding:6px 10px 6px 10px;
    box-sizing: border-box;
    color:#606266;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 12px;
  }
  i.password-icon{
    position:absolute;
    right:10px;
    top:7px;
    color:#94969b;
    transition: all .2s ease;
    cursor: pointer;
  }
}
.penguin-input-password-showpassword-mini{
  input{
    padding-right:30px
  }
}
.penguin-input-left-icon-default{
  height:35px;
  input{
    padding:10px 25px 10px 32px;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 14px;
  }
  .left-icon{
    position:absolute;
    left:10px;
    top:11px;
    color:#94969b;
  }
}
.penguin-input-left-icon-small{
  height:30px;
  input{
    padding:7px 25px 7px 32px;
    font-size: 13px;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 13px;
  }
  .left-icon{
    position:absolute;
    left:10px;
    top:8px;
    font-size:13px;
    color:#94969b;
  }
  .clearable-icon{
    font-size:13px;
    top:8px;
  }
}
.penguin-input-left-icon-mini{
  height:28px;
  input{
    padding:6px 25px 6px 32px;
    font-size: 12px;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 12px;
  }
  .left-icon{
    position:absolute;
    left:10px;
    top:7px;
    font-size:12px;
    color:#94969b;
  }
  .clearable-icon{
    font-size:12px;
    top:7px;
  }
}
.penguin-input-right-icon-default{
  height:35px;
  input{
    padding:10px 32px 10px 10px;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
  }
  .right-icon{
    position:absolute;
    right:10px;
    top:11px;
    color:#94969b;
  }
}
.penguin-input-right-icon-small{
  height:30px;
  input{
    padding:7px 32px 7px 10px;
    font-size: 13px;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 13px;
  }
  .right-icon{
    position:absolute;
    right:10px;
    top:8px;
    font-size:13px;
    color:#94969b;
  }
}
.penguin-input-right-icon-mini{
  height:28px;
  input{
    padding:6px 32px 6px 10px;
    font-size: 12px;
  }
  input::placeholder { /* 大部分现代浏览器 */
    color:    #c6c8cc;
    font-size: 12px;
  }
  .right-icon{
    position:absolute;
    right:10px;
    top:7px;
    font-size:12px;
    color:#94969b;
  }
}
.penguin-input-disabled{
  input{
    cursor: no-drop;
    color:#c3bfbf;
  }
  .clearable-icon{
    display:none
  }
  .left-icon{
    position:absolute;
    left:10px;
    top:10px;
    color:#c6c8cc;
  }
  .right-icon{
    position:absolute;
    right:10px;
    top:10px;
    color:#c6c8cc;
  }
}
.penguin-group-input-default{
	border: none;
	height: auto;
}
.penguin-group-input-small{
	border: none;
	height: auto;
	.penguin-input-clearable{
		height: 30px;
		.clearable-icon{
			top:7px;
			font-size: 13px;
		}
	}
}
.penguin-group-input-mini{
	border: none;
	.penguin-input-clearable{
		height: 28px;
		.clearable-icon{
			top:8px;
			font-size: 12px;
		}
	}
}
.penguin-group-input-default :deep(.penguin-button){
  padding:9px 20px !important;
	border-radius: 0 2px 2px 0;
}
.penguin-group-input-small :deep(.penguin-button){
  padding:6.6px 15px !important;
	border-radius: 0 2px 2px 0;
}
.penguin-group-input-mini :deep(.penguin-button){
	padding:7px 15px !important;
  font-size: 12px;
	border-radius: 0 2px 2px 0;
	i{
		font-size: 12px;
	}
}
input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:    #c6c8cc;
}
input:-moz-placeholder { /* Mozilla Firefox 4 ~ 18 */
   color:    #c6c8cc;
}
input::-moz-placeholder { /* Mozilla Firefox 19+ */
   color:    #c6c8cc;
}
input:-ms-input-placeholder { /* Internet Explorer 10 ~ 11 */
   color:    #c6c8cc;
}
input::-ms-input-placeholder { /* Microsoft Edge */
   color:    #c6c8cc;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* ===== v1.9 新增：前后缀、字数统计、校验状态 ===== */
.penguin-input-affix {
  display: inline-flex;
  align-items: center;
  flex: none;
  font-size: 13px;
  color: #8b96a6;
  white-space: nowrap;
}
.penguin-input-limit {
  flex: none;
  font-size: 12px;
  color: #98a2b3;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.penguin-input-status-error > div { border-color: #ec3437 !important; }
.penguin-input-status-success > div { border-color: #09b63d !important; }
.penguin-input-status-warning > div { border-color: #f57b29 !important; }

/* ===== v1.11 视觉统一：圆角 / 高度 / 悬停与聚焦态 ===== */
.penguin-input-default,
.penguin-input-password-default,
.penguin-input-password-showpassword-default,
.penguin-input-clearable,
.penguin-input-small,
.penguin-input-password-small,
.penguin-input-password-showpassword-small,
.penguin-input-mini,
.penguin-input-password-mini,
.penguin-input-password-showpassword-mini {
  border-radius: 10px;
  border-color: var(--pui-border-strong, #d8e0ea);
  background: var(--pui-bg-elevated, #fff);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;

  input {
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
    color: var(--pui-text, #1c2534);
    font-variant-numeric: tabular-nums;

    &::placeholder { color: var(--pui-text-muted, #8b96a6); }
  }

  &:hover { border-color: var(--pui-brand, #0e80eb); }
  &:focus-within {
    border-color: var(--pui-brand, #0e80eb);
    box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.12));
  }
}
.penguin-input-default,
.penguin-input-password-default,
.penguin-input-password-showpassword-default,
.penguin-input-clearable { height: 36px; }

.penguin-input-small,
.penguin-input-password-small,
.penguin-input-password-showpassword-small { height: 30px; border-radius: 9px; }

.penguin-input-mini,
.penguin-input-password-mini,
.penguin-input-password-showpassword-mini { height: 28px; border-radius: 8px; }

.penguin-group-input-small .penguin-input-clearable { height: 30px; border-radius: 9px; }
.penguin-group-input-mini .penguin-input-clearable { height: 28px; border-radius: 8px; }

.penguin-input-clearable input,
.penguin-input-password-showpassword-default input,
.penguin-input-password-showpassword-small input,
.penguin-input-password-showpassword-mini input { padding-right: 32px; }

.penguin-input-disabled {
  background: var(--pui-bg-soft, #f7f9fc);
  opacity: 0.72;

  input { color: var(--pui-text-muted, #8b96a6); cursor: not-allowed; }
  &:hover { border-color: var(--pui-border-strong, #d8e0ea); }
}
</style>