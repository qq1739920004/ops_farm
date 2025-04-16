<!--  -->
<template>
  <div class="map_container">
    <div class="left_area">
      <div class="top_line">
        <div class="point_area" @click="gotoback">
          <svg
            t="1743580668850"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5555"
            width="18"
            height="18"
          >
            <path
              d="M665.93501234 247.77260247H143.58881976l155.34459258-155.34459259c15.53445925-15.53445925 15.53445925-38.83614815 0-54.37060741-15.53445925-15.53445925-38.83614815-15.53445925-54.3706074 0L23.19676049 257.48163951c-7.76722963 7.76722963-11.65084445 17.47626667-11.65084444 27.1853037s3.88361482 19.41807408 11.65084444 27.18530371l219.42423705 219.42423704c15.53445925 15.53445925 38.83614815 15.53445925 54.3706074 0 15.53445925-15.53445925 15.53445925-38.83614815 0-54.37060742L145.53062716 325.44489876H665.93501234c145.63555555 0 262.144 116.50844445 262.144 262.144s-116.50844445 262.144-262.144 262.144H267.86449383c-21.35988148 0-38.83614815 17.47626667-38.83614815 38.83614816s17.47626667 38.83614815 38.83614815 38.83614814h398.07051851c188.35531852 0 339.8162963-151.46097778 339.81629631-339.8162963s-151.46097778-339.8162963-339.81629631-339.81629629z"
              fill="#ffffff"
              p-id="5556"
            ></path>
          </svg>
          {{ t("work.editField") }}
        </div>
      </div>
      <el-form
        style="width: 100%"
        ref="formRef"
        :model="fieldList"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="t('work.farmName')" prop="farm">
          <div class="select_inner">
            <el-select
              v-show="!addSelf"
              style="width: 200px"
              clearable
              filterable
              v-model="fieldList.farm"
              :placeholder="$t('work.pleaseSelect')"
              transfer="true"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="(item, index) in farmList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-input
              v-show="addSelf"
              style="width: 200px"
              v-model="fieldList.farm"
            ></el-input>
            <img
              v-show="!addSelf"
              @click="farmNameAdd"
              src="@/assets/common/greenNew.png"
              alt=""
            />
            <el-button
              @click="btn_click"
              style="margin-left: 10px"
              v-show="addSelf"
              type="primary"
              >{{ t("work.goBack") }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item :label="t('work.FieldName')" prop="name">
          <el-input disabled style="width: 200px" v-model="fieldList.name"></el-input>
        </el-form-item>
        <el-form-item :label="t('work.FiledLength')" prop="perimeter">
          <el-input
            disabled
            style="width: 200px"
            v-model="fieldList.perimeter"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('work.FieldArea')" prop="area">
          <el-input disabled style="width: 200px" v-model="fieldList.area"></el-input>
        </el-form-item>
        <el-form-item :label="t('work.describe')" prop="description">
          <el-input style="width: 200px" v-model="fieldList.description"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn_area">
        <el-button type="primary" @click="editField">
          {{ t("work.editField") }}
        </el-button>
      </div>
    </div>
    <div class="select_area">
      <el-select
        v-model="words"
        filterable
        remote
        clearable
        reserve-keyword
        style="width: 230px; color: #fff"
        :placeholder="t('work.searchAddress')"
        :remote-method="remoteMethod"
        @change="handleSelectBranchCom"
      >
        <el-option
          v-for="(item, index) in remoteOptions"
          :key="item.uuid"
          :label="item.name"
          :value="item.name"
        >
          <span style="float: left">{{ item.name }}</span>
          <span
            style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
          >
            {{ item.province }}{{ item.city }} {{ item.district }}
          </span>
        </el-option>
      </el-select>
    </div>
    <detail-map
      ref="sinoMapRef"
      :mapCenter="mapCenter"
      :polygonData="polygonData"
      :lineData="lineData"
      :markerData="markerData"
      @areaValue="getArea"
      @lengthValue="getLength"
      @boundries="getBoundaries"
      @pickedPoints="getPickerPoints"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import detailMap from "./components/detailMap.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { gcoordLngLat } from "sino-tool-v3";
const route = useRoute();
const { t } = useI18n();
import {
  farmList_API,
  addBlock_API,
  suggest_API,
  block_API,
  updateBlock_API,
} from "@/api/fieldManagement/indx";
const words = ref(null);
const formRef = ref<any>();
const farmList = ref<any>([]);
const filedDetail = ref<any>({});
const mapCenter = ref<any>({
  markerId: null,
  center: [[121.734942, 31.086444]],
  zoom: 4,
});
const fieldList = reactive({
  id: "",
  farm: "",
  name: "",
  perimeter: "",
  area: "",
  description: "",
  referenceLines: [],
  boundaries: [],
  obstacles: [],
});
const polygonData = ref<any>([]);
const lineData = ref<any>([]);
const markerData = ref<any>([]);
const remoteOptions = ref<any>([]);
const getDetails = async () => {
  const { data } = await block_API({ id: route.query.id });
  filedDetail.value = data;
  fieldList.id = data.id;
  fieldList.farm = data.farm;
  fieldList.name = data.name;
  fieldList.perimeter = data.perimeter;
  fieldList.area = data.area;
  fieldList.description = data.description;
  fieldList.obstacles = data.obstacles;
  fieldList.boundaries = data.boundaries;
  fieldList.referenceLines = data.referenceLines;
  const boundaries = data.boundaries.map((item: any) => {
    return {
      id: route.query.id,
      boundaries: item,
    };
  });

  const referenceLines = data.referenceLines.map((item: any) => {
    return {
      id: route.query.id,
      referenceLines: item,
    };
  });
  console.log(referenceLines);
  const obstacles = data.obstacles.map((item: any) => {
    return {
      id: route.query.id,
      obstacles: item,
    };
  });
  polygonData.value[0] = boundaries;
  lineData.value[0] = referenceLines;
  markerData.value[0] = obstacles;
};
getDetails();
// 关键字查询
async function wordsSearch(e: any) {
  if (e) {
    const res = await suggest_API({ address: e });
    if (res.data.length > 0) {
      remoteOptions.value = res.data;
    }
  }
}
function remoteMethod(e: any) {
  wordsSearch(e);
}
const addSelf = ref(false);

function handleSelectBranchCom(e: any) {
  if (e) {
    const a = remoteOptions.value.find((item: any) => {
      return item.name === e;
    });
    mapCenter.value.center = [
      [
        gcoordLngLat(a.location.lng, a.location.lat)[1],
        gcoordLngLat(a.location.lng, a.location.lat)[0],
      ],
    ];
    mapCenter.value.zoom = 16;
  }
}
const farmNameAdd = () => {
  fieldList.farm = "";
  addSelf.value = true;
};
const btn_click = () => {
  fieldList.farm = "";
  addSelf.value = false;
};
const getArea = (e: any) => {
  fieldList.area = e;
};
const getLength = (e: any) => {
  fieldList.perimeter = e;
};
const getBoundaries = (e: any) => {
  fieldList.boundaries = JSON.parse(e);
};
const getPickerPoints = (e: any) => {
  fieldList.referenceLines = JSON.parse(e);
};
const rules = {
  farm: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
  name: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
  perimeter: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
  area: [{ required: true, message: t("messages.plzenter"), trigger: "change" }],
};
const editField = async () => {
  await formRef.value.validate();
  ElMessageBox.confirm(t("work.overConfirmation"), "Warning", {
    confirmButtonText: t("work.submit"),
    cancelButtonText: t("work.cancel"),
    type: "warning",
  })
    .then(async () => {
      try {
        await updateBlock_API(fieldList);
        ElMessage.success(t("work.updateSuccess"));
      } catch {}
    })
    .catch(() => {});
};
async function getFarmList() {
  const { data } = await farmList_API();
  farmList.value = data;
}
getFarmList();
const gotoback = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.outarea {
  height: 100%;
  width: 100%;
  display: flex;
}
.map_container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;

  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  .left_area {
    position: absolute;
    left: 10px;
    top: 50px;
    padding-left: 10px;
    width: 22%;
    margin: 5px;
    border-radius: 5px;
    z-index: 9999;
    position: absolute;

    height: 735px;
    padding: 4px;
    background-color: rgba(16, 34, 15, 0.68);
    color: #fff;
    background-size: 130% 130%;
    z-index: 999;
    :deep(.el-form-item__label) {
      color: #fff;
    }
    .btn_area {
      display: flex;
      width: 100%;
      justify-content: center;
    }
    .top_line {
      width: 100%;
      .point_area {
        cursor: pointer;
        width: fit-content;
        display: flex;
        align-items: center;
        height: 42px;
      }
    }
    .select_inner {
      cursor: pointer;

      display: flex;
      align-items: center;
      img {
        margin-left: 10px;
        width: 26px;
        height: 26px;
      }
    }
  }
  .select_area {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 99999;
    border-bottom: 2px solid;
    border-image: linear-gradient(
        to right,
        rgba(145, 145, 145, 0),
        rgba(247, 247, 247, 0.53),
        rgba(145, 145, 145, 0)
      )
      1;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.el-select__wrapper) {
      background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
      background-size: 105% 105%;
      color: white;
    }
    :deep(.el-select__placeholder) {
      color: #fff;
    }
    :deep(.el-select__input) {
      color: white;
    }
  }
  .search_area {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 264px;
    z-index: 99999;
    :deep(.el-input__wrapper) {
      background: url("@/assets/monitoring/inputBack.png") no-repeat center center;
      background-size: 105% 105%;
      color: white !important;
    }
    :deep(.el-input__inner) {
      color: #fff;
    }
    :deep(.el-input__placeholder) {
      color: #fff;
    }
  }
}
</style>
