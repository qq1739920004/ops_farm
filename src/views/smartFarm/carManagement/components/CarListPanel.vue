<template>
  <div class="car-list-panel">
    <div class="car-list-panel__search">
      <div class="car-list-panel__inputs">
        <el-input
          v-model="localSearch.name"
          :placeholder="t('work.vehicleName')"
          clearable
          @clear="emitSearch"
          @keyup.enter="emitSearch"
          @input="handleSearchChange('name', $event)"
        />
        <el-input
          v-model="localSearch.sn"
          :placeholder="t('devicelist.deviceSN')"
          clearable
          @clear="emitSearch"
          @keyup.enter="emitSearch"
          @input="handleSearchChange('sn', $event)"
        />
        <el-button type="primary" @click="emitSearch" :loading="loading">
          <el-icon><Search /></el-icon>
        </el-button>
      </div>
      <el-button type="primary" circle @click="emitCreate">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>
    <div class="car-list-panel__body" ref="listRef" @scroll="onScroll">
      <el-empty
        v-if="!cars.length && !loading"
        :description="t('work.noData')"
        class="car-list-panel__empty"
      />
      <div
        v-for="item in cars"
        v-else
        :key="item.id"
        class="car-card"
        :class="{ 'car-card--active': activeId === item.id }"
        @click="emitSelect(item)"
      >
        <div class="car-card__title-row">
          <div class="car-card__title">
            {{ item.name || '--' }}
          </div>
          <el-button
            size="small"
            type="primary"
            link
            @click.stop="emitEdit(item)"
          >
            {{ t('work.edit') }}
          </el-button>
        </div>
        <div class="car-card__meta">
          <span>{{ item.vehicleTypeLabel || '--' }}</span>
          <span class="car-card__divider" />
          <span>{{ formatBrandModel(item.brand, item.model) }}</span>
        </div>
      </div>
      <div v-if="loading" class="car-list-panel__loading">
        <el-icon class="is-rotating"><Loading /></el-icon>
        <span>{{ t('work.loading') || '加载中' }}</span>
      </div>
      <div
        v-else-if="finished && cars.length"
        class="car-list-panel__finished"
      >
        {{ t('work.noMoreData') || '没有更多了' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, withDefaults } from "vue";
import { useI18n } from "vue-i18n";
import { Plus, Search, Loading } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    cars: any[];
    loading: boolean;
    finished: boolean;
    activeId: string | number | null;
    searchForm: Record<string, any>;
  }>(),
  {
    cars: () => [],
    loading: false,
    finished: false,
    activeId: null,
    searchForm: () => ({}),
  }
);

const emit = defineEmits<{
  (e: "update:searchForm", value: Record<string, any>): void;
  (e: "search", value: Record<string, any>): void;
  (e: "create"): void;
  (e: "select", value: any): void;
  (e: "loadMore"): void;
  (e: "edit", value: any): void;
}>();

const { t } = useI18n();
const listRef = ref<HTMLDivElement | null>(null);
const localSearch = reactive({
  name: "",
  sn: "",
});

watch(
  () => props.searchForm,
  (value) => {
    Object.assign(localSearch, { name: "", sn: "" }, value || {});
  },
  {
    immediate: true,
    deep: true,
  }
);

const emitSearch = () => {
  emit("update:searchForm", { ...localSearch });
  emit("search", { ...localSearch });
};

const emitCreate = () => {
  emit("create");
};

const emitSelect = (item: any) => {
  emit("select", item);
};

const emitEdit = (item: any) => {
  emit("edit", item);
};

const handleSearchChange = (key: "name" | "sn", value: string) => {
  localSearch[key] = value?.trim?.() ?? value;
  emit("update:searchForm", { ...localSearch });
};

const onScroll = (event: Event) => {
  if (props.loading || props.finished) return;
  const target = event.target as HTMLDivElement;
  if (!target) return;
  const threshold = 16;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
    emit("loadMore");
  }
};

const formatBrandModel = (brand?: string, model?: string) => {
  if (!brand && !model) return "--";
  if (!brand) return model || "--";
  if (!model) return brand || "--";
  return `${brand}/${model}`;
};
</script>

<style scoped lang="scss">
.car-list-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* allow inner flex child to scroll */
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}

.car-list-panel__search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}

.car-list-panel__inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.car-list-panel__body {
  flex: 1;
  min-height: 0; /* critical for flex scrolling */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
  /* hide scrollbar cross-browser */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.car-list-panel__body::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none; /* Chrome/Safari/WebKit */
}
.car-card {
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: var(--el-color-white);
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.car-card:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

.car-card--active {
  border-color: var(--el-color-primary);
  box-shadow: 0px 4px 12px rgba(76, 176, 79, 0.3);
}

.car-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.car-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
}

.car-card__meta {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.car-card__divider {
  width: 1px;
  height: 12px;
  background-color: var(--el-border-color-lighter);
}

.car-list-panel__loading,
.car-list-panel__finished {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #909399;
  padding: 12px 0;
}

.car-list-panel__loading .el-icon {
  margin-right: 6px;
}

.is-rotating {
  animation: rotating 1s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

