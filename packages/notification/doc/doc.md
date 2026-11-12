<script setup>
import demo1 from './demo1.vue'
import demo2 from './demo2.vue'
import Attributes from './Attributes.vue'
import preview from '@/components/preview.vue'
</script>

# Notification 通知
#### 悬浮在页面右上角的全局通知，用于异步操作结果、系统提醒等需要用户感知但不打断流程的信息。

<br />

## 基础类型
#### 通过 `Notification.success/warning/error/info` 或传入 `type` 调用。

<div class="componetnsBox">
  <demo1/>
</div>
<preview compname="notification" demoname="demo1"/>

<br />

## 堆叠与常驻
#### 多条通知自动纵向堆叠；`duration: 0` 时不会自动关闭，需手动关闭。

<div class="componetnsBox">
  <demo2/>
</div>
<preview compname="notification" demoname="demo2"/>

<br />

## 调用方式

```js
import Notification from 'penguinui'  // 实际取 $notification
// 或 app.config.globalProperties.$notification
Notification.success({ title: '成功', message: '保存成功' })
const inst = Notification({ title: 'X', message: 'Y', duration: 0 })
inst.close() // 主动关闭
```

## Attributes 参数

<Attributes/>
<br />

## 方法

| 方法 | 说明 |
| --- | --- |
| Notification(options) | 弹出一条通知，返回含 `close()` 的实例 |
| Notification.success/info/warning/error(msg\|options) | 按类型快捷弹出 |
| Notification.close(id) | 按 id 关闭 |

<br />
