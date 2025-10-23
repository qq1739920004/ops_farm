<template>
  <div class="tree-cascader">
    <el-select
      v-model="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      @clear="handleClear"
      class="tree-cascader-select"
    >
      <template #prefix>
        <el-icon v-if="prefixIcon"><icon-tree /></el-icon>
      </template>
      <el-option :value="displayValue" class="tree-cascader-option">
        <el-popup
          ref="popupRef"
          v-model:visible="popupVisible"
          :trigger="['click']"
          :placement="placement"
          :popper-class="'tree-cascader-popup'"
          @close="handlePopupClose"
        >
          <div class="tree-cascader-panel">
            <!-- 树形选择面板 -->
            <el-tree
              ref="treeRef"
              :data="treeData"
              :props="treeProps"
              :node-key="nodeKey"
              :default-expanded-keys="defaultExpandedKeys"
              :check-strictly="checkStrictly"
              :show-checkbox="multiple"
              :check-on-click-node="checkOnClickNode"
              :expand-on-click-node="expandOnClickNode"
              :filter-node-method="filterNodeMethod"
              @check="handleCheck"
              @node-click="handleNodeClick"
              class="tree-cascader-tree"
            />

            <!-- 搜索框 -->
            <el-input
              v-if="showSearch"
              v-model="searchQuery"
              placeholder="搜索..."
              size="small"
              class="tree-cascader-search"
              @input="handleSearch"
            />

            <!-- 底部按钮 -->
            <div v-if="showFooter" class="tree-cascader-footer">
              <el-button size="small" @click="handleCancel">取消</el-button>
              <el-button size="small" type="primary" @click="handleConfirm"
                >确定</el-button
              >
            </div>
          </div>
        </el-popup>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits, nextTick, onMounted } from "vue";
import { ElTree, ElInput, ElButton, ElIcon, ElSelect, ElOption } from "element-plus";
import { Tree } from "@element-plus/icons-vue";

// 定义树形节点结构（适配你的数据格式）
interface TreeNode {
  id: number;
  dicKey: string;
  bizKey: string;
  bizValue: string;
  sort: number;
  remark: string;
  level: number;
  parentId: number | null;
  children?: TreeNode[];
  [key: string]: any;
}

// 定义组件属性
const props = defineProps({
  // 树形数据源
  data: {
    type: Array as () => TreeNode[],
    default: () => [],
  },
  // 绑定值
  modelValue: {
    type: [String, Number, Array, null],
    default: null,
  },
  // 占位符
  placeholder: {
    type: String,
    default: "请选择",
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否支持清空
  clearable: {
    type: Boolean,
    default: true,
  },
  // 节点标识属性名（默认使用bizKey作为标识）
  nodeKey: {
    type: String,
    default: "bizKey",
  },
  // 树形配置项（默认适配你的数据格式）
  treeProps: {
    type: Object,
    default: () => ({
      label: "bizValue", // 使用bizValue作为显示文本
      children: "children", // 使用children作为子节点数组
    }),
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 是否严格遵循父子不互相关联
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  // 是否在点击节点时选中节点
  checkOnClickNode: {
    type: Boolean,
    default: true,
  },
  // 是否在点击节点时展开节点
  expandOnClickNode: {
    type: Boolean,
    default: true,
  },
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: false,
  },
  // 是否显示底部按钮
  showFooter: {
    type: Boolean,
    default: false,
  },
  // 弹窗位置
  placement: {
    type: String,
    default: "bottom-start",
  },
  // 最多显示的标签数量
  maxTagCount: {
    type: Number,
    default: 5,
  },
});

// 定义组件事件
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
  (e: "visible-change", visible: boolean): void;
}>();

// 组件内部状态
const treeRef = ref<InstanceType<typeof ElTree> | null>(null);
const popupRef = ref<any>(null);
const popupVisible = ref(false);
const searchQuery = ref("");
const selectedNodes = ref<TreeNode[]>([]);
const defaultExpandedKeys = ref<any[]>([]);

// 处理搜索
const handleSearch = () => {
  if (treeRef.value) {
    treeRef.value.filter(searchQuery.value);
  }
};

// 过滤节点方法
const filterNodeMethod = (value: string, data: TreeNode) => {
  if (!value) return true;
  const labelKey = props.treeProps.label || "bizValue";
  return String(data[labelKey]).toLowerCase().includes(value.toLowerCase());
};

// 处理节点勾选
const handleCheck = (checkedKeys: any, checkedNodes: any) => {
  if (props.multiple) {
    selectedNodes.value = checkedNodes.checkedNodes;
  } else {
    selectedNodes.value = checkedNodes.checkedNodes.slice(-1);
    if (!props.showFooter) {
      handleConfirm();
    }
  }
  updateModelValue();
};

// 处理节点点击
const handleNodeClick = (data: TreeNode) => {
  if (!props.multiple && props.checkOnClickNode) {
    selectedNodes.value = [data];
    if (!props.showFooter) {
      handleConfirm();
    }
    updateModelValue();
  }
};

// 更新绑定值
const updateModelValue = () => {
  let value;
  if (props.multiple) {
    value = selectedNodes.value.map((node) => node[props.nodeKey]);
  } else {
    value = selectedNodes.value.length ? selectedNodes.value[0][props.nodeKey] : null;
  }
  emit("update:modelValue", value);
  emit("change", value);
};

// 显示值（用于选择框显示）
const displayValue = computed(() => {
  if (!selectedNodes.value.length) return "";

  const labelKey = props.treeProps.label || "bizValue";

  if (props.multiple) {
    const labels = selectedNodes.value.map((node) => node[labelKey]);
    if (labels.length <= props.maxTagCount) {
      return labels.join(", ");
    } else {
      return `${labels.slice(0, props.maxTagCount).join(", ")} +${
        labels.length - props.maxTagCount
      } 项`;
    }
  } else {
    return selectedNodes.value[0][labelKey] || "";
  }
});

// 处理清空
const handleClear = () => {
  selectedNodes.value = [];
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([]);
  }
  updateModelValue();
};

// 处理确认
const handleConfirm = () => {
  popupVisible.value = false;
  emit("visible-change", false);
};

// 处理取消
const handleCancel = () => {
  // 取消时恢复之前的选择
  initSelectedNodes();
  popupVisible.value = false;
  emit("visible-change", false);
};

// 处理弹窗关闭
const handlePopupClose = () => {
  emit("visible-change", false);
};

// 初始化选中节点
const initSelectedNodes = () => {
  if (!treeRef.value) return;

  const keys = Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue !== null
    ? [props.modelValue]
    : [];

  treeRef.value.setCheckedKeys(keys);

  // 获取选中的节点
  const nodes = treeRef.value.getCheckedNodes(false, true);
  selectedNodes.value = nodes;

  // 展开选中节点的父节点
  expandSelectedNodes();
};

// 展开选中节点
const expandSelectedNodes = () => {
  if (!treeRef.value || !selectedNodes.value.length) return;

  const expandedKeys: any[] = [];

  const collectParentKeys = (node: TreeNode) => {
    const parent = treeRef.value?.getNode(node).parent;
    if (parent && parent.data && parent.key) {
      expandedKeys.push(parent.key);
      collectParentKeys(parent.data);
    }
  };

  selectedNodes.value.forEach((node) => {
    collectParentKeys(node);
  });

  defaultExpandedKeys.value = expandedKeys;
};

// 监听绑定值变化
watch(
  () => props.modelValue,
  () => {
    nextTick(() => {
      initSelectedNodes();
    });
  },
  { immediate: true, deep: true }
);

// 监听数据源变化
watch(
  () => props.data,
  () => {
    nextTick(() => {
      initSelectedNodes();
    });
  },
  { deep: true }
);

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    initSelectedNodes();
  });
});

// 暴露给模板的树形数据
const treeData = computed(() => [...props.data]);
</script>

<style scoped>
.tree-cascader-select {
  width: 100%;
}

.tree-cascader-option {
  display: none;
}

.tree-cascader-popup {
  padding: 8px;
}

.tree-cascader-panel {
  width: 300px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.tree-cascader-tree {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 8px;
}

.tree-cascader-search {
  margin-bottom: 8px;
}

.tree-cascader-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}
</style>
