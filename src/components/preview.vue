<template>
  <div class="pre-code-box">
    <span class="m-copy" v-if="showCode" @click="copyCode"
    ><i class="t-icon-copy"></i
    ></span>
    <transition name="slide-fade">
      <pre
          class="language-html"
          v-if="showCode"
          v-highlight
      ><code class="language-html">{{ sourceCode }}</code></pre>
    </transition>
    <div class="showCode" @click="showOrhideCode">
      <span>{{ showCode ? "隐藏代码" : "显示代码" }}</span>
      <i class="t-icon-code" :class="{ rotate: showCode }"></i>
    </div>
    <textarea ref="copyInput" class="pre-copy-input" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Message from "../../packages/message/index";
const props = defineProps({
  compname: {
    type: String,
    default: "",
    required: true,
  },
  demoname: {
    type: String,
    default: "",
    required: true,
  },
});

const showCode = ref(false);
const showOrhideCode = () => {
  showCode.value = !showCode.value;
};
const sourceCode = ref("");
const copyInput = ref(null);

// 静态收集示例源码：开发环境和生产构建都能拿到，不再依赖 fetch 绝对路径
const demoSources = import.meta.glob("/packages/*/doc/*.vue", { as: "raw" });
async function getSourceCode() {
  const key = `/packages/${props.compname}/doc/${props.demoname}.vue`;
  const loader = demoSources[key];
  if (!loader) {
    sourceCode.value = `<!-- 未找到示例源码：${key} -->`;
    return;
  }
  try {
    sourceCode.value = await loader();
  } catch {
    sourceCode.value = `<!-- 示例源码加载失败：${key} -->`;
  }
}
const copyCode = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(sourceCode.value);
    } else {
      copyInput.value.value = sourceCode.value;
      copyInput.value.select();
      if (!document.execCommand("copy")) throw new Error("copy failed");
    }
    Message({
      type: "success",
      text: "代码复制成功",
    });
  } catch {
    Message({
      type: "error",
      text: "代码复制失败",
    });
  }
};
onMounted(() => {
  getSourceCode();
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
}
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0.5;
}
.pre-code-box {
  width: 100%;
  height: auto;
  overflow: hidden;
  border-top: 0;
  margin: 0px 0 15px 0;
  position: relative;
  transition: all 0.15s ease-out;
  .m-copy {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    i {
      font-size: 22px;
      color: #b7b3b3;
      &:hover {
        color: #000;
      }
    }
  }
  .showCode {
    width: 100%;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;
    box-shadow: 0px 16px 15px -16px rgb(0 0 0 / 10%);
    color: #505050;
    cursor: pointer;
    i {
      margin-left: 10px;
      transition: transform 0.15s ease;
    }
    i.rotate {
      transform: rotate(180deg);
    }
    &:hover {
      background: #f9f9f9;
      color: #0e80eb;
    }
  }
  &:hover {
    box-shadow: 0px 16px 15px -16px rgb(0 0 0 / 10%);
  }
}
</style>
