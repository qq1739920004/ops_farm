<template>
  <div class="color-picker-container">
    <div class="color-selection-area">
      <!-- 颜色面板，用于选择色相和明度等 -->
      <div
        class="color-panel"
        @mousedown="handlePanelMouseDown"
        :style="{ backgroundColor: `hsl(${hue}, 100%, 50%)` }"
      >
        <div
          class="panel-thumb"
          :style="{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
            backgroundColor: selectedColor,
          }"
        ></div>
      </div>

      <!-- 色条，用于选择色相 -->
      <div class="hue-slider" @mousedown="handleHueMouseDown">
        <div
          class="hue-thumb"
          :style="{
            top: `${100 - huePercent}%`,
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
          }"
        ></div>
      </div>
    </div>

    <!-- 显示选中颜色和确认等按钮 -->
    <div class="color-preview">
      <div :style="{ backgroundColor: selectedColor }" class="color-box"></div>
      <input
        type="text"
        v-model="selectedColor"
        @input="handleColorInput"
        @change="handleColorChange"
        class="color-input"
        placeholder="输入十六进制颜色值"
      />
      <el-button @click="confirmColor"  type="primary">{{ $t("work.submit") }}</el-button>
      <el-button @click="clearColor" class="clear-btn">{{ $t("work.clear") }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "#ff0000",
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "clear"]);

// 颜色状态
const selectedColor = ref(props.modelValue);
const hue = ref(0); // 色相 0-360
const saturation = ref(100); // 饱和度 0-100%
const lightness = ref(50); // 明度 0-100%
const huePercent = ref(0); // 色相百分比 0-100%
let isPanelDragging = ref(false);
let isHueDragging = ref(false);

// 从十六进制颜色转换为 HSL
function hexToHsl(hex) {
  // 验证十六进制颜色格式
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // 灰色
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60; // 转换为度数
  }

  return { h, s: s * 100, l: l * 100 };
}

// 从 HSL 转换为十六进制颜色
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // 灰色
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // 转换为十六进制
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 处理颜色面板鼠标按下事件
function handlePanelMouseDown(e) {
  isPanelDragging.value = true;
  updatePanelFromMouse(e);
  document.addEventListener("mousemove", handlePanelMouseMove);
  document.addEventListener("mouseup", handlePanelMouseUp);
}

// 处理颜色面板鼠标移动
function handlePanelMouseMove(e) {
  if (isPanelDragging.value) {
    updatePanelFromMouse(e);
  }
}

// 处理颜色面板鼠标抬起
function handlePanelMouseUp() {
  isPanelDragging.value = false;
  document.removeEventListener("mousemove", handlePanelMouseMove);
  document.removeEventListener("mouseup", handlePanelMouseUp);
}

// 根据鼠标位置更新颜色面板
function updatePanelFromMouse(e) {
  const panel = document.querySelector(".color-panel");
  if (!panel) return;

  const rect = panel.getBoundingClientRect();
  // 计算相对位置，限制在0-100%范围内
  let x = ((e.clientX - rect.left) / rect.width) * 100;
  let y = ((e.clientY - rect.top) / rect.height) * 100;

  x = Math.max(0, Math.min(100, x));
  y = Math.max(0, Math.min(100, y));

  saturation.value = x;
  lightness.value = 100 - y; // 反转Y轴，顶部是亮色，底部是暗色

  updateColor();
}

// 处理色条鼠标按下事件
function handleHueMouseDown(e) {
  isHueDragging.value = true;
  updateHueFromMouse(e);
  document.addEventListener("mousemove", handleHueMouseMove);
  document.addEventListener("mouseup", handleHueMouseUp);
  e.preventDefault(); // 防止拖动时选中文本
}

// 处理色条鼠标移动
function handleHueMouseMove(e) {
  if (isHueDragging.value) {
    updateHueFromMouse(e);
  }
}

// 处理色条鼠标抬起
function handleHueMouseUp() {
  isHueDragging.value = false;
  document.removeEventListener("mousemove", handleHueMouseMove);
  document.removeEventListener("mouseup", handleHueMouseUp);
}

// 根据鼠标位置更新色相
function updateHueFromMouse(e) {
  const slider = document.querySelector(".hue-slider");
  if (!slider) return;

  const rect = slider.getBoundingClientRect();
  // 计算相对位置，限制在0-100%范围内
  let y = ((e.clientY - rect.top) / rect.height) * 100;
  y = Math.max(0, Math.min(100, y));

  // 反转Y轴，顶部是360度，底部是0度
  huePercent.value = 100 - y;
  hue.value = (huePercent.value / 100) * 360;

  updateColor();
}

// 更新颜色
function updateColor() {
  selectedColor.value = hslToHex(hue.value, saturation.value, lightness.value);
  emit("update:modelValue", selectedColor.value);
}

// 处理输入框颜色变化 - 实时同步
function handleColorInput() {
  // 移除所有非十六进制字符
  let cleaned = selectedColor.value.replace(/[^0-9A-Fa-f]/g, "");

  // 自动补全#号
  if (cleaned.length > 0 && !selectedColor.value.startsWith("#")) {
    selectedColor.value = "#" + cleaned;
  }

  // 当输入了完整的6位十六进制值时才更新
  if (/^#[0-9A-Fa-f]{6}$/.test(selectedColor.value)) {
    syncColorFromInput();
  }
}

// 处理输入框确认变化（回车或失去焦点）
function handleColorChange() {
  // 尝试规范化输入
  if (selectedColor.value.length === 3 && selectedColor.value.startsWith("#")) {
    // 处理缩写形式，如#fff -> #ffffff
    const fullHex =
      "#" +
      selectedColor.value[1] +
      selectedColor.value[1] +
      selectedColor.value[2] +
      selectedColor.value[2] +
      selectedColor.value[3] +
      selectedColor.value[3];
    selectedColor.value = fullHex;
  }

  // 如果输入无效，恢复之前的颜色
  if (!/^#[0-9A-Fa-f]{6}$/.test(selectedColor.value)) {
    selectedColor.value = hslToHex(hue.value, saturation.value, lightness.value);
  } else {
    syncColorFromInput();
  }
}

// 从输入框同步颜色到面板
function syncColorFromInput() {
  const { h, s, l } = hexToHsl(selectedColor.value);
  hue.value = h;
  saturation.value = s;
  lightness.value = l;
  huePercent.value = (hue.value / 360) * 100;
  emit("update:modelValue", selectedColor.value);
}

// 确认颜色
function confirmColor() {
  emit("confirm", selectedColor.value);
}

// 清空颜色
function clearColor() {
  selectedColor.value = "";
  emit("update:modelValue", selectedColor.value);
  emit("clear");
}

// 监听props变化，同步到组件内部
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== selectedColor.value) {
      selectedColor.value = newVal;
      const { h, s, l } = hexToHsl(newVal);
      hue.value = h;
      saturation.value = s;
      lightness.value = l;
      huePercent.value = (hue.value / 360) * 100;
    }
  }
);

// 组件挂载时初始化颜色
onMounted(() => {
  const { h, s, l } = hexToHsl(props.modelValue);
  hue.value = h;
  saturation.value = s;
  lightness.value = l;
  huePercent.value = (hue.value / 360) * 100;
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener("mousemove", handlePanelMouseMove);
  document.removeEventListener("mouseup", handlePanelMouseUp);
  document.removeEventListener("mousemove", handleHueMouseMove);
  document.removeEventListener("mouseup", handleHueMouseUp);
});
</script>

<style scoped>
.color-picker-container {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  width: 350px;
}

.color-selection-area {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.color-panel {
  width: 300px;
  height: 200px;
  border-radius: 4px;
  position: relative;
  background: linear-gradient(to right, white, transparent),
    linear-gradient(to top, black, transparent);
  cursor: crosshair;
}

.panel-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.hue-slider {
  width: 24px;
  height: 220px;
  border-radius: 12px;
  background: linear-gradient(
    to top,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
  position: relative;
  cursor: pointer;
}

.hue-thumb {
  position: absolute;
  left: 50%;
  width: 14px;
  height: 4px;
  border: 2px solid white;
  border-radius: 2px;
  transform: translateX(-50%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-box {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.color-input {
  width: 120px;

  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.color-input:focus {
  outline: none;
  border-color: #42b983;
}

.confirm-btn,
.clear-btn {

  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}



.confirm-btn:hover {
  background-color: #359e75;
}

.clear-btn {
  background-color: #f5f5f5;
  color: #333;
}

.clear-btn:hover {
  background-color: #e9e9e9;
}
</style>
