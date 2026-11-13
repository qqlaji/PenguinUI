<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import preview from '@/components/preview.vue'
</script>

# AudioPlayer 音频播放器

#### 轻量音频播放器，支持进度拖拽、音量、倍速、循环与波形动画

<br />

## 基础用法

#### 传入 `src` 即可播放；进度条支持拖拽与键盘操作，`variant` 可切换紧凑形态。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="audioPlayer" demoname="demo1"/>

<br />

## 卡片模式与事件

#### `variant="card"` 展示封面并带播放动画；所有交互都会派发事件。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="audioPlayer" demoname="demo2"/>

<br />

## Attributes

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| src | string | 音频地址 | `''` |
| title | string | 标题 | `''` |
| subtitle | string | 副标题 | `''` |
| cover | string | 封面图 | `''` |
| variant | string | `default` / `mini` / `card` | `'default'` |
| autoplay | boolean | 自动播放（浏览器可能拦截） | `false` |
| loop | boolean | 初始是否循环 | `false` |
| loopable | boolean | 是否显示循环按钮 | `true` |
| volume | number | 初始音量 0~1 | `0.8` |
| showVolume | boolean | 是否显示音量控制 | `true` |
| rates | array | 可选倍速列表，传 `[]` 隐藏 | `[1, 1.25, 1.5, 2]` |
| playbackRate | number | 初始倍速 | `1` |
| downloadable | boolean | 是否显示下载按钮 | `false` |
| downloadName | string | 下载文件名 | `''` |
| disabled | boolean | 禁用 | `false` |

**事件**

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| play / pause | 播放状态变化 | — |
| ended | 播放结束 | — |
| timeupdate | 播放进度更新 | `{ currentTime, duration }` |
| seeking / seeked | 拖动进度 | `number` |
| volume-change | 音量变化 | `{ volume, muted }` |
| rate-change | 倍速变化 | `number` |
| error | 加载或播放失败 | `Error` |

**方法**：`play()`、`pause()`、`seek(seconds)`、`getState()`

<br />

## 说明

- 音频加载失败会显示具体原因（网络错误 / 格式不支持 / 解码失败），不会静默失败
- 进度条拖拽时显示悬浮时间气泡，松开才真正跳转，避免拖动过程中频繁 seek
- 循环用自定义 `ended` 处理而不是原生 `loop`，方便在循环时派发事件
- 组件卸载时会 `pause()` 并清空 `src`，避免继续占用网络与内存
- `variant="card"` 的波形动画在 `prefers-reduced-motion` 下会自动关闭
