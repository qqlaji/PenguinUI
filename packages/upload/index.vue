<template>
  <div class="pui-upload" :class="[`pui-upload--${listType}`, { 'is-disabled': disabled }]">
    <input
      ref="inputRef"
      class="pui-upload__input"
      type="file"
      :multiple="multiple"
      :accept="accept || null"
      @change="handleChange"
    />

    <!-- 拖拽上传区 -->
    <div
      v-if="drag"
      class="pui-upload__drag"
      :class="{ 'is-dragover': dragover }"
      role="button"
      tabindex="0"
      :aria-disabled="disabled"
      @click="trigger"
      @keydown.enter.prevent="trigger"
      @keydown.space.prevent="trigger"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <i class="t-icon-upload pui-upload__drag-icon"></i>
      <div class="pui-upload__drag-text">将文件拖到此处，或<em>点击上传</em></div>
      <div v-if="accept" class="pui-upload__drag-hint">支持格式：{{ accept }}</div>
    </div>

    <!-- 点击触发区（支持自定义 #trigger 插槽） -->
    <slot v-else name="trigger" :trigger="trigger">
      <button type="button" class="pui-upload__trigger" :disabled="disabled" @click="trigger">
        <i class="t-icon-upload"></i><span>点击上传</span>
      </button>
    </slot>

    <!-- 文件列表 -->
    <ul v-if="fileList.length" class="pui-upload__list" :class="`pui-upload__list--${listType}`">
      <li
        v-for="item in fileList"
        :key="item.uid"
        class="pui-upload__item"
        :class="[`is-${item.status}`, { 'pui-upload__item--picture': listType === 'picture' }]"
      >
        <div v-if="listType === 'picture'" class="pui-upload__thumb" @click="handlePreview(item)">
          <img v-if="item.url" :src="item.url" alt="" />
          <i v-else class="t-icon-picture"></i>
        </div>
        <i v-else class="t-icon-file pui-upload__file-icon"></i>

        <div class="pui-upload__info">
          <span class="pui-upload__name" :title="item.name">{{ item.name }}</span>
          <span v-if="item.status === 'uploading'" class="pui-upload__percent">{{ item.percentage }}%</span>
          <span v-else-if="item.status === 'error'" class="pui-upload__errmsg">上传失败</span>
        </div>

        <i v-if="item.status === 'uploading'" class="t-icon-loading1 pui-upload__spin"></i>
        <i v-else-if="item.status === 'success'" class="t-icon-success-filling pui-upload__ok"></i>
        <i v-else-if="item.status === 'error'" class="t-icon-error pui-upload__fail"></i>
        <i class="t-icon-close pui-upload__remove" @click="handleRemove(item)"></i>
      </li>
    </ul>

    <!-- 图片预览灯箱 -->
    <teleport to="body">
      <div v-if="previewVisible" class="pui-upload__preview-mask" @click="previewVisible = false">
        <img class="pui-upload__preview-img" :src="previewImage" @click.stop />
      </div>
    </teleport>
  </div>
</template>

<script>
export default { name: 'tUpload' };
</script>

<script setup>
import { ref, watch, shallowReactive } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  action: { type: String, default: '' }, // 上传地址（POST，FormData）
  httpRequest: { type: Function, default: null }, // 自定义上传 (opts) => Promise
  multiple: { type: Boolean, default: false },
  accept: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  drag: { type: Boolean, default: false },
  autoUpload: { type: Boolean, default: true },
  listType: { type: String, default: 'text' }, // text | picture
  limit: { type: Number, default: 0 }, // 最大数量，0 不限
  maxSize: { type: Number, default: 0 }, // 单文件最大字节，0 不限
  name: { type: String, default: 'file' }, // FormData 字段名
  headers: { type: Object, default: () => ({}) },
  data: { type: Object, default: () => ({}) }, // 附加上传字段
  withCredentials: { type: Boolean, default: false },
  beforeUpload: { type: Function, default: null } // (rawFile) => bool | Promise<bool>
});

const emit = defineEmits([
  'update:modelValue',
  'change',
  'progress',
  'success',
  'error',
  'remove',
  'exceed',
  'preview'
]);

let seed = 0;
const fileList = ref(props.modelValue.map((it) => shallowReactive({ ...it })));
const inputRef = ref(null);
const dragover = ref(false);
const previewVisible = ref(false);
const previewImage = ref('');

watch(
  () => props.modelValue,
  (v) => {
    if (Array.isArray(v) && v !== fileList.value) fileList.value = v.map((it) => shallowReactive({ ...it }));
  }
);

function syncEmit() {
  const list = fileList.value;
  emit('update:modelValue', list);
  emit('change', list);
}

function genUid() {
  return `pui-${Date.now()}-${seed++}`;
}

function isImage(file) {
  if (file.type && file.type.indexOf('image') > -1) return true;
  return /\.(png|jpe?g|gif|bmp|webp|svg|ico)$/i.test(file.name || '');
}

function buildItem(raw) {
  return {
    uid: genUid(),
    name: raw.name,
    size: raw.size,
    type: raw.type,
    status: 'ready',
    percentage: 0,
    raw,
    url: '',
    response: null
  };
}

function trigger() {
  if (props.disabled) return;
  if (inputRef.value) inputRef.value.click();
}

function onDragOver() {
  if (!props.disabled) dragover.value = true;
}
function onDragLeave() {
  dragover.value = false;
}
function onDrop(e) {
  dragover.value = false;
  if (props.disabled) return;
  const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
  if (files.length) addFiles(files);
}

function handleChange(e) {
  const files = Array.from(e.target.files || []);
  if (inputRef.value) inputRef.value.value = '';
  if (files.length) addFiles(files);
}

async function addFiles(files) {
  if (props.disabled) return;
  let list = files;
  if (props.limit > 0) {
    const remain = props.limit - fileList.value.length;
    if (remain <= 0) {
      emit('exceed', list);
      return;
    }
    if (list.length > remain) {
      emit('exceed', list.slice(remain));
      list = list.slice(0, remain);
    }
  }
  for (const raw of list) {
    if (props.maxSize > 0 && raw.size > props.maxSize) {
      const item = shallowReactive(buildItem(raw));
      item.status = 'error';
      item.response = { message: '文件超过大小限制' };
      fileList.value.push(item);
      syncEmit();
      emit('error', { file: item, error: new Error('size exceeded') });
      continue;
    }
    let go = true;
    if (props.beforeUpload) {
      const r = props.beforeUpload(raw);
      if (r && typeof r.then === 'function') {
        try {
          const res = await r;
          go = res !== false;
        } catch (err) {
          go = false;
        }
      } else {
        go = r !== false;
      }
    }
    if (!go) continue;
    const item = shallowReactive(buildItem(raw));
    if (props.listType === 'picture' && isImage(raw)) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        item.url = ev.target.result;
      };
      reader.readAsDataURL(raw);
    }
    fileList.value.push(item);
    syncEmit();
    if (props.autoUpload) executeUpload(item);
  }
}

function executeUpload(item) {
  item.status = 'uploading';
  item.percentage = 0;
  const onProgress = (p) => {
    const percent =
      typeof p === 'number'
        ? p
        : p && p.total
        ? Math.round((p.loaded / p.total) * 100)
        : item.percentage;
    item.percentage = percent;
    emit('progress', { file: item, percentage: percent });
  };
  const onSuccess = (res) => {
    item.status = 'success';
    item.response = res;
    emit('success', { file: item, response: res });
    syncEmit();
  };
  const onError = (err) => {
    item.status = 'error';
    emit('error', { file: item, error: err });
    syncEmit();
  };
  if (props.httpRequest) {
    Promise.resolve(props.httpRequest({ file: item, onProgress, onSuccess, onError })).catch(onError);
  } else if (props.action) {
    xhrUpload(item, onProgress, onSuccess, onError);
  }
  // 若既无 action 也无 httpRequest：文件保持 ready，调用 submit() 手动上传
}

function xhrUpload(item, onProgress, onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  item._xhr = xhr;
  xhr.open('POST', props.action, true);
  if (props.withCredentials) xhr.withCredentials = true;
  for (const k in props.headers) xhr.setRequestHeader(k, props.headers[k]);
  xhr.upload.onprogress = (e) => onProgress(e);
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      onError(new Error('HTTP ' + xhr.status));
      return;
    }
    let res = xhr.responseText;
    try {
      res = JSON.parse(res);
    } catch (_) {
      /* 非 JSON 直接透传 */
    }
    onSuccess(res);
  };
  xhr.onerror = () => onError(new Error('network error'));
  const form = new FormData();
  for (const k in props.data) form.append(k, props.data[k]);
  form.append(props.name, item.raw, item.name);
  xhr.send(form);
}

function handleRemove(item) {
  if (item._xhr) {
    try {
      item._xhr.abort();
    } catch (_) {
      /* noop */
    }
  }
  if (item.url && item.url.indexOf('blob:') === 0) URL.revokeObjectURL(item.url);
  const i = fileList.value.findIndex((f) => f.uid === item.uid);
  if (i > -1) fileList.value.splice(i, 1);
  syncEmit();
  emit('remove', item);
}

function handlePreview(item) {
  if (!item.url) return;
  previewImage.value = item.url;
  previewVisible.value = true;
  emit('preview', item);
}

function submit() {
  fileList.value.filter((f) => f.status === 'ready').forEach(executeUpload);
}

function clearFiles() {
  fileList.value.forEach((f) => {
    if (f.url && f.url.indexOf('blob:') === 0) URL.revokeObjectURL(f.url);
  });
  fileList.value = [];
  syncEmit();
}

function abort(file) {
  const uid = typeof file === 'string' ? file : file && file.uid;
  const item = fileList.value.find((f) => f.uid === uid);
  if (item && item._xhr) {
    try {
      item._xhr.abort();
    } catch (_) {
      /* noop */
    }
  }
}

defineExpose({ submit, clearFiles, abort });
</script>

<style scoped lang="scss">
.pui-upload {
  display: inline-block;
  width: 100%;
  &__input {
    display: none;
  }
  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 16px;
    cursor: pointer;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 8px;
    background: var(--pui-bg, #fff);
    color: var(--pui-text-sub, #5b6879);
    font-size: 14px;
    transition: all 0.18s ease;
    &:hover {
      border-color: var(--pui-brand, #0e80eb);
      color: var(--pui-brand, #0e80eb);
    }
    i {
      font-size: 16px;
    }
  }

  &__drag {
    border: 1.5px dashed var(--pui-border-strong, #d8e0ea);
    border-radius: 10px;
    background: var(--pui-bg-soft, #f7f9fc);
    padding: 28px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.18s ease;
    outline: none;
    &:hover,
    &.is-dragover {
      border-color: var(--pui-brand, #0e80eb);
      background: var(--pui-brand-soft, rgba(14, 128, 235, 0.08));
    }
    &:focus-visible {
      box-shadow: 0 0 0 3px var(--pui-brand-soft, rgba(14, 128, 235, 0.18));
    }
  }
  &__drag-icon {
    font-size: 40px;
    color: var(--pui-brand, #0e80eb);
  }
  &__drag-text {
    margin-top: 8px;
    font-size: 14px;
    color: var(--pui-text-sub, #5b6879);
    em {
      font-style: normal;
      color: var(--pui-brand, #0e80eb);
    }
  }
  &__drag-hint {
    margin-top: 4px;
    font-size: 12px;
    color: var(--pui-text-muted, #8b96a6);
  }

  &__list {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
  }
  &__list--picture {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid var(--pui-border, #e7ecf3);
    border-radius: 8px;
    background: var(--pui-bg, #fff);
    margin-bottom: 8px;
    transition: all 0.18s ease;
    &.is-success {
      border-color: var(--pui-success, #09b63d);
    }
    &.is-error {
      border-color: var(--pui-danger, #ec3437);
    }
  }
  &__file-icon {
    font-size: 18px;
    color: var(--pui-text-sub, #5b6879);
  }
  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: var(--pui-text, #1c2534);
  }
  &__percent {
    font-size: 12px;
    color: var(--pui-brand, #0e80eb);
  }
  &__errmsg {
    font-size: 12px;
    color: var(--pui-danger, #ec3437);
  }
  &__spin {
    font-size: 16px;
    color: var(--pui-brand, #0e80eb);
    animation: pui-upload-spin 0.9s linear infinite;
  }
  &__ok {
    font-size: 16px;
    color: var(--pui-success, #09b63d);
  }
  &__fail {
    font-size: 16px;
    color: var(--pui-danger, #ec3437);
  }
  &__remove {
    font-size: 14px;
    color: var(--pui-text-muted, #8b96a6);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
  }
  &__item:hover &__remove {
    opacity: 1;
  }
  &__remove:hover {
    color: var(--pui-danger, #ec3437);
  }

  &__item--picture {
    width: 110px;
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
    margin-bottom: 0;
    position: relative;
    .pui-upload__thumb {
      height: 92px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      background: var(--pui-bg-soft, #f7f9fc);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      i {
        font-size: 34px;
        color: var(--pui-text-muted, #8b96a6);
      }
    }
    .pui-upload__info {
      margin-top: 6px;
    }
    .pui-upload__name {
      font-size: 12px;
    }
    .pui-upload__remove {
      position: absolute;
      top: 4px;
      right: 4px;
      opacity: 1;
      background: var(--pui-mask, rgba(18, 28, 45, 0.42));
      color: #fff;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .pui-upload__spin,
    .pui-upload__ok,
    .pui-upload__fail {
      position: absolute;
      top: 6px;
      left: 6px;
      background: var(--pui-bg, #fff);
      border-radius: 50%;
    }
  }

  &__preview-mask {
    position: fixed;
    inset: 0;
    z-index: 3000;
    background: var(--pui-mask, rgba(18, 28, 45, 0.42));
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__preview-img {
    max-width: 86vw;
    max-height: 86vh;
    border-radius: 8px;
    box-shadow: var(--pui-shadow-lg, 0 24px 60px rgba(24, 44, 78, 0.16));
  }
}

@keyframes pui-upload-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pui-upload__spin {
    animation: none;
  }
}
</style>
