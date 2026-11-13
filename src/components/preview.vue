<template>
  <div class="pre-code-box">
    <!-- 吸顶工具条：长代码滚到任何位置都能复制 / 收起 -->
    <div v-if="showCode" class="pre-toolbar">
      <span class="pre-toolbar__lang">Vue SFC</span>
      <span class="pre-toolbar__hint">{{ lineCount }} 行</span>
      <span class="pre-toolbar__spacer"></span>
      <button type="button" class="pre-toolbar__btn" @click="copyCode" aria-label="复制示例代码">
        <i :class="copied ? 't-icon-success' : 't-icon-copy'"></i>
        {{ copied ? "已复制" : "复制" }}
      </button>
      <button type="button" class="pre-toolbar__btn pre-toolbar__btn--primary" @click="hideCode" aria-label="收起示例代码">
        <i class="t-icon-arrow-up-filling"></i>
        收起代码
      </button>
    </div>

    <transition name="code-fold">
      <pre v-if="showCode" class="language-html"><code ref="codeEl" class="language-html">{{ sourceCode }}</code></pre>
    </transition>

    <div class="showCode" @click="toggleCode" role="button" tabindex="0" @keydown.enter="toggleCode" @keydown.space.prevent="toggleCode">
      <span>{{ showCode ? "隐藏代码" : "显示代码" }}</span>
      <i class="t-icon-code" :class="{ rotate: showCode }"></i>
    </div>
    <textarea ref="copyInput" class="pre-copy-input" aria-hidden="true" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import hljs from "highlight.js/lib/core";
import Message from "../../packages/message/index";

const props = defineProps({
  compname: { type: String, default: "", required: true },
  demoname: { type: String, default: "", required: true },
});

const showCode = ref(false);
const sourceCode = ref("");
const copied = ref(false);
const copyInput = ref(null);
const codeEl = ref(null);
let copiedTimer = null;

const lineCount = computed(() => (sourceCode.value ? sourceCode.value.split("\n").length : 0));

const toggleCode = () => {
  showCode.value = !showCode.value;
  // 源码改为按需加载：一个文档页往往有 7+ 个示例，
  // 全部在挂载时拉取会显著拖慢路由切换，这里只在首次展开时获取
  if (showCode.value && !loaded.value) getSourceCode();
};
const hideCode = () => {
  showCode.value = false;
};

// 静态收集示例源码：开发环境与生产构建都能拿到，不依赖 fetch 绝对路径
const demoSources = import.meta.glob("/packages/*/doc/*.vue", { as: "raw" });
const loaded = ref(false);
async function getSourceCode() {
  const key = `/packages/${props.compname}/doc/${props.demoname}.vue`;
  const loader = demoSources[key];
  if (!loader) {
    sourceCode.value = `<!-- 未找到示例源码：${key} -->`;
    loaded.value = true;
    return;
  }
  try {
    sourceCode.value = (await loader()).trimEnd();
  } catch {
    sourceCode.value = `<!-- 示例源码加载失败：${key} -->`;
  }
  loaded.value = true;
}

// 源码是异步加载的，指令首次执行时可能还是空串；这里主动补一次高亮
function highlight() {
  const el = codeEl.value;
  if (!el) return;
  el.removeAttribute("data-highlighted");
  hljs.highlightElement(el);
}
watch([sourceCode, showCode], () => {
  if (showCode.value && sourceCode.value) nextTick(highlight);
});

const copyCode = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(sourceCode.value);
    } else {
      copyInput.value.value = sourceCode.value;
      copyInput.value.select();
      if (!document.execCommand("copy")) throw new Error("copy failed");
    }
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 1800);
    Message({ type: "success", text: "代码复制成功" });
  } catch {
    Message({ type: "error", text: "代码复制失败" });
  }
};

// 只保留一份 DOM 级清理，不再在挂载时预取源码（见 toggleCode）
onBeforeUnmount(() => {
  clearTimeout(copiedTimer);
});
</script>

<style scoped lang="scss">
.pre-copy-input {
  opacity: 0;
  border: 0;
  outline: none;
  height: 0;
  position: fixed;
  z-index: -99999999;
  pointer-events: none;
}
.pre-toolbar__hint {
  font-family: var(--pui-font-mono);
  font-size: 10px;
  color: var(--pui-text-muted);
  letter-spacing: 0.04em;
}
.code-fold-enter-active,
.code-fold-leave-active {
  transition: opacity 0.18s ease, max-height 0.24s ease;
  overflow: hidden;
}
.code-fold-enter-from,
.code-fold-leave-to {
  opacity: 0;
  max-height: 0;
}
.code-fold-enter-to,
.code-fold-leave-from {
  max-height: 460px;
}
</style>
