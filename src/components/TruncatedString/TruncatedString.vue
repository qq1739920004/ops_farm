<template>
  <div class="relative inline-block">
    <!-- 显示截断的文本 -->
    <span
      class="truncate"
      :style="{ maxWidth: maxWidth + 'px' }"
      :title="isTruncated ? text : null"
      @mouseenter="showTooltip = isTruncated"
      @mouseleave="showTooltip = false"
    >
      {{ truncatedText }}
    </span>

    <!-- 自定义悬浮提示框 -->
    <div
      v-if="showTooltip && useCustomTooltip"
      class="absolute z-50 bg-gray-900 text-white text-sm rounded-md px-3 py-1.5 shadow-lg whitespace-nowrap -translate-x-1/2 left-1/2 bottom-full mb-2"
    >
      {{ text }}
      <!-- 小三角指示器 -->
      <div
        class="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 bg-gray-900 transform rotate-45"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// 组件属性定义
const props = defineProps({
  // 原始字符串
  text: {
    type: String,
    required: true,
    default: "",
  },
  // 最大字符长度限制
  maxLength: {
    type: Number,
    default: 20,
  },
  // 最大宽度限制(px)，优先级高于maxLength
  maxWidth: {
    type: Number,
    default: null,
  },
  // 是否使用自定义悬浮提示（否则使用浏览器默认title提示）
  useCustomTooltip: {
    type: Boolean,
    default: false,
  },
});

// 控制自定义提示框显示
const showTooltip = ref(false);

// 计算截断后的字符串
const truncatedText = computed(() => {
  if (props.text.length <= props.maxLength && !props.maxWidth) {
    return props.text;
  }
  return props.text.slice(0, props.maxLength) + "...";
});

// 判断是否被截断
const isTruncated = computed(() => {
  return props.text.length > props.maxLength;
});
</script>

<style scoped>
/* 基础截断样式 */
.truncate {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.relative {
  display: flex;
  align-items: center;
}
</style>
