<!--  -->
<template>
  <div class="map_container">
    <detail-map
      ref="sinoMapRef"
      :mapCenter="mapCenter"
      :polygonData="polygonData"
      :polygonData2="polygonData2"
      :lineData="lineData"
      :boundariesID="boundariesID"
      :markerData="markerData"
      :nameList="nameList"
      :colorList="colorList"
      @clickId="clickId"
      @lineSend="clickLines"
    />
    <div class="line-type-color-container">
    <div class="title_line">
    {{ t('work.lineClassification') }}
    </div>
      <!-- 直线 - 红色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: red"></div>
        <div class="line-type-name">{{ t('work.straightLine') }}</div>
      </div>

      <!-- 自动掉头 - 绿色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: green"></div>
        <div class="line-type-name">{{ t('work.autoTurnAround') }}</div>
      </div>

      <!-- 同心圆 - 蓝色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: blue"></div>
        <div class="line-type-name">{{ t('work.concentricCircle') }}</div>
      </div>

      <!-- 等距曲线 - 紫色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: purple"></div>
        <div class="line-type-name">{{ t('work.equidistantCurve') }}</div>
      </div>

      <!-- 自由轨迹（多段线） - 橙色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: orange"></div>
        <div class="line-type-name">{{ t('work.freeTrajectory') }}</div>
      </div>

      <!-- 三点定圆 - 青色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: cyan"></div>
        <div class="line-type-name">{{ t('work.threePointCircle') }}</div>
      </div>

      <!-- 对角耙 - 棕色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: brown"></div>
        <div class="line-type-name">{{ t('work.diagonalHarrow') }}</div>
      </div>

      <!-- 单点+航向 - 亮绿色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: #1afa29"></div>
        <div class="line-type-name">{{ t('work.singlePointHeading') }}</div>
      </div>

      <!-- 循环模式 - 品红色 -->
      <div class="line-type-item">
        <div class="color-block" style="background-color: magenta"></div>
        <div class="line-type-name">{{ t('work.loopMode') }}</div>
      </div>
    </div>
    <!-- <div class="select_area">
      <el-select
        v-model="words"
        filterable
        remote
        clearable
        reserve-keyword
        style="width: 245px; color: #fff"
        :placeholder="t('work.searchAddress')"
        :remote-method="remoteMethod"
        @change="handleSelectBranchCom"
       
      >
        <el-option
          v-for="item in remoteOptions"
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
    </div> -->

    <div class="infinite-list_out">
      <div class="search_area">
        <div class="left">
          <el-input
            v-model="pageInfo.keyword"
            @change="changeKeyWord"
            :placeholder="t('work.searchField')"
            clearable
          >
          </el-input>
        </div>
        <div class="right">
          <!-- 下拉菜单触发器 -->
          <el-dropdown placement="bottom" @command="handleCommand" :show-arrow="false">
            <!-- 加号按钮 - 仅保留加号，无背景和hover效果 -->
            <el-button class="plus-button" text circle>
              <svg
                t="1758786305119"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5826"
                width="16"
                height="16"
              >
                <path
                  d="M576 64H448v384H64v128h384v384h128V576h384V448H576z"
                  fill="#ffffff"
                  p-id="5827"
                ></path>
              </svg>
            </el-button>

            <!-- 下拉菜单内容 -->
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item command="manual" class="dropdown-item">
                  <el-icon class="item-icon"><Edit /></el-icon>
                  <span>{{ t('work.manualCreate') }}</span>
                </el-dropdown-item>
                <el-dropdown-item command="import" class="dropdown-item">
                  <el-icon class="item-icon"><Upload /></el-icon>
                  <span>{{ t('work.importCreate') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- <div class="select_inner">
        <el-select
          @change="changeKeyWord"
          clearable
          filterable
          style="width: 100%"
          v-model="pageInfo.farm"
          :placeholder="$t('work.farmName')"
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
      </div> -->
      <ul
        v-infinite-scroll="load"
        infinite-scroll-immediate="false"
        class="infinite-list"
        style="overflow: auto"
      >
        <li
          v-for="(item, index) in fieldList"
          :key="index"
          class="infinite-list-item list_line"
          :class="index === choosenIndex ? 'chooseLi' : ''"
          @click.stop="getBlock(index, item.id, item.boundaries)"
        >
          <div style="">
            <leftMap
              :polygon-data="item.boundaries"
              :mapCenter="mapCenter"
              :map-key="item.id"
              :color="colorList[index]"
              :init-delay="index * 10"
            />
          </div>
          <div class="left">
            <div class="top">
              <!-- <img src="@/assets/common/filed.png" alt="" /> -->
              <div class="trun_area">
                <TruncatedString :text="item.name" :maxLength="18" />
              </div>
              <div v-if="item.haveReference" class="shared_area">{{ t('work.hasWorkLine') }}</div>
              <div v-else class="unRef_area">{{ t('work.noWorkLine') }}</div>
              <!-- <div class="unshared_area">
                {{ t("statisticsReport.thousandArea") }}:
              </div> -->
              <div class="unshared_area">
                {{ item.area ? item.area.toFixed(2) : 0 }}{{ t("work.are") }}
              </div>
            </div>
            <div class="bottom">
              {{ item.creator || "--" }} | {{ item.modifier || "--" }}
            </div>

            <div class="arrow_area">
              <img src="@/assets/common/rightArrow.png" alt="" />
            </div>
          </div>
        </li>
        <!-- <div class="new_img" @click="gotoNewCars">
          <img src="@/assets/common/new.png" alt="" /> {{ t("work.new") }}
        </div> -->
      </ul>
    </div>
    <div class="info_box" v-show="infoShow">
      <div class="top_line">
        <div style="font-size: 16px; font-weight: bold;">{{ fieldInfo.name }}</div>
      </div>
      <div class="info_line">
        <!-- 面积 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8">
            {{ t("work.allArea") + "(m²)" }}:</el-col
          >
          <el-col :span="12"> {{ fieldInfo.area }}</el-col>
        </el-row>
        
        <!-- 周长 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8">
            {{ t("work.circumference") + "(m)" }}:</el-col
          >
          <el-col :span="12"> {{ fieldInfo.perimeter }}</el-col>
        </el-row>
        
        <!-- 种养品种 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8">{{ t('work.cropInfo') }}:</el-col>
          <el-col :span="14">
            <div v-if="fieldInfo.blockCrops && fieldInfo.blockCrops.length > 0" class="crop-info">
              <span>{{ fieldInfo.blockCrops[0]?.cropName || '--' }}</span>
              <!-- <span style="font-size: 12px; color: #aaa;">
                {{ fieldInfo.blockCrops[0]?.plantingStartTime || '--' }}
              </span> -->
            <el-button link type="primary" size="small" @click="openCropDrawer">{{ t('work.more') }}</el-button>

            </div>
            <span v-else>--</span>
          </el-col>
        </el-row>
        
        <!-- 农事记录 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8">{{ t('work.farmRecord') }}:</el-col>
          <el-col :span="12">
            <el-button link type="primary" size="small" @click="openFarmRecordDrawer">{{ t('work.more') }}</el-button>
          </el-col>
        </el-row>
        
        <!-- 创建时间 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.creationTime") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.createTime }}</el-col>
        </el-row>
        
        <!-- 创建人 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.creator") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.creator }}</el-col>
        </el-row>
        
        <!-- 修改时间 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.modifyTime") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.modifyTime }}</el-col>
        </el-row>
        
        <!-- 修改人 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.modifier") }}:</el-col>
          <el-col :span="12"> {{ fieldInfo.modifier }}</el-col>
        </el-row>
        
        <!-- 描述 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.describe") }}:</el-col>
          <el-col class="wrap-col" :span="12"> {{ fieldInfo.description }}</el-col>
        </el-row>
        
        <!-- 地址 -->
        <el-row>
          <el-col :span="locale === 'en' ? 12 : 8"> {{ t("work.address") }}:</el-col>
          <el-col class="wrap-col" :span="12">
            {{ fieldInfo.address }}
          </el-col>
        </el-row>
        
        <!-- 操作按钮 -->
        <el-row style="margin-top: 10px;">
          <el-col :span="24">
            <div style="display: flex; gap: 8px;">
              <el-button
                link
                type="primary"
                size="small"
                @click="goEdit(fieldInfo.id)"
              >
                {{ t("work.edit") }}
              </el-button>
              <el-button 
                link 
                type="danger" 
                size="small" 
                @click="deleteFields(fieldInfo.id)"
              >
                {{ t("work.delete") }}
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="checkShare(fieldInfo.id, fieldInfo.createType)"
              >
                {{ t('work.issueBlock') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="t('work.issueBlock')" center width="500px">
      <div class="top_att" v-if="creatorType === 1">
        {{ t("work.patAtt") }}
      </div>
      <div class="dia_select">
        {{ t("work.shareDevice") }}:

        <el-select-v2
          style="width: 240px; margin-left: 10px"
          filterable
          v-model="pickedSn"
          :options="options"
          :placeholder="$t('work.pleaseSelect')"
        >
        </el-select-v2>
      </div>

      <div class="dia_select1">
        <el-button type="primary" @click="shareCar(fieldInfo.id)">{{
          t("work.share")
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible2"
      :title="t('work.issueWorkLine')"
      center
      width="500px"
      @close="selectedCarId = ''"
    >
      <div class="dia_select">
        <el-select
          filterable
          v-model="selectedCarId"
          class="input-with-select"
          style="width: 300px"
          :placeholder="$t('work.pleaseSelect')"
        >
          <el-option
            v-for="item in carList2"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </div>

      <div class="dia_select1">
        <el-button @click="dialogVisible2 = false">{{ t('work.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm2">{{ t('work.confirmIssue') }}</el-button>
      </div>
    </el-dialog>
    
    <!-- 农事记录抽屉 -->
    <el-drawer
      v-model="farmRecordDrawerVisible"
      :title="t('work.farmRecord')"
      direction="rtl"
      size="50%"
      @close="closeFarmRecordDrawer"
    >
      <div style="margin-bottom: 10px; text-align: right;">
        <el-button type="primary"  @click="openAddFarmRecordDialog">{{ t('work.addFarmRecord') }}</el-button>
      </div>
      
      <el-table 
        :data="farmRecordList" 
        style="width: 100%"
        v-loading="farmRecordLoading"
      >
        <el-table-column  :label="t('work.recordType')" min-width="70">
          <template #default="{ row }">
            {{ getFarmAffairType(row.affairType) }}
          </template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" :label="t('work.operator')" min-width="100" />
        <el-table-column prop="time" :label="t('work.farmTime')" min-width="150" />
        <el-table-column prop="updaterName" :label="t('work.updater')" min-width="100" />
        <el-table-column prop="updateTime" :label="t('work.farmUpdateTime')" min-width="150" />
        <el-table-column :label="t('work.photo')" min-width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.imageUrl"
              style="width: 50px; height: 50px"
              :src="row.imageUrl"
              :preview-src-list="[row.imageUrl]"
              fit="cover"
            />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('work.operation')" min-width="80" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" @click="editFarmRecord(row)">{{ t('work.editRecord') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-top: 20px; display: flex; justify-content: center;">
        <el-pagination
          v-model:current-page="farmRecordPage.currentPage"
          v-model:page-size="farmRecordPage.pageSize"
          :total="farmRecordTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleFarmRecordSizeChange"
          @current-change="handleFarmRecordCurrentChange"
        />
      </div>
    </el-drawer>
    
    <!-- 种养品种抽屉 -->
    <el-drawer
      v-model="cropDrawerVisible"
      :title="t('work.cropRecord')"
      direction="rtl"
      size="50%"
      @close="closeCropDrawer"
    >
      <div style="margin-bottom: 10px; text-align: right;">
        <el-button type="primary"  @click="openAddCropDialog">{{ t('work.addCrop') }}</el-button>
      </div>
      
      <el-table 
        :data="cropList" 
        style="width: 100%"
        v-loading="cropLoading"
      >
        <el-table-column :label="t('work.startEndDate')" min-width="150">
          <template #default="{ row }">
            {{ row.plantingStartTime || '--' }} - {{ row.plantingEndTime || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="cropName" :label="t('work.cropVariety')" min-width="100" />
        <el-table-column prop="plantingArea" :label="t('work.yield')+'(kg)'" min-width="80">
          <template #default="{ row }">
            {{ row.plantingArea || '--' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('work.operation')" min-width="80" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" @click="editCrop(row)">{{ t('work.editRecord') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-top: 20px; display: flex; justify-content: center;">
        <el-pagination
          v-model:current-page="cropPage.currentPage"
          v-model:page-size="cropPage.pageSize"
          :total="cropTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleCropSizeChange"
          @current-change="handleCropCurrentChange"
        />
      </div>
    </el-drawer>
    
    <!-- 新增/编辑作物弹窗 -->
    <el-dialog
      v-model="addCropDialogVisible"
      :title="cropForm.id ? t('work.editCrop') : t('work.addCrop')"
      width="500px"
      @close="closeAddCropDialog"
    >
      <el-form
        ref="cropFormRef"
        :model="cropForm"
        :rules="cropFormRules"
        label-width="100px"
      >
        <el-form-item :label="t('work.timeRange')" prop="timeRange">
          <el-date-picker
            style="width: 100%"
            v-model="cropForm.timeRange"
            type="daterange"
            :range-separator="t('work.to')"
            :start-placeholder="t('work.startTime2')"
            :end-placeholder="t('work.endTime2')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item :label="t('work.cropType')" prop="cropDictId">
          <el-cascader
            style="width: 100%"
            v-model="cropForm.cropDictId"
            :options="cropOptions"
            :props="cascaderProps"
            clearable
            :placeholder="t('work.selectCropType')"
          />
        </el-form-item>
        
        <el-form-item :label="t('work.yield')" prop="plantingArea">
          <el-input
            v-model="cropForm.plantingArea"
            :placeholder="t('work.inputYield')"
            type="number"
          >
            <template #append>kg</template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddCropDialog">{{ t('work.cancel') }}</el-button>
          <el-button type="primary" @click="submitCropForm">{{ t('work.confirmBtn') }}</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增/编辑农事记录弹窗 -->
    <el-dialog
      v-model="addFarmRecordDialogVisible"
      :title="farmRecordForm.id ? t('work.editFarmRecordTitle') : t('work.addFarmRecordTitle')"
      width="500px"
      @close="closeAddFarmRecordDialog"
    >
      <el-form
        ref="farmRecordFormRef"
        :model="farmRecordForm"
        :rules="farmRecordFormRules"
        label-width="100px"
      >
        <el-form-item :label="t('work.recordType')" prop="affairType">
          <el-select
            style="width: 100%"
            v-model="farmRecordForm.affairType"
            :placeholder="t('work.selectType')"
            clearable
          >
            <el-option
              v-for="item in affairTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="t('work.operator')" prop="responsiblePerson">
          <el-input
            v-model="farmRecordForm.responsiblePerson"
            :placeholder="t('work.inputOperator')"
          />
        </el-form-item>
        
        <el-form-item :label="t('work.time')" prop="time">
          <el-date-picker
            style="width: 100%"
            v-model="farmRecordForm.time"
            type="datetime"
            :placeholder="t('work.selectTime')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        
        <el-form-item :label="t('work.remarkText')" prop="remark">
          <el-input
            v-model="farmRecordForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="t('work.inputRemark')"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddFarmRecordDialog">{{ t('work.cancel') }}</el-button>
          <el-button type="primary" @click="submitFarmRecordForm">{{ t('work.confirmBtn') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import detailMap from "./components/detailMap.vue";
import leftMap from "./components/leftMap.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { gcoordLngLat } from "sino-tool-v3";
import { useStorage } from "@vueuse/core";                                                                                              

import {
  filedPage_API,
  suggest_API,
  farmList_API,
  block_API,
  farmDetail_API,
  deleteBlock_API,
  share_API,
  listVehicle_API,
  shareCar_API,
  getFarmRecord_API,
  addFarmRecord_API,
  editFarmRecord_API,
  getFarmAffair_API,
  addFarmAffair_API,
  editFarmAffair_API,
  sysDict_API,
  getCarList_API,
  pushReferenceLine_API,
} from "@/api/fieldManagement/indx";
import router from "@/router";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const sinoMapRef = ref<any>();
const lineData = ref<any>([]);
const dialogVisible2 = ref(false);
const dialogVisible = ref(false);
const markerData = ref<any>([]);
const choosenIndex = ref<any>("");
const polygonData = ref<any>([]);
const polygonData2 = ref<any>([]);
const nameList = ref<any>([]);
const colorList = ref<any>([]);
const boundariesID = ref<any>([]);
const selectedCarId = ref("");
const loading = ref(false);
const fieldInfo = ref<any>({});
let options = <any>[];
const words = ref();
const farmList = ref<any>([]);
const total = ref(0);
const infoShow = ref(false);
const farmRecordDrawerVisible = ref(false);
const farmRecordList = ref<any>([]);
const farmRecordTotal = ref(0);
const farmRecordLoading = ref(false);
const farmRecordPage = reactive({
  currentPage: 1,
  pageSize: 10,
  blockId: '',
});
const addFarmRecordDialogVisible = ref(false);
const farmRecordFormRef = ref<any>();
const farmRecordForm = reactive<{
  id?: string | number;
  affairType: string | number;
  responsiblePerson: string;
  time: string;
  remark: string;
}>({
  affairType: '',
  responsiblePerson: '',
  time: '',
  remark: '',
});
const farmRecordFormRules = {
  affairType: [{ required: true, message: t('work.selectType'), trigger: 'change' }],
  responsiblePerson: [{ required: true, message: t('work.inputOperator'), trigger: 'blur' }],
  time: [{ required: true, message: t('work.selectTime'), trigger: 'change' }],
};
const affairTypeOptions = ref<any>([]);
const cropDrawerVisible = ref(false);
const cropList = ref<any>([]);
const cropTotal = ref(0);
const cropLoading = ref(false);
const cropPage = reactive({
  currentPage: 1,
  pageSize: 10,
  blockId: '',
});
const addCropDialogVisible = ref(false);
const cropFormRef = ref<any>();
const cropForm = reactive<{
  id?: string | number;
  timeRange: any[];
  cropDictId: string | number[];
  plantingArea: string;
}>({
  timeRange: [],
  cropDictId: '',
  plantingArea: '',
});
const cropFormRules = {
  timeRange: [{ required: true, message: '请选择时间范围', trigger: 'change' }],
  cropDictId: [{ required: true, message: '请选择作物类型', trigger: 'change' }],
};
const cropOptions = ref<any>([]);
const cascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  checkStrictly: true,
};
const pickedSn = ref("");
const companyId = ref("");
const mapCenter = ref<any>({
  markerId: null,
  center: [[121.734942, 31.086444]],
  zoom: 4,
});
const carList = ref<any>([]);
const carList2 = ref<any>([]);
const remoteOptions = ref<any>([]);

const pageInfo = reactive<any>({
  companyId: "",
  keyword: "",
  farmId: useStorage("farmId", ""),
  currentPage: 1,
  pageSize: 900,
});
const showlines = (id: any) => {
  lineData.value = [];
  lineData.value.push({
    linesId: fieldInfo.value.id,
    referenceLines: fieldInfo.value.referenceLines,
  });
  companyId.value = id;
};
const getCarList2 = async () => {
  const res = await getCarList_API({
    farmId: companyId.value,
  });
  carList2.value = res.data;
};
const handleConfirm2 = async () => {
  if (!selectedCarId.value) {
    ElMessage.warning(t("work.pleaseSelectVehicle"));
  } else {
    try {
      await pushReferenceLine_API({
        ReferenceLineId: lineValue.value,
        vehicleId: selectedCarId.value,
      });
      ElMessage.success(t("work.issueSuccess"));
      dialogVisible2.value = false;
      lineValue.value = "";
      selectedCarId.value = "";
    } catch {}
  }
};
watch(
  () => pageInfo.farmId,
  () => {
    changeKeyWord();
    getDetails();
  },
  { deep: true }
);

const locationContour = ref([]);
const getDetails = async () => {
  const { data } = await farmDetail_API({ id: pageInfo.farmId });

  locationContour.value = JSON.parse(data.locationContour);
  const boundaries = locationContour.value.map((item: any) => {
    return {
      id: pageInfo.farmId,
      boundaries: item,
    };
  });

  polygonData2.value[0] = boundaries;
};
getDetails();

const reReqList = () => {
  pageInfo.currentPage = 1;
  pageInfo.pageSize = 900;
  fieldList.value = [];
  loading.value = false;
  choosenIndex.value = "";
  sinoMapRef.value.deleteAllMarkers();
  fieldInfo.value = [];
  infoShow.value = false;
  polygonData.value = [];
  nameList.value = [];
  colorList.value = [];
  lineData.value = [];
  markerData.value = [];
  getFieldData();
};
const shareCar = async (id: any) => {
  if (!pickedSn.value) {
    return ElMessage.warning(t("work.pleaseSelect"));
  }
  try {
    await shareCar_API({
      id: id,
      carId: pickedSn.value,
    });
    ElMessage.success(t("work.shareSuccess"));
    dialogVisible.value = false;
    reReqList();
  } catch {}
};

const fieldList = ref<any>([]);
const load = () => {
  if (pageInfo.currentPage * pageInfo.pageSize < total.value) {
    pageInfo.currentPage++;
    getFieldData();
  }
};
const goEdit = (id: any) => {
  router.push({ path: `fieldManagement/editFields`, query: { id: id } });
};

const handleCommand = (command: any) => {
  if (command === "manual") {
    // 手动创建逻辑
    gotoNewCars();
  } else if (command === "import") {
    // 导入创建逻辑
  }
};

const getCarList = async () => {
  const res = await listVehicle_API();
  carList.value = res.data;
  options = carList.value.map((item: any, _idx: any) => {
    return {
      value: item.carId,
      label: item.name ? item.name + "(" + item.sn + ")" : item.sn,
    };
  });
};

const deleteFields = async (id: any) => {
  try {
    await deleteBlock_API({ id: id });
    ElMessage.success(t("work.deleteSuccess"));
    reReqList();
  } catch {}
};
// 1平台 2终端
const creatorType = ref<any>(1);
const checkShare = async (id: any, type: any) => {
  creatorType.value = type;
  try {
    await share_API({ id: id });
    dialogVisible.value = true;
    pickedSn.value = "";
  } catch {}
};
const changeKeyWord = () => {
  reReqList();
};
getCarList();
const gotoNewCars = () => {
  router.push({ path: `fieldManagement/newFields` });
};
const getBlock = async (index: any, id: any, boundaries: any) => {
  if (choosenIndex.value === index) {
    infoShow.value = false;
    choosenIndex.value = "";
    boundariesID.value = [];
  } else {
    boundariesID.value = [];
    infoShow.value = true;
    const res = await block_API({ id: id });
    fieldInfo.value = res.data;

    boundariesID.value = boundaries;
    choosenIndex.value = index;
    showlines(fieldInfo.value.farmId);
  }
};
const getFieldData = async () => {
  const { data } = await filedPage_API(pageInfo);
  total.value = data.total;
  if (fieldList.value.length >= data.total) {
    loading.value = true;
  } else {
    fieldList.value.push(...data.records);
    const name = data.records.map((item: any) => {
      return item.name;
    });
    const color = data.records.map((item: any) => {
      return item.color;
    });
    const boundaries = data.records.map((item: any, index: any) => {
      return {
        id: name[index],
        boundaries: item.boundaries,
        clickId: item.id,
      };
    });
    // const referenceLines = data.records.map((item: any, index: any) => {
    //   return {
    //     id: name[index],
    //     referenceLines: item.referenceLines,
    //   };
    // });
    const obstacles = data.records.map((item: any, index: any) => {
      return {
        id: name[index],
        obstacles: item.obstacles,
      };
    });
    nameList.value.push(...name);
    polygonData.value.push(boundaries);
    // lineData.value.push(referenceLines);
    markerData.value.push(obstacles);
    colorList.value.push(...color);
  }
};
getFieldData();
// const clickLeft = () => {
//   infoShow.value = false;
//   boundariesID.value = [];
//   choosenIndex.value = "";
// };
const lineValue = ref("");

function clickId(index: any, id: any, boundaries: any) {
  getBlock(index, id, boundaries);
}
function clickLines(lineId: any) {
  lineValue.value = lineId;
  getCarList2();
  dialogVisible2.value = true;
}
function remoteMethod(e: any) {
  wordsSearch(e);
}
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
// 关键字查询
async function wordsSearch(e: any) {
  if (e) {
    const res = await suggest_API({ address: e });
    remoteOptions.value = res.data;
  }
}

// 打开农事记录抽屉
const openFarmRecordDrawer = () => {
  farmRecordDrawerVisible.value = true;
  farmRecordPage.blockId = fieldInfo.value.id;
  farmRecordPage.currentPage = 1;
  getFarmRecordList();
};

// 关闭农事记录抽屉
const closeFarmRecordDrawer = () => {
  farmRecordDrawerVisible.value = false;
  farmRecordList.value = [];
  farmRecordTotal.value = 0;
};

// 获取农事记录列表
const getFarmRecordList = async () => {
  farmRecordLoading.value = true;
  try {
    const res = await getFarmRecord_API({
      currentPage: farmRecordPage.currentPage,
      pageSize: farmRecordPage.pageSize,
      blockId: farmRecordPage.blockId,
    });
    farmRecordList.value = res.data.records || [];
    farmRecordTotal.value = res.data.total || 0;
  } catch (error) {
    console.error('获取农事记录失败:', error);
  } finally {
    farmRecordLoading.value = false;
  }
};

// 分页大小改变
const handleFarmRecordSizeChange = (val: number) => {
  farmRecordPage.pageSize = val;
  farmRecordPage.currentPage = 1;
  getFarmRecordList();
};

// 页码改变
const handleFarmRecordCurrentChange = (val: number) => {
  farmRecordPage.currentPage = val;
  getFarmRecordList();
};

// 获取农事类型名称
const getFarmAffairType = (type: number) => {
  console.log(affairTypeOptions.value,type,'affairTypeOptions');
  const option = affairTypeOptions.value.find((item: any) => item.value == type);
  return option ? option.label : '未知';
};

// 打开新增农事记录弹窗
const openAddFarmRecordDialog = () => {
  addFarmRecordDialogVisible.value = true;
};

// 打开编辑农事记录弹窗
const editFarmRecord = (row: any) => {
  addFarmRecordDialogVisible.value = true;
  // 填充表单数据
  Object.assign(farmRecordForm, {
    id: row.id,
    affairType: row.affairType ? Number(row.affairType) : '',
    responsiblePerson: row.responsiblePerson || '',
    time: row.time || '',
    remark: '',
  });
};

// 关闭新增/编辑农事记录弹窗
const closeAddFarmRecordDialog = () => {
  addFarmRecordDialogVisible.value = false;
  farmRecordFormRef.value?.resetFields();
  Object.assign(farmRecordForm, {
    id: undefined,
    affairType: '',
    responsiblePerson: '',
    time: '',
    remark: '',
  });
};

// 提交农事记录表单
const submitFarmRecordForm = async () => {
  await farmRecordFormRef.value.validate();
  try {
    const params: any = {
      farmId: fieldInfo.value.farmId,
      blockId: fieldInfo.value.id,
      affairType: farmRecordForm.affairType,
      responsiblePerson: farmRecordForm.responsiblePerson,
      time: farmRecordForm.time,
      remark: farmRecordForm.remark,
    };
    
    // 如果有id，说明是编辑模式，使用编辑API
    if (farmRecordForm.id) {
      params.id = farmRecordForm.id;
      await editFarmRecord_API(params);
    } else {
      // 新增模式，使用新增API
      await addFarmRecord_API(params);
    }
    
    ElMessage.success(farmRecordForm.id ? t('work.editSuccess') : t('messages.addSuccess'));
    closeAddFarmRecordDialog();
    getFarmRecordList();
  } catch (error) {
    console.error(farmRecordForm.id ? '编辑农事记录失败' : '添加农事记录失败', error);
  }
};

// 格式化作物选项
const formatOptions = (rawData: any) => {
  return rawData.map((item: any) => ({
    value: Number(item.bizKey),
    label: item.bizValue,
    children: item.children && item.children.length > 0 
      ? formatOptions(item.children)
      : []
  }));
};

// 获取作物字典
const getCropArray = async () => {
  try {
    const { data } = await sysDict_API({ dicKey: 'crop_type' });
    cropOptions.value = formatOptions(data);
  } catch (error) {
    console.error('获取作物字典失败:', error);
  }
};
getCropArray();

// 获取农事类型字典
const getAffairTypeArray = async () => {
  try {
    const { data } = await sysDict_API({ dicKey: 'affair_type'});
    affairTypeOptions.value = data.map((item: any) => ({
      value: Number(item.bizKey),
      label: item.bizValue,
    }));
  } catch (error) {
    console.error('获取农事类型字典失败:', error);
  }
};
getAffairTypeArray();

// 打开种养品种抽屉
const openCropDrawer = () => {
  cropDrawerVisible.value = true;
  cropPage.blockId = fieldInfo.value.id;
  cropPage.currentPage = 1;
  getCropList();
};

// 关闭种养品种抽屉
const closeCropDrawer = () => {
  cropDrawerVisible.value = false;
  cropList.value = [];
  cropTotal.value = 0;
};

// 获取种养品种列表
const getCropList = async () => {
  cropLoading.value = true;
  try {
    const res = await getFarmAffair_API({
      currentPage: cropPage.currentPage,
      pageSize: cropPage.pageSize,
      blockId: cropPage.blockId,
    });
    cropList.value = res.data.records || [];
    cropTotal.value = res.data.total || 0;
  } catch (error) {
    console.error('获取种养品种失败:', error);
  } finally {
    cropLoading.value = false;
  }
};

// 分页大小改变
const handleCropSizeChange = (val: number) => {
  cropPage.pageSize = val;
  cropPage.currentPage = 1;
  getCropList();
};

// 页码改变
const handleCropCurrentChange = (val: number) => {
  cropPage.currentPage = val;
  getCropList();
};

// 打开新增作物弹窗
const openAddCropDialog = () => {
  addCropDialogVisible.value = true;
};

// 打开编辑作物弹窗
const editCrop = (row: any) => {
  addCropDialogVisible.value = true;
  // 填充表单数据
  Object.assign(cropForm, {
    id: row.id,
    timeRange: [row.plantingStartTime, row.plantingEndTime],
    cropDictId: row.cropDictId,
    plantingArea: row.plantingArea || '',
  });
};

// 关闭新增/编辑作物弹窗
const closeAddCropDialog = () => {
  addCropDialogVisible.value = false;
  cropFormRef.value?.resetFields();
  Object.assign(cropForm, {
    id: undefined,
    timeRange: [],
    cropDictId: '',
    plantingArea: '',
  });
};

// 提交作物表单
const submitCropForm = async () => {
  await cropFormRef.value.validate();
  try {
    const params: any = {
      farmId: fieldInfo.value.farmId,
      blockId: fieldInfo.value.id,
      plantingStartTime: cropForm.timeRange[0],
      plantingEndTime: cropForm.timeRange[1],
      cropDictId: Array.isArray(cropForm.cropDictId)
        ? cropForm.cropDictId[cropForm.cropDictId.length - 1]
        : cropForm.cropDictId,
      plantingArea: cropForm.plantingArea,
    };
    
    // 如果有id，说明是编辑模式，使用编辑API
    if (cropForm.id) {
      params.id = cropForm.id;
      await editFarmAffair_API(params);
    } else {
      // 新增模式，使用新增API
      await addFarmAffair_API(params);
    }
    
    ElMessage.success(cropForm.id ? t('work.editSuccess') : t('messages.addSuccess'));
    closeAddCropDialog();
    getCropList();
    // 刷新地块信息以更新主页面显示的最新种养品种
    const res = await block_API({ id: fieldInfo.value.id });
    fieldInfo.value = res.data;
  } catch (error) {
    console.error(cropForm.id ? '编辑作物失败' : '添加作物失败', error);
  }
};
</script>

<style lang="scss" scoped>
.map_container {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;

  .select_area {
    position: absolute;
    left: 374px;
    top: 24px;
    z-index: 99999;
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
  .select_inner {
    height: 55px;
    margin-left: 2%;
    width: 96%;
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
}
.info_box {
  position: absolute;
  top: 72px;
  left: 374px;
  width: 264px;
  padding: 4px 8px;
  background-color: rgba(16, 34, 15, 0.68);
  color: #fff;
  background-size: 130% 130%;
  z-index: 999;
  .top_line {
    display: flex;
    padding: 0;
    justify-content: space-between;
  }
  .info_line {
    font-size: 13px;
    .el-row {
      margin: 4px 0;
    }
  }
}

.crop-info{
  display: flex;
  gap:10px
  // justify-content: space-between;
}
.infinite-list_out {
  position: absolute;
  top: 10px;
  left: 10px;
  height: 95%;
  width: 354px;
  padding: 4px;
  background-color: rgba(16, 34, 15, 0.68);
  color: #fff;
  background-size: 130% 130%;
  z-index: 999;
  .search_area {
    width: 96%;
    margin-bottom: 20px;
    margin-top: 10px;
    margin-left: 2%;
    --el-text-color-placeholder: #fff;
    display: flex;
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

    .left {
      width: 85%;
    }
    .right {
      width: 15%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.infinite-list {
  height: 90%;
  width: 100%;
  margin: 0;
}
.infinite-list .infinite-list-item {
  padding: 0 2% 0 1%;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  border-bottom: 2px solid;
  border-image: linear-gradient(
      to right,
      rgba(145, 145, 145, 0),
      rgba(247, 247, 247, 0.53),
      rgba(145, 145, 145, 0)
    )
    1;
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

.list_line {
  display: flex;
  img {
    width: 22px;

    height: 22px;
    margin-right: 4px;
  }
  .left {
    margin-left: 3px;
    width: 100%;
    position: relative;
    .arrow_area {
      width: 30px;
      cursor: pointer;
      position: absolute;
      top: calc(50% - 11px);
      right: 0px;
      z-index: 999999;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .unshared_area {
      padding: 0 3px;
      font-size: 14px;
      // border: 1px solid rgba(160, 176, 172, 1);

      border-radius: 10px;

      top: calc(50% - 11px);
      display: flex;
      height: 22px;
      align-items: center;
    }
    .unRef_area {
      padding: 0 3px;
      font-size: 14px;
      // border: 1px solid rgba(54, 177, 110, 1);

      border-radius: 10px;
      position: absolute;
      right: 40px;
      top: calc(50% - 11px);
      display: flex;
      height: 22px;
      align-items: center;
    }
    .shared_area {
      padding: 0 3px;
      font-size: 14px;
      // border: 1px solid rgba(54, 177, 110, 1);
      color: rgba(54, 177, 110, 1);
      border-radius: 10px;
      position: absolute;
      right: 40px;
      top: calc(50% - 11px);
      display: flex;
      height: 22px;
      align-items: center;
    }
    .top {
      height: 50%;
      width: 85%;
      align-items: center;
    }
    .bottom {
      height: 50%;
      width: 85%;
      font-size: 12px;
      color: rgba(129, 178, 167, 1);
      display: flex;
      align-items: center;
    }
  }
}
.chooseLi {
  background: linear-gradient(
    90deg,
    rgba(76, 176, 79, 0) 0%,
    var(--el-color-primary) 100%
  );
}
.new_img {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  cursor: pointer;
  img {
    margin-right: 5px;
    width: 20px;
    height: 20px;
  }
}
.dia_select {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dia_select1 {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}
.top_att {
  color: red;
  padding: 10px 50px;
}
.trun_area {
  display: flex;
  align-items: center;
  width: 60px;
}
.map_left {
  width: 180px;
  height: 80px;
}

// db

/* 核心样式：完全重置按钮样式 */
.plus-button {
  /* 重置所有基础样式 */
  background-color: transparent !important;
  color: #333 !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;

  /* 移除Element Plus的内置过渡效果 */
  transition: none !important;
}

/* 关键：覆盖所有状态下的样式 */
.plus-button:hover,
.plus-button:focus,
.plus-button:active,
.plus-button:focus-visible {
  background-color: transparent !important;
  color: #333 !important;
  border-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  transform: none !important;
}

/* 确保图标显示正常 */
.plus-button .el-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 下拉菜单样式保持不变 */
.custom-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 4px 0;
  min-width: 160px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.item-icon {
  margin-right: 8px;
  font-size: 16px;
}
.wrap-col {
  /* 确保容器有明确宽度（el-col 通常由 span 控制，可省略） */
  width: 100%;
  /* 强制文本换行（默认 normal 即可，但如果被覆盖需显式设置） */
  white-space: normal;
  /* 可选：当单词过长时强制拆分换行（针对英文/数字） */
  word-break: break-all; /* 或 break-word */
  /* 可选：添加边框便于观察 */
}
.line-type-color-container {
.title_line {
  font-size: 15px;
  color: #fff;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}
  background-color: rgba(16, 34, 15, 0.68);


  padding: 6px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* 轻微阴影增强层次感 */
  border: 1px solid #fff;
  border-radius: 6px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999;
}

/* 单个条目样式：横向排列、对齐 */
.line-type-item {
  display: flex; /* 横向布局 */
  align-items: center; /* 垂直居中 */
  padding: 4px 8px;
}

/* 颜色块样式：固定大小、圆形 */
.color-block {
  width: 16px;
  height: 16px;
  border-radius: 4px; /* 圆形色块 */
  margin-right: 12px; /* 与文字间距 */
}

/* 作业线类型文字样式：统一字体、颜色 */
.line-type-name {
  font-size: 14px;
  color: #fff; /* 深灰色文字，提升可读性 */
  font-family: "Microsoft YaHei", sans-serif; /* 适配中文字体 */
}
</style>
