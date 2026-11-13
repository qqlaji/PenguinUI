<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import preview from '@/components/preview.vue'
</script>

# VideoPlayer 视频播放器

#### 基于原生 video 的自定义播放器，支持进度拖拽、音量、倍速、画中画与全屏

<br />

## 基础用法

#### 传入 `src` 即可播放，控制栏会在播放中自动隐藏，支持键盘快捷键。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="videoPlayer" demoname="demo1"/>

<br />

## 比例与配置

#### `aspect-ratio` 控制播放器比例，可单独关闭画中画、倍速或控制栏自动隐藏。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="videoPlayer" demoname="demo2"/>

<br />

## Attributes

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| src | string | 视频地址 | `''` |
| poster | string | 封面图 | `''` |
| aspectRatio | string | 宽高比 | `'16 / 9'` |
| width | number \| string | 宽度 | `'100%'` |
| preload | string | 预加载策略：`none` / `metadata` / `auto` | `'metadata'` |
| autoplay | boolean | 自动播放（通常需静音才允许） | `false` |
| loop | boolean | 循环播放 | `false` |
| muted | boolean | 静音 | `false` |
| volume | number | 初始音量 0~1 | `0.8` |
| showVolume | boolean | 是否显示音量控制 | `true` |
| rates | array | 可选倍速列表，传 `[]` 隐藏 | `[1, 1.25, 1.5, 2]` |
| playbackRate | number | 初始倍速 | `1` |
| controlsTimeout | number | 控制栏自动隐藏延时（ms），`0` 常驻 | `2600` |
| pip | boolean | 是否显示画中画按钮 | `true` |

**事件**

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| play / pause / ended | 播放状态变化 | — |
| timeupdate | 进度更新 | `{ currentTime, duration }` |
| seeking / seeked | 拖动进度 | `number` |
| fullscreen-change | 全屏状态变化 | `boolean` |
| rate-change | 倍速变化 | `number` |
| volume-change | 音量变化 | `{ volume, muted }` |
| error | 加载或播放失败 | `Error` |

**方法**：`play()`、`pause()`、`seek(seconds)`、`toggleFullscreen()`、`getState()`

<br />

## 说明

- 播放失败会显示具体原因（网络错误 / 解码失败 / 格式不支持），而不是黑屏
- 进度条 hover 会变粗并显示滑块，拖动时实时预览时间
- 全屏用 Fullscreen API，退出全屏时通过 `fullscreenchange` 同步状态，不会与实际状态不一致
- 控制栏自动隐藏在鼠标移出后仍然生效，但暂停时会强制常驻，避免"看不到按钮"
- 组件卸载时会 `pause()` 并清空 `src`
