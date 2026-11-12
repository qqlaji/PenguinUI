<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import demo3 from './demo3.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Upload 上传
#### 文件选择、拖拽上传与上传队列管理，支持点击上传、拖拽区、图片列表预览、手动上传，以及数量与大小限制，可通过 `action` 或 `httpRequest` 接入任意后端。

<br />

## 基础用法
#### 点击按钮选择文件，自动上传并展示进度与状态；下方为拖拽上传区，可把文件拖入其中。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="upload" demoname="demo1"/>

<br />

## 图片列表
#### `list-type="picture"` 时图片自动生成缩略图，鼠标悬停出现删除按钮，点击缩略图可预览大图。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="upload" demoname="demo2"/>

<br />

## 手动上传与限制
#### 关闭 `auto-upload`，由「开始上传」触发；限制 3 个、单文件 ≤ 2MB，超限自动标记失败，超额触发 `exceed` 事件。

<div class="componetnsBox">
  <demo3/>
</div>
<preview compname="upload" demoname="demo3"/>

<br />

## Attributes 参数

<Attributes/>
<br/>

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 文件列表变化（v-model） | UploadFile[] |
| change | 文件列表变化 | UploadFile[] |
| progress | 上传进度变化 | { file, percentage } |
| success | 单个文件上传成功 | { file, response } |
| error | 单个文件上传失败 | { file, error } |
| remove | 文件被移除 | UploadFile |
| exceed | 超出 limit 限制 | File[] |
| preview | 点击图片预览 | UploadFile |

<br />

## 方法（通过 ref 调用）

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| submit | 上传所有 `ready` 状态文件 | — |
| clearFiles | 清空文件列表 | — |
| abort | 中止某个文件的上传 | uid 或 UploadFile |

<br />

## UploadFile 数据结构

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| uid | string | 唯一标识 |
| name | string | 文件名 |
| size | number | 字节大小 |
| status | string | ready / uploading / success / error |
| percentage | number | 上传进度 0-100 |
| url | string | 图片缩略图地址 |
| raw | File | 原始 File 对象 |
| response | any | 上传成功响应 |

<br />
