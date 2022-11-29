<template>
  <!-- 参数管理 -->
  <el-dialog
    :visible.sync="dialogshow"
    title="远程管理"
    width="50%"
    @close="clearAllState"
  >
    <div slot="title">
      <span>远程管理</span>
      <div
        style="
          font-size: 14px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        "
      >
        <div>
          <span style="padding-right: 10px">车辆名称:</span>
          <span style="padding-right: 20px">{{ markerData.carName }}</span>
          <span style="padding-right: 10px">SN: </span>
          <span style="padding-right: 10px">{{ markerData.sn }}</span>
          <span style="padding-right: 10px">车辆类型:</span>
          <span style="padding-right: 10px">{{
            markerData.terminalType || "/"
          }}</span>
        </div>
      </div>
    </div>
    <div class="param_container">
      <div class="param_title">
        <!-- 车辆参数 -->
        <div
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'carParam',
          }"
          @click="setCurrentIndex('carParam')"
        >
          车辆参数
        </div>
        <!-- 校准参数 -->
        <div
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'calibParam',
          }"
          @click="setCurrentIndex('calibParam')"
        >
          校准参数
        </div>
        <!-- 基本参数 -->
        <div
          v-if="markerData.terminalType === 'AG302Android'||markerData.terminalType === 'AG502' ||(markerData.terminalType.indexOf('AG360')!=-1 &&markerData.version>=100)"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'basicParam',
          }"
          @click="setCurrentIndex('basicParam')"
        >
          基本参数
        </div>
        <!-- advanced1参数 -->
        <div
          v-if="markerData.terminalType === 'AG302Android'||markerData.terminalType === 'AG502'||(markerData.terminalType.indexOf('AG360')!=-1 &&markerData.version>=100)"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'advanced1Param',
          }"
          @click="setCurrentIndex('advanced1Param')"
        >
          高级参数1
        </div>
        <!-- advanced2参数 -->
        <div
          v-if="markerData.terminalType === 'AG302Android'"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'advanced2Param',
          }"
          @click="setCurrentIndex('advanced2Param')"
        >
          高级参数2
        </div>
        <!-- <div
          v-if="markerData.terminalType === 'AG302Android'"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'toolParam',
          }"
          @click="setCurrentIndex('toolParam')"
        >
          农具参数
        </div> -->
        <!-- pid参数 -->
        <div
          v-if="markerData.terminalType === 'AG302'||(markerData.terminalType.indexOf('AG360')!=-1 &&markerData.version<100)"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'pidParam',
          }"
          @click="setCurrentIndex('pidParam')"
        >
          PID参数
        </div>
        <!-- pid曲线参数 -->
        <div
          v-if="markerData.terminalType === 'AG302'"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'pidCurveParam',
          }"
          @click="setCurrentIndex('pidCurveParam')"
        >
          PID曲线参数
        </div>
        <!-- pid超低速参数 -->
        <div
          v-if="markerData.terminalType === 'AG302'"
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'pidLowSpeedParam',
          }"
          @click="setCurrentIndex('pidLowSpeedParam')"
        >
          PID超低速参数
        </div>
        <div
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'radioParam',
          }"
          @click="setCurrentIndex('radioParam')"
        >
          差分设置
        </div>
        <div
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'updateParam',
          }"
          @click="setCurrentIndex('updateParam')"
        >
          在线升级
        </div>
        <div
          class="param_title_item"
          :class="{
            param_title_item_active: currentCarouselName === 'logParam',
          }"
          @click="setCurrentIndex('logParam')"
        >
          日志回传
        </div>
      </div>
      <el-carousel
        ref="swipper"
        arrow="never"
        indicator-position="none"
        height=""
        :autoplay="false"
        @change="hangdleSlideChange"
      >
        <!-- 车辆参数 -->
        <el-carousel-item name="carParam">
          <el-form
            ref="carParam"
            :model="carParamModel"
            label-width="150px"
            :rules="carParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in carParamModel"
                :key="index"
                :span="12"
              >
                <el-form-item
                  v-if="
                    markerData.terminalType === 'AG302' &&
                    (key === 'Vehicle11' ||
                      key === 'Vehicle10' ||
                      key === 'Vehicle9')
                  "
                  :label="
                    carParamDes[key]
                      ? carParamDes[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-select v-model="carParamModel[key]">
                    <el-option
                      v-for="(item, idx) in carParamDes[key]['range']"
                      :key="idx"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  v-else
                  :label="
                    carParamDes[key]
                      ? carParamDes[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-input
                    v-model="carParamModel[key]"
                    :disabled="
                      key === 'Vehicle14' && markerData.terminalType === 'AG302'
                    "
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="carParamUpateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handleCarParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 校准参数 -->
        <el-carousel-item name="calibParam">
          <el-form
            ref="calibParam"
            :model="calibParamModel"
            label-width="200px"
            :rules="calibParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in calibParamModel"
                :key="index"
                :span="12"
              >
                <el-form-item
                  :label="
                    calibParamDes[key]
                      ? calibParamDes[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-input v-model="calibParamModel[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="calibParamUpdateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handleCalibParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 基本参数 -->
        <el-carousel-item 
          v-if="markerData.terminalType === 'AG302Android'||markerData.terminalType === 'AG502' ||(markerData.terminalType.indexOf('AG360')!=-1 &&markerData.version>=100)"
          name='basicParam' 
        >
          <el-form
          
            ref="basicParam"
            :model="basic.model"
            label-width="200px"
            :rules="basicParamRules"
            :disabled="disableConfig"
            
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in basic.model"
                :key="index"
                :span="12"
              >
                <el-form-item
                  :label="
                    basic.des[key]
                      ? basic.des[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-input v-model="basic.model[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="calibParamUpdateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handleBasicParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 高级参数1 -->
        <el-carousel-item 
          v-if="markerData.terminalType === 'AG302Android'||markerData.terminalType === 'AG502' ||(markerData.terminalType.indexOf('AG360')!=-1 &&markerData.version>=100)"
          name='advanced1Param' 
        >
          <el-form
            ref="advanced1Param"
            :model="advanced1.model"
            label-width="200px"
            :rules="advanced1ParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in advanced1.model"
                :key="index"
                :span="12"
              >
                <el-form-item
                  :label="
                    advanced1.des[key]
                      ? advanced1.des[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-input v-model="advanced1.model[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="calibParamUpdateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handleAdvanced1ParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 高级参数2 -->
        <el-carousel-item 
          v-if="markerData.terminalType === 'AG302Android'"
          name='advanced2Param' 
        >
          <el-form
            ref="advanced2Param"
            :model="advanced2.model"
            label-width="200px"
            :rules="advanced2ParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in advanced2.model"
                :key="index"
                :span="12"
              >
                <el-form-item
                  :label="
                    advanced2.des[key]
                      ? advanced2.des[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-input v-model="advanced2.model[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="calibParamUpdateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handleAdvanced2ParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 农具参数 -->
        <el-carousel-item name='toolParam' >
          <el-form
            ref="toolParam"
            :model="tool.model"
            label-width="200px"
            :rules="toolParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in tool.model"
                :key="index"
                :span="12"
              >
                <el-form-item
                  :label="
                    tool.des[key]
                      ? tool.des[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <el-input v-model="tool.model[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="calibParamUpdateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handleCalibParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- PID参数 -->
        <el-carousel-item 
          name="pidParam"
          v-if="markerData.terminalType === 'AG302'||(markerData.terminalType.indexOf('AG360')!=-1 &&markerData.version<100)"
          
        >
          <el-form
            ref="pidParam"
            :model="pidParamModel"
            label-width="150px"
            :rules="pidParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in pidParamModel"
                :key="index"
                :span="8"
              >
                <el-form-item
                  :label="
                    pidParamDes[key]
                      ? pidParamDes[key]['name'] + ':'
                      : '未命名参数:'
                  "
                  :prop="key"
                >
                  <!-- <el-input v-model.number="pidParamModel[key]" type="number" ></el-input> -->
                  <el-input v-model="pidParamModel[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="pidParamUpateButtonShow"
            type="primary"
            :disabled="disableConfig"
            @click="handlePidParamUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- PID曲线参数 -->
        <el-carousel-item
          v-if="markerData.terminalType === 'AG302'"
          name="pidCurveParam"
        >
          <el-form
            ref="pidCurveParam"
            :model="pidCurve.model"
            label-width="150px"
            :rules="pidCurveParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in pidCurve.model"
                :key="index"
                :span="8"
              >
                <el-form-item
                  :label="
                    pidCurve.des[key] ? pidCurve.des[key]['name'] : '未命名参数'
                  "
                  :prop="key"
                >
                  <el-input v-model="pidCurve.model[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            type="primary"
            :disabled="disableConfig"
            @click="handlePidCurveParamUpate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 超低速参数 -->
        <el-carousel-item
          v-if="markerData.terminalType === 'AG302'"
          name="pidLowSpeedParam"
        >
          <el-form
            ref="pidLowSpeedParam"
            :model="pidLowSpeed.model"
            label-width="150px"
            :rules="pidLowSpeedParamRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col
                v-for="(value, key, index) in pidLowSpeed.model"
                :key="index"
                :span="8"
              >
                <el-form-item
                  :label="
                    pidLowSpeed.des[key]
                      ? pidLowSpeed.des[key]['name']
                      : '未命名参数'
                  "
                  :prop="key"
                >
                  <el-input v-model="pidLowSpeed.model[key]" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            type="primary"
            :disabled="disableConfig"
            @click="handlePidLowSpeedParamUpate"
            >设置</el-button
          >
        </el-carousel-item>
        
        <!-- 内置电台 -->
        <el-carousel-item name="radioParam">
          <el-form :model="workPattern" label-width="100px">
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="工作模式">
                  <el-select v-model="workPattern.type">
                    <el-option
                      v-if="markerData.terminalType.indexOf('AG302')!=-1"
                      label="内置电台"
                      :value="0"
                    />
                    <el-option label="内置网络" :value="1" />
                    <!-- <el-option label="外置网络" :value="2"></el-option> -->
                    <el-option label="罗网" :value="3" disabled />
                    
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 内置电台表单 -->
          <el-form
            v-show="workPattern.type === 0"
            ref="radioParam"
            :model="radioParamModel"
            :rules="RadioParmaRules"
            label-width="100px"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="协议" prop="protocol">
                  <el-select
                    v-model="radioParamModel.protocol"
                    placeholder="请选择协议"
                  >
                    <el-option label="MAC" :value="0" />
                    <el-option label="South" :value="3" />
                    <el-option label="TT450S" :value="1" />
                    <el-option label="透明传输" :value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="信道" prop="radioChannel">
                  <el-select
                    v-model="radioParamModel.radioChannel"
                    placeholder="请选择协议"
                  >
                    <el-option
                      v-if="radioParamModel.protocol === 2"
                      label="自定义"
                      :value="0"
                    />
                    <!-- <el-option v-for="item in radioChannelOptions" :key="item" :label="item" :value="item"></el-option> -->
                    <el-option
                      v-for="(value, key) in radioChannelOptions"
                      :key="key"
                      :label="key"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                v-show="
                  radioParamModel.protocol === 2 &&
                  radioParamModel.radioChannel === 0
                "
                :span="7"
                :offset="1"
              >
                <el-input-number
                  v-model="custom"
                  clearable
                  size="small"
                  :min="410"
                  :max="470"
                  :step="0.0125"
                  :step-strictly="true"
                  :precision="4"
                  style="position: relative; top: 5px"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="模式" prop="radioStatus">
                  <el-select
                    v-model="radioParamModel.radioStatus"
                    placeholder="请选择模式"
                  >
                    <el-option label="TX_MODE" :value="0" />
                    <el-option label="RX_MODE" :value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="功率" prop="radioPower">
                  <el-select
                    v-model="radioParamModel.radioPower"
                    placeholder="请选择功率"
                  >
                    <el-option label="0.5W" :value="0.5" />
                    <el-option label="1W" :value="1" />
                    <el-option label="2W" :value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="workPattern.type === 0"
            type="primary"
            :disabled="disableConfig"
            @click="handleRadioParamUpdate"
            >设置</el-button
          >
          <!-- 内置网络表单 -->
          <el-form
            v-show="workPattern.type === 1"
            ref="netParam"
            validate-on-rule-change
            :model="netParamModel"
            label-width="100px"
            :rules="netParmaRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="服务器ip" prop="insideHost">
                  <el-input
                    v-model="netParamModel.insideHost"
                    size="small"
                    clearable
                    placeholder="请输入服务器ip"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="端口" prop="insidePort">
                  <el-input
                    v-model="netParamModel.insidePort"
                    size="small"
                    clearable
                    placeholder="请输入端口"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <div style="text-align:left;margin-left: 20.83%;padding: 0 0 10px 10px;color:#ccc;">内部网卡</div> -->
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="源节点" prop="insideSourceNode">
                  <el-select
                    v-model="netParamModel.insideSourceNode"
                    size="small"
                    placeholder="请选择源节点"
                  >
                    <el-option
                      v-for="(item, index) in sourceNode"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="用户名" prop="insideUsername">
                  <el-input
                    v-model="netParamModel.insideUsername"
                    size="small"
                    clearable
                    placeholder="请输入用户名"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="密码" prop="insidePassword">
                  <el-input
                    v-model="netParamModel.insidePassword"
                    size="small"
                    :show-password="true"
                    clearable
                    placeholder="请输入密码"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <div style="text-align:left;margin-left: 20.83%;padding: 0 0 10px 10px;color:#ccc;">扩展网卡</div> -->
          </el-form>
          <el-button
            v-show="workPattern.type === 1"
            type=""
            :disabled="disableConfig"
            @click="getSourceNode"
            >获取源节点</el-button
          >
          <el-button
            v-show="workPattern.type === 1"
            type="primary"
            :disabled="disableConfig"
            @click="handleNetParamUpate"
            >设置</el-button
          >
          <!-- -------------------------------------------------------------->
          <!-- 外置网络表单 -->
          <!-- <el-form
            v-show="workPattern.type === 2"
            ref="outNetParam"
            validate-on-rule-change
            :model="extendNetParamModel"
            label-width="100px"
            :rules="extendNetParmaRules"
            :disabled="disableConfig"
          >
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="服务器ip" prop="extendHost">
                  <el-input
                    v-model="extendNetParamModel.extendHost"
                    size="small"
                    clearable
                    placeholder="请输入服务器ip"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="端口" prop="extendPort">
                  <el-input
                    v-model="extendNetParamModel.extendPort"
                    size="small"
                    clearable
                    placeholder="请输入端口"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="源节点" prop="extendSourceNode">
                  <el-select
                    v-model="extendNetParamModel.extendSourceNode"
                    size="small"
                    placeholder="请选择源节点"
                  >
                    <el-option
                      v-for="(item, index) in extendSourceNode"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="用户名" prop="extendUsername">
                  <el-input
                    v-model="extendNetParamModel.extendUsername"
                    size="small"
                    clearable
                    placeholder="请输入用户名"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :offset="4">
                <el-form-item label="密码" prop="extendPassword">
                  <el-input
                    v-model="extendNetParamModel.extendPassword"
                    size="small"
                    :show-password="true"
                    clearable
                    placeholder="请输入密码"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button
            v-show="workPattern.type === 2"
            type=""
            :disabled="disableConfig"
            @click="getExtendSourceNode"
            >获取源节点</el-button
          >
          <el-button
            v-show="workPattern.type === 2"
            type="primary"
            :disabled="disableConfig"
            @click="handleextendNetParamUpate"
            >设置</el-button
          > -->
          <!-- -------------------------------------------------------------->
          <!-- 罗网 -->
          <el-button
            v-show="workPattern.type === 3"
            type="primary"
            :disabled="true"
            @click="handleNetUpdate"
            >设置</el-button
          >
        </el-carousel-item>
        <!-- 在线升级 -->
        <el-carousel-item name="updateParam">
          <!-- 神牛和AG302升级接口不同,这里要做区分 -->
          <!-- 神牛 -->
          <div
            
            v-if="markerData.terminalType.indexOf('AG360') !=-1"
            class="AG360_upgrade_container"
          > 
            <el-row><h3 style=" text-align:center;margin:0 10px">双天线一体机</h3></el-row>
            <el-row>
              <el-col
                :span="8"
                style="
                  text-align: right;
                  height: 32px;
                  line-height: 32px;
                  padding-right: 20px;
                "
                >模块选择:</el-col
              >
              <el-col :span="16" style="line-height:32px">
                <el-radio-group v-model="AG360UpdateModule" >
                  <el-radio label="11001">EC20</el-radio>
                  <el-radio label="11002">板卡</el-radio>
                </el-radio-group>
              </el-col>
              <!-- <el-col :span="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  :label="AG360UpdateModule"
                  border
                  size="small"
                  >双天线一体机</el-radio
                >
              </el-col> -->
              <!-- <el-col
                :span="8"
                style="position: absolute; right: 0; z-index: 999"
              >
                <el-row
                  v-if="['11000', '11001', '11002'].includes(AG360UpdateModule)"
                ><el-radio
                  v-model="AG360UpdateModule"
                  label="10"
                  size="small"
                >EC20配置文件</el-radio></el-row>
                <el-row v-if="['11000', '11001', '11002'].includes(AG360UpdateModule)"
                  ><el-radio v-model="AG360UpdateModule" label="11001" size="small" 
                    >EC20</el-radio
                  ></el-row
                >
                <el-row v-if="['11000', '11001', '11002'].includes(AG360UpdateModule)"
                  ><el-radio v-model="AG360UpdateModule" label="11002" size="small"
                    >板卡</el-radio
                  ></el-row
                >
              </el-col> -->
            </el-row>
            <el-row>
              <el-col 
                :span="8"
                style="
                  text-align: right;
                  height: 32px;
                  line-height: 32px;
                  padding-right: 20px;
                "
                >版本类型:</el-col
              >
              <el-col :span="16" style="line-height:32px">
                <el-radio-group v-model="AG360versionType">
                  <el-radio :label='1'>正式版</el-radio>
                  <el-radio :label='2'>测试版</el-radio>
                </el-radio-group>
                
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :offset="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  label="13"
                  border
                  size="small"
                >电台</el-radio>
              </el-col>
            </el-row> -->
            <!-- <el-row>
              <el-col :offset="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  label="15"
                  border
                  size="small"
                >车身IMU</el-radio>
              </el-col>
            </el-row> -->
            <!-- <el-row>
              <el-col :offset="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  label="16"
                  border
                  size="small"
                >车轮IMU</el-radio>
              </el-col>
            </el-row> -->
            <!-- <el-row>
              <el-col :offset="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  label="17"
                  border
                  size="small"
                >电机</el-radio>
              </el-col>
            </el-row> -->
            <!-- <el-row>
              <el-col :offset="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  label="18"
                  border
                  size="small"
                >多功能方向盘</el-radio>
              </el-col>
            </el-row> -->
            <!-- <el-row>
              <el-col :span="8" :offset="8">
                <el-radio
                  v-model="AG360UpdateModule"
                  label="20"
                  border
                  size="small"
                >Hub</el-radio>
              </el-col>
              <el-col :span="8" style="position:absolute;right:0;z-index:999;">
                <el-row v-if="['20', '21'].includes(AG360UpdateModule)">
                  <el-radio
                    v-model="AG360UpdateModule"
                    label="20"
                    size="small"
                  >Hub</el-radio>
                </el-row>
                <el-row v-if="['20', '21'].includes(AG360UpdateModule)">
                  <el-radio
                    v-model="AG360UpdateModule"
                    label="21"
                    size="small"
                  >Hub蓝牙</el-radio>
                </el-row>
              </el-col>
            </el-row> -->
            <el-row style="margin-top: 20px">
              <el-col
                :span="8"
                style="
                  text-align: right;
                  height: 32px;
                  line-height: 32px;
                  padding-right: 20px;
                "
                >版本选择:</el-col
              >
              <el-col :span="8">
                <el-select
                  class="el-select"
                  v-model="AG360UpdateVersion"
                  placeholder="请选择"
                  size="small"
                  @change="printPara"
                >
                  <el-option
                    style="z-index: 1"
                    v-for="(item,index) in AG360versionOptions"
                    :key="index"
                    :label="item.versionName"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row style="text-align: center; margin-top: 50px">
              <el-button type="danger" @click="handleAG360ForceUpgrade"
                >强制升级</el-button
              >
            </el-row>
          </div>
          <!-- 302 -->
          <el-row 
            v-else-if="markerData.terminalType ==='AG302'" 
            class="soft_update_container"
          >
            <el-row>
              <el-col 
                :span="8"
                style="
                  text-align: right;
                  height: 32px;
                  line-height: 32px;
                  padding-right: 20px;
                "
                >版本类型:</el-col
              >
              <el-col :span="16" style="line-height:32px">
                <el-radio-group v-model="AG302versionType" >
                  <el-radio  style="width:120px" :label='1'>正式版</el-radio>
                  <el-radio style="width:120px" :label='2'>测试版</el-radio>
                </el-radio-group>
                
              </el-col>
            </el-row>
            <el-row class="versionSelect">
              <el-col :span="8" style="
                  text-align: right;
                  height: 32px;
                  line-height: 32px;
                  padding-right: 20px;
                ">版本选择:</el-col
              >
              <el-col :span="16">
                <el-select class="versionOptions" v-model="AG302softVersion" placeholder="请选择升级版本" >
                  <el-option
                    v-for="(item,index) in AG302softOptions"
                    :key="index"
                    :label="item.versionName"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-row >
            <!-- <span>选择升级版本 </span>
            <el-select v-model="AG302softVersion" placeholder="请选择升级版本">
              <el-option
                v-for="(item,index) in AG302softOptions"
                :key="index"
                :label="item.versionName"
                :value="item.id"
              />
            </el-select> -->
            <el-col :span="24" style="margin-top: 150px;text-align:center">
              <el-button type="danger"  size="" @click="handleForceUpdate"
                >强制升级</el-button
              >
              <!-- <el-button type="primary" @click="handleUpdate">升级</el-button> -->
            </el-col>
          </el-row>
          <!-- 302Android -->
          <el-row
          v-else
          >AG502和AG302_Android的升级功能暂未开放</el-row>
        </el-carousel-item>
        <!-- 日志回传 -->
        <el-carousel-item name="logParam">
          <el-form
            v-if="markerData.terminalType.indexOf('AG360')!=-1"
            :model="fileForm"
            ref="fileForm"
            label-width="100px"
            class="fileForm"
            :rules="fileRules"
          >
            <el-form-item label="时间范围：" prop="functionDate">
              <el-date-picker
                type="daterange"
                v-model="fileForm.functionDate"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                popper-class="datePopper filePopper"
                :picker-options="pickerOptions"
                :clearable="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="fileTransfer"
                >回传</el-button
              >
            </el-form-item>
          </el-form>
          <div v-else>AG302以及AG302_Android的日志回传功能暂未开放</div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>
</template>
<script>
// import FileSaver from 'file-saver'
// var XLSX = require('xlsx')
import {
  paramDescribe_path,
  carList_path,
  carParamGet_path,
  calibParamGet_path,
  getSourceNode_path,
  getPidParam_path,
  getPidCurveParam_path,
  getPidSlsParam_path,
  getBasicParam_path,
  getAdvanced1Param_path,
  getAdvanced2Param_path,
  getTool_path,
  update_carParam_path,
  update_calibParam_path,
  updatePidParam_path,
  updatePidCurveParam_path,
  updatePidSlsParam_path,
  updateBasicParam_path,
  updateAdvanced1Param_path,
  updateAdvanced2Param_path,
  updateCar_path,
  getVersionPackage_path,
  onlineUpgrade_path,
  // modelVersion_path,
  setFileUpload,
} from "@/api/locationManage";
export default {
  props: {
    markerData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    let functionDateValidDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期时间"));
      } else if (!value[0] || !value[1]) {
        callback(new Error("请选择日期时间"));
      } else {
        callback();
      }
    };
    return {
      abc:[7,8,9,4],
      fileRules: {
        functionDate: [
          {
            type: "array",
            validator: functionDateValidDate,
            trigger: "change",
          },
        ],
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      buttonDis: true,
      version: "",
      options: [],
      radio: 1,
      radio1: "EC20",
      radio2: "steeringWheel",
      radio3: "hub",
      isGroup: false,
      isGroup1: false,
      isGroup2: false,
      dialogshow: true,
      currentSlideIndex: 0,
      carParamModel: {},
      carParamDes: {},
      calibParamModel: {},
      calibParamDes: {},
      pidParamModel: {},
      pidParamDes: {},
      basicParamModel:{},
      basicParamDes:{},
      advanced1ParamModel:{},
      advanced1ParamDes:{},
      advanced2ParamModel:{},
      advanced2ParamDes:{},
      toolParamModel:{},
      toolParamDes:{},   
      radioParamModel: {
        protocol: null,
        radioChannel: null,
        radioStatus: null,
        radioPower: null,
      },
      // pid 曲线参数
      pidCurve: {
        model: {},
        des: {},
      },
      // pid 超低速参数
      pidLowSpeed: {
        model: {},
        des: {},
      },
//--------------------------------------------------
      basic:{
        model:{},
        des:{}
      },
      advanced1:{
        model:{},
        des:{}
      },
      advanced2:{
        model:{},
        des:{}
      },
      tool:{
        model:{},
        des:{}
      },
//--------------------------------------------------
      radioChannelOptions: {
        1: 4550500,
        2: 4560500,
        3: 4570500,
        4: 4580500,
        5: 4590500,
        6: 4600500,
        7: 4610500,
        8: 4620500,
        9: 4630500,
      },
      RadioParmaRules: {
        protocol: [{ required: true, message: "请选择协议", trigger: "blur" }],
        radioChannel: [
          { required: true, message: "请选择信道", trigger: "blur" },
        ],
        radioStatus: [
          { required: true, message: "请选择模式", trigger: "blur" },
        ],
        radioPower: [
          { required: true, message: "请选择功率", trigger: "blur" },
        ],
      },
      custom: 0,
      netParamModel: {
        insideHost: "",
        insidePort: "",
        insideSourceNode: "",
        insideUsername: "",
        insidePassword: "",
      },
      extendNetParamModel: {
        extendHost: "",
        extendPort: "",
        extendSourceNode: "",
        extendUsername: "",
        extendPassword: "",
      },
      netParmaRules: {
        insideHost: [
          { required: true, message: "请输入服务器ip", trigger: "blur" },
        ],
        insidePort: [
          { required: true, message: "请输入端口", trigger: "blur" },
        ],
        insideSourceNode: [
          { required: true, message: "请选择源节点", trigger: "blur" },
        ],
        insideUsername: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        insidePassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
      extendNetParmaRules: {
        extendHost: [
          { required: true, message: "请输入服务器ip", trigger: "blur" },
        ],
        extendPort: [
          { required: true, message: "请输入端口", trigger: "blur" },
        ],
        extendSourceNode: [
          { required: true, message: "请选择源节点", trigger: "blur" },
        ],
        extendUsername: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        extendPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
      workPattern: {
        type: 0,
      },
      sourceNode: [],
      extendSourceNode: [],
      currentCarouselName: "carParam",
      AG302softVersion: "",
      AG302softOptions: [],
      AG360UpdateModule: "11001",
      AG360UpdateVersion: "",
      AG360versionType:1,
      AG302versionType:1,
      AG360versionOptions: [],
      fileForm: {
         functionDate: [new Date(), new Date()]
      },
    };
  },
  computed: {
    carParamRules() {
      let rules = {};
      for (let key in this.carParamDes) {
        let temRule = [];
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.carParamDes[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
      }
      return rules;
    },

    calibParamRules() {
      let rules = {};
      for (let key in this.calibParamDes) {
        let temRule = [];
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.calibParamDes[key]);
        console.log(rule2)
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
      }
      console.log(rules)
      return rules;
    },
    
    pidParamRules() {
      let rules = {};
      for (let key in this.pidParamDes) {
        let temRule = [];
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.pidParamDes[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
      }
      return rules;
    },

    pidCurveParamRules() {
      let rules = {};
      for (let key in this.pidCurve.des) {
        let temRule = [];
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.pidCurve.des[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
      }
      
      return rules;
    },

    pidLowSpeedParamRules() {
      let rules = {};
      for (let key in this.pidLowSpeed.des) {
        let temRule = [];
        let rule1 = { required: true, message: "请输入参数", trigger: "blur" };
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.pidLowSpeed.des[key]);
        temRule.push.apply(temRule, rule2);
        rules[key] = temRule;
      }
      return rules;
    },
    // ------------------------------------------------------------------------------
    basicParamRules(){
      let rules = {};
      for(let key in this.basic.des){
        let temRule = [];
        let rule1 ={required:true,message:'请输入参数',trigger:'blur'};
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.basic.des[key]);
        temRule.push.apply(temRule,rule2)
        rules[key]= temRule
      }
      console.log(rules)
      return rules
      
    },
    advanced1ParamRules(){
      let rules = {};
      for(let key in this.advanced1.des){
        let temRule = [];
        let rule1 ={required:true,message:'请输入参数',trigger:'blur'};
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.advanced1.des[key]);
        temRule.push.apply(temRule,rule2)
        rules[key]= temRule
      }
      return rules
    },
    advanced2ParamRules(){
      let rules = {};
      for(let key in this.advanced2.des){
        let temRule = [];
        let rule1 ={required:true,message:'请输入参数',trigger:'blur'};
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.advanced2.des[key]);
        temRule.push.apply(temRule,rule2)
        rules[key]= temRule
      }
      return rules
    },
    toolParamRules(){
      let rules = {};
      for(let key in this.tool.des){
        let temRule = [];
        let rule1 ={require:true,message:'请输入参数',trigger:'blur'};
        temRule.push(rule1);
        let rule2 = this.parseVerification(this.tool.des[key]);
        temRule.push.apply(temRule,rule2)
        rules[key]= temRule
      }
      return rules
    },

    // ------------------------------------------------------------------------------





    carParamUpateButtonShow() {
      return Object.keys(this.carParamModel).length !== 0;
    },

    calibParamUpdateButtonShow() {
      return Object.keys(this.calibParamModel).length !== 0;
    },

    pidParamUpateButtonShow() {
      return Object.keys(this.pidParamModel).length !== 0;
    },
    detailDisable() {
      // return true;
      return !this.$store.state.permission.includes(76);
    },
    registDisable() {
      return !this.$store.state.permission.includes(77);
    },
    userId() {
      return this.$store.state.userId;
    },

    disableConfig() {
      // return this.markerData.onlineTcp === '离线' || this.markerData.driveState !== 0;
      return this.markerData.driveState !== 0;
    },
  },

  watch: {
    radioParamModel: {
      deep: true,
      handler(newValue, old) {
        if (newValue.protocol === 3) {
          this.radioChannelOptions = {
            1: 4570500,
            2: 4580500,
            3: 4590500,
            4: 4600500,
            5: 4610500,
            6: 4620500,
            7: 4630500,
            8: 4640500,
          };
        } else {
          this.radioChannelOptions = {
            1: 4550500,
            2: 4560500,
            3: 4570500,
            4: 4580500,
            5: 4590500,
            6: 4600500,
            7: 4610500,
            8: 4620500,
            9: 4630500,
          };
        }
      },
      immediate: true,
    },

    AG360UpdateModule(newValue, old) {
      this.AG360UpdateVersion = "";
      // this.getAG360softVersion(newValue);
      
      //AG360UpdateModule和AG360versionType结合使用的，这里是为了当AG360versionType == 2时，AG360UpdateModule进行切换的时候只请求一次固件包
      this.AG360versionType == 1?this.get360VersionPackage({
        pid:newValue,
        versionType:this.AG360versionType
      }):this.AG360versionType = 1 
    },
    AG360versionType(newValue,old){
      this.AG360UpdateVersion = ''
      this.AG360versionOptions = []
      this.get360VersionPackage({
        pid:this.AG360UpdateModule,
        versionType:newValue
      })
    },
    AG302versionType(newValue,old){
      this.AG302softVersion = ''
      this.AG302softOptions = []
      this.get302VersionPackage({
        pid:9002,
        versionType:newValue
      })
    }
  },
  mounted() {
    let data = this.markerData;
    console.log(this.markerData)
    this.getAllParams(data);
    //不论是AG302还是AG302Android还是神牛，都要请求car、calib参数
    this.getCarParam();
    this.getCalibParam();
    //AG302需要请求曲线、超低速参数
    this.markerData.terminalType === "AG302" ? this.getPidCurveParam() : "";
    this.markerData.terminalType === "AG302" ? this.getPidLowSpeedParam() : "";
    //pid参数是AG302以及神牛参数版本100之前的版本需要请求
    this.markerData.terminalType ==="AG302"||((this.markerData.terminalType.indexOf('AG360') !=-1)&&this.markerData.version<100)?this.getPidParam():''
    // this.markerData.terminalType ==="AG302Android"?'':this.getPidParam();
    //basic参数和Advanced1参数是在AG302Android或者神牛的参数版本大于等于100时展示
    this.markerData.terminalType ==="AG302Android"||this.markerData.terminalType === 'AG502'||((this.markerData.terminalType.indexOf('AG360') !=-1)&&this.markerData.version >=100)?this.getBasicParam():"";
    this.markerData.terminalType ==="AG302Android"||this.markerData.terminalType === 'AG502'||((this.markerData.terminalType.indexOf('AG360') !=-1)&&this.markerData.version>=100)?this.getAdvanced1Param():"";
    //仅AG302Android类型设备有advanced2
    this.markerData.terminalType ==="AG302Android"?this.getAdvanced2Param():"";
    // this.markerData.terminalType ==="AG302Android"?this.getToolParam():"";

    
    // this.getAG302softVersion();
    // this.getAG360softVersion();
    this.get360VersionPackage({
      pid:11001,
      versionType:this.AG360versionType,
      // deviceId:18695
    })
    this.get302VersionPackage({
      pid:9002,
      versionType:this.AG302versionType,
      // deviceId:18695
    })
    // getVersionPackage_path({
    //   pid:9004,
    //   versionType:1,
    //   deviceId:18695
    // })
  },
  methods: {
   printPara(p){
      console.log(p)
   },
    // 日志回传
    fileTransfer() {
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          let params = {
            start: this.getDatePost(this.fileForm.functionDate[0]),
            end: this.getDatePost(this.fileForm.functionDate[1]),
            sn: this.markerData.sn,
          };
          console.log(params);
          setFileUpload(params).then((res) => {
            console.log(res, "---1191");
            if (res.data.code == 200) {
              this.$message({ message: res.data.message, type: "success" });
            } else {
              this.$message({ message: res.data.message, type: "error" });
            }
          });
        }
      });
    },
    getDatePost(date) {
      return (
        date.getFullYear() +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        date.getDate().toString().padStart(2, "0")
      );
    },
    // 参数描述获取
    async getParamDes(version = 0, type = 0, paramType) {
      // let contrast = {
      //   AG302: 1,
      //   AG600: 2,
      //   ECU200: 3
      // }
      let paramTypeTrans = {
        car: "车辆参数",
        calib: "校准参数",
        pid: "PID参数",
        pid_curve: "PID曲线参数",
        pid_superLowSpeed: "PID超低速参数",
      };
      let des = await paramDescribe_path({
        version: version,
        type: type,
        paramType: paramType,
      }).then((res) => {
        try {
          let paramDes =
            res.data.paramVersion && res.data.paramVersion.paramJson
              ? JSON.parse(res.data.paramVersion.paramJson)
              : 0; // 0表示获取参数描述失败
          paramDes === 0
            ? this.$message.warning(
                `${paramTypeTrans[paramType] || "参数"} 描述为空`
              )
            : "";
          return Promise.resolve(paramDes);
        } catch (err) {
          console.log(err);
          this.$message.warning("参数描述为空");
          return Promise.resolve(0);
        }
      })
      return des;
    },
    // 参数管理
    getAllParams(item) {
      carList_path({
        currentPage: 1,
        pageSize: 10,
        name: item.sn,
      }).then((res) => {
        try {
          if (!res.data.page.list.length) return;
          let carItem = res.data.page.list[0];
          carItem = { ...carItem, ...carItem.car };

          this.getRadioParam(carItem);
          this.getNetParam(carItem);
          this.workPattern.type = carItem.workPattern;
        } catch (error) {
          console.log(error);
        }
      });

      // this.getRadioParam(item);
      // this.getNetParam(item);
      // this.workPattern.type = item.workPattern;
    },

    hangdleSlideChange(index) {
      this.currentSlideIndex = index;
    },

    setCurrentIndex(name) {
      this.$refs["swipper"].setActiveItem(name);
      this.currentCarouselName = name;
    },

    // 获取车辆参数
    async getCarParam() {
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        "car"
      );
      console.log(tem)
      if (!tem) {
        return;
      }
      this.carParamDes = tem;
      carParamGet_path({
        carId: this.markerData.carId,
      }).then((res) => {
        try {
          if (res.data.data) {
            let paramJSON = res.data.data.paramJson;
            let paramData = JSON.parse(paramJSON);
            this.carParamModel = null;
            this.carParamModel = paramData;
          } else {
            this.$message.warning("车辆参数为空");
          }
        } catch (err) {
          console.log(err);
        }
      });
    },

    // 获取校准参数
    async getCalibParam() {
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        "calib"
      );
      if (!tem) {
        return;
      }
      this.calibParamDes = tem;
      calibParamGet_path({
        carId: this.markerData.carId,
        // type: this.markerData.type,
        // version: this.markerData.version
      }).then((res) => {
        try {
          if (res.data.data) {
            let paramJSON = res.data.data.paramJson;
            let paramData = JSON.parse(paramJSON);
            this.calibParamModel = null;
            this.calibParamModel = paramData;
          } else {
            this.$message.warning("校准参数为空");
          }
        } catch (err) {
          console.log(err);
        }
      });
    },
    // 获取电台
    getRadioParam(item) {
      try {
        for (let key in this.radioParamModel) {
          // this.radioParamModel[key] = item[key] ? item[key] : null;
          this.radioParamModel[key] = item[key];
        }
        this.custom = this.radioParamModel["radioChannel"] / 10000 || 0;
      } catch (err) {
        console.log(err);
      }
    },

    // 获取网络差分数据
    getNetParam(item) {
      try {
        // 内置网
        for (let key in this.netParamModel) {
          this.netParamModel[key] = item[key] ? item[key] : null;
        }
        // 外置网络
        for (let key in this.extendNetParamModel) {
          this.extendNetParamModel[key] = item[key] ? item[key] : null;
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取内置网络源节点
    getSourceNode() {
      getSourceNode_path({
        workPattern: this.workPattern.type,
        insideHost: this.netParamModel.insideHost,
        insidePort: this.netParamModel.insidePort,
      }).then((res) => {
        try {
          if (res.data.data.length >= 1) {
            this.sourceNode = res.data.data;
            this.$message.success("获取内置网络源节点成功！");
          } else {
            this.$message.warning("获取内置网络源节点失败，请检查ip、端口设置");
          }
        } catch (err) {
          this.$message.warning("获取内置网络源节点失败，请检查ip、端口设置");
        }
      });
    },
    // 获取外置网络源节点
    getExtendSourceNode() {
      getSourceNode_path({
        workPattern: this.workPattern.type,
        extendHost: this.extendNetParamModel.extendHost,
        extendPort: this.extendNetParamModel.extendPort,
      }).then((res) => {
        try {
          if (res.data.data.length >= 1) {
            this.extendSourceNode = res.data.data;
            this.$message.success("获取外置网络源节点成功！");
          } else {
            this.$message.warning("获取外置网络源节点失败，请检查ip、端口设置");
          }
        } catch (err) {
          this.$message.warning("获取外置网络源节点失败，请检查ip、端口设置");
        }
      });
    },

    // 获取PID参数
    async getPidParam() {
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        "pid"
      );
      if (!tem) {
        return;
      }
      this.pidParamDes = tem;
      getPidParam_path({
        carId: this.markerData.carId,
        // type: this.markerData.type,
        // version: this.markerData.version
      }).then((res) => {
        try {
          if (res.data.data) {
            let paramJSON = res.data.data.paramJson;
            let paramData = JSON.parse(paramJSON);
            this.pidParamModel = null;
            this.pidParamModel = paramData;
          } else {
            this.$message.warning("PID参数为空");
          }
        } catch (err) {
          console.log(err);
        }
      });
    },

    // 获取pid曲线参数
    async getPidCurveParam() {
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        "pid_curve"
      );
      if (!tem) return;
      this.pidCurve.des = tem;
      getPidCurveParam_path({
        carId: this.markerData.carId,
      }).then((res) => {
        try {
          if (!res.data.data) return;
          let paramJSON = res.data.data.paramJson;
          let paramData = JSON.parse(paramJSON);
          this.pidCurve.model = paramData;
        } catch (error) {
          console.log(error);
        }
      });
    },

    // 获取pid超低速参数
    async getPidLowSpeedParam() {
      
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        "pid_superLowSpeed"
      );
      if (!tem) return;
      this.pidLowSpeed.des = tem;
      getPidSlsParam_path({
        carId: this.markerData.carId,
      }).then((res) => {
        try {
          if (!res.data.data) return;
          let paramJSON = res.data.data.paramJson;
          let paramData = JSON.parse(paramJSON);
          this.pidLowSpeed.model = paramData;
        } catch (error) {
          console.log(error);
        }
      });
    },
// ---------------------------------------------------------------------------------------
    async getBasicParam(){
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        'basic'
      );
  
      if(!tem)return;
      this.basic.des = tem
      getBasicParam_path({
        carId:this.markerData.carId
      }).then((res)=>{
        try{
          if(!res.data.data){
            this.$message.warning('基本参数为空')
            return
          }
          let paramJSON = res.data.data.paramJson;
          let paramData = JSON.parse(paramJSON);
          this.basic.model = paramData
        }catch(error){
          console.log(error)
        }
      })
    },
    async getAdvanced1Param(){
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        'advanced1'
      );
      
      if(!tem)return;
      this.advanced1.des = tem
      getAdvanced1Param_path({
        carId:this.markerData.carId
      }).then((res)=>{
        try{
          if(!res.data.data){
            this.$message.warning('高级参数1为空')
            return
          }
          let paramJSON = res.data.data.paramJson;
          let paramData = JSON.parse(paramJSON);
          this.advanced1.model = paramData
        }catch(error){
          console.log(error)
        }
      })
    },
    async getAdvanced2Param(){
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        'advanced2'
      );
      if(!tem)return;
      this.advanced2.des = tem
      getAdvanced2Param_path({
        carId:this.markerData.carId
      }).then((res)=>{
        try{
          if(!res.data.data)return
          let paramJSON = res.data.data.paramJson;
          let paramData = JSON.parse(paramJSON);
          this.advanced2.model = paramData
        }catch(error){
          console.log(error)
        }
      })
    },
    async getToolParam(){
      let tem = await this.getParamDes(
        this.markerData.version,
        this.markerData.type,
        'tool'
      )
      if(!tem)return
      this.tool.des = tem
      getTool_path({
        carId:this.markerData.carId
      }).then((res)=>{
        try{
          if(!res.data.data)return
          let paramJSON = res.data.data.paramJson;
          let paramData = JSON.parse(paramJSON)
          this.tool.model = paramData
        }catch(error){
          console.log(error)
        }


      })
    },


//----------------------------------------------------------------------------------------
    // 车辆参数更新
    handleCarParamUpdate() {
      this.$refs["carParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              update_carParam_path({
                carId: this.markerData.carId,
                paramJson: JSON.stringify(this.carParamModel),
              }).then((res) => {
                if (res.data === 1) {
                  this.$message.success("更新车辆参数成功");

                  // 车辆参数下发
                  // this.$http.post('/farm/param/useParamToCar', {
                  //     paramType: 'car',
                  //     carId: this.currentCarId,
                  //     deviceId: this.currentDeviceId,
                  //     userId: this.userId,
                  //     carName: this.currentCarName
                  // }).then(res => {
                  //     if(res.data === 0) {
                  //         this.$message.success('车辆参数下发成功');
                  //         this.carParamModel = {};
                  //         // this.dialogVisibleManage = false;
                  //         this.closeMe();
                  //     }else{
                  //         this.$message.error('车辆参数下发失败');
                  //     }
                  // })
                }
                if (res.data === 0) {
                  this.$message.error("更新车辆参数失败");
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    // 校准参数更新
    handleCalibParamUpdate() {
      this.$refs["calibParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // 用于解决后端接受的值类型为字符串的问题。
              for (let key in this.calibParamModel) {
                this.calibParamModel[key] = parseFloat(
                  this.calibParamModel[key]
                );
              }
              update_calibParam_path({
                carId: this.markerData.carId,
                paramJson: JSON.stringify(this.calibParamModel),
              }).then((res) => {
                if (res.data === 1) {
                  this.$message.success("校准参数更新成功");
                  // 校准参数下发
                  // this.$http.post('/farm/param/useParamToCar', {
                  //     paramType: 'calib',
                  //     carId: this.currentCarId,
                  //     deviceId: this.currentDeviceId,
                  //     userId: this.userId,
                  //     carName: this.currentCarName
                  // }).then(res => {
                  //     if(res.data === 0) {
                  //         this.$message.success('校准参数下发成功');
                  //         this.calibParamModel = {};
                  //         // this.dialogVisibleManage = false;
                  //         this.closeMe();
                  //     }else{
                  //         this.$message.error('校准参数下发失败');
                  //     }
                  // })
                }
                if (res.data === 0) {
                  this.$message.error("校准参数更新失败");
                }
              });
            })
            .catch(() => {});
        }
      });
    },
   
    // PID 参数更新
    handlePidParamUpdate() {
      this.$refs["pidParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              updatePidParam_path({
                carId: this.markerData.carId,
                paramJson: JSON.stringify(this.pidParamModel),
              }).then((res) => {
                if (res.data === 1) {
                  this.$message.success("PID参数更新成功");
                  // pid参数下发
                  // this.$http.post('/farm/param/useParamToCar', {
                  //     paramType: 'pid',
                  //     carId: this.currentCarId,
                  //     deviceId: this.currentDeviceId,
                  //     userId: this.userId,
                  //     carName: this.currentCarName
                  // }).then(res => {
                  //     if(res.data === 0) {
                  //         this.$message.success('PID参数下发成功');
                  //         this.pidParamModel = {};
                  //         // this.dialogVisibleManage = false;
                  //         this.closeMe();
                  //     }else{
                  //         this.$message.error('PID参数下发失败');
                  //     }
                  // })
                }
                if (res.data === 0) {
                  this.$message.error("PID参数更新失败");
                }
              });
            })
            .catch(() => {});
        }
      });
    },

    // pid 曲线参数更新
    handlePidCurveParamUpate() {
      this.$refs["pidCurveParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updatePidCurveParam_path({
              carId: this.markerData.carId,
              paramJson: JSON.stringify(this.pidCurve.model),
            }).then((res) => {
              if (res.data === 1) {
                this.$message.success("PID曲线参数更新成功");
                // this.closeMe();
              } else {
                this.$message.error("PID曲线参数更新失败");
              }
            });
          }).catch(()=>{})
        }
      });
    },

    // pid超低速参数更新
    handlePidLowSpeedParamUpate() {
      console.log(this.pidLowSpeedParamRules)
      this.$refs["pidLowSpeedParam"].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updatePidSlsParam_path({
              carId: this.markerData.carId,
              paramJson: JSON.stringify(this.pidLowSpeed.model),
            }).then((res) => {
              if (res.data === 1) {
                this.$message.success("PID超低速参数更新成功");
                // this.closeMe();
              } else {
                this.$message.error("PID超低速参数更新失败");
              }
            });
          }).catch(()=>{})
        }
      });
    },
    // ----------------------------------------------
    //基本参数更新
    handleBasicParamUpdate(){
      this.$refs["basicParam"].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updateBasicParam_path({
              carId: this.markerData.carId,
              paramJson: JSON.stringify(this.basic.model),
            }).then((res) => {
              if (res.data === 1) {
                this.$message.success("基本参数更新成功");
                // this.closeMe();
              } else {
                this.$message.error("基本参数更新失败");
              }
            });
          }).catch(()=>{})
        }
      });

    },
    //advanced1参数更新
    handleAdvanced1ParamUpdate(){
      this.$refs["advanced1Param"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updateAdvanced1Param_path({
              carId: this.markerData.carId,
              paramJson: JSON.stringify(this.advanced1.model),
            }).then((res) => {
              if (res.data === 1) {
                this.$message.success("高级参数1更新成功");
                // this.closeMe();
              } else {
                this.$message.error("高级参数1更新失败");
              }
            });
          }).catch(()=>{})
        }
      });

    },
     //advanced2参数更新
    handleAdvanced2ParamUpdate(){
      this.$refs["advanced1Param"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updateAdvanced2Param_path({
              carId: this.markerData.carId,
              paramJson: JSON.stringify(this.advanced2.model),
            }).then((res) => {
              if (res.data === 1) {
                this.$message.success("高级参数2更新成功");
                // this.closeMe();
              } else {
                this.$message.error("高级参数2更新失败");
              }
            });
          }).catch(()=>{})
        }
      });

    },
    // ----------------------------------------------
    
    // 电台数据更新
    handleRadioParamUpdate() {
      this.$refs["radioParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            if (
              this.radioParamModel.protocol === 2 &&
              this.radioParamModel.radioChannel === 0
            ) {
              this.radioParamModel.radioChannel = this.custom * 10000;
            }
            // let a = JSON.stringify(this.radioParamModel)
            updateCar_path({
              id: this.markerData.carId,
              deviceId: this.markerData.deviceId,
              ...this.radioParamModel,
              workPattern: this.workPattern.type,
            }).then((res) => {
              if (res.status === 200) {
                this.$message.success("更新成功");
                // 电台参数下发
                // this.$http.post('/farm/param/useRadioConfigToCar',{
                //     carId: this.markerData.carId,
                //     deviceId: this.markerData.deviceId,
                //     userId: this.userId,
                //     // carName: this.currentCarName
                //     carName: this.markerData.carName
                // }).then(res => {
                //     if(res.data === 0) {
                //         this.$message.success('电台参数下发成功');
                //         // this.dialogVisibleManage = false;
                //         // this.closeMe();
                //     }else{
                //         this.$message.error('电台参数下发失败');
                //     }
                // })
              } else {
                this.$message.error("更新失败，请稍后重试");
              }
            });
          });
        }
      });
    },
    // 内置网络差分数据更新
    handleNetParamUpate() {
      this.$refs["netParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updateCar_path({
              id: this.markerData.carId,
              deviceId: this.markerData.deviceId,
              ...this.netParamModel,
              workPattern: this.workPattern.type,
            }).then((res) => {
              if (res.status === 200) {
                this.$message.success("更新成功");
                // 网络差分数据下发
                // this.$http.post('/farm/param/useNetWorkDiffToCar',{
                //     carId: this.markerData.carId,
                //     deviceId: this.markerData.deviceId,
                //     userId: this.userId,
                //     // carName: this.currentCarName
                //     carName: this.markerData.carName
                // }).then(res => {
                //     if(res.data === 0) {
                //         this.$message.success('内置网络差分参数下发成功');
                //         // this.dialogVisibleManage = false;
                //         // this.closeMe();
                //     }else{
                //         this.$message.error('内置网络差分参数下发失败');
                //     }
                // })
              } else {
                this.$message.error("更新失败，请稍后重试");
              }
            });
          });
        }
      });
    },

    // 外置网络差分数据更新
    handleextendNetParamUpate() {
      this.$refs["outNetParam"].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将覆盖当前车辆所有参数，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updateCar_path({
              id: this.markerData.carId,
              deviceId: this.markerData.deviceId,
              ...this.extendNetParamModel,
              workPattern: this.workPattern.type,
            }).then((res) => {
              if (res.status === 200) {
                this.$message.success("更新成功");
                // 网络差分数据下发
                // this.$http.post('/farm/param/useNetWorkDiffToCar',{
                //     carId: this.markerData.carId,
                //     deviceId: this.markerData.deviceId,
                //     userId: this.userId,
                //     // carName: this.currentCarName
                //     carName: this.markerData.carName
                // }).then(res => {
                //     if(res.data === 0) {
                //         this.$message.success('外置网络差分参数下发成功');
                //         // this.dialogVisibleManage = false;
                //         // this.closeMe();
                //     }else{
                //         this.$message.error('外置网络差分参数下发失败');
                //     }
                // })
              } else {
                this.$message.error("更新失败，请稍后重试");
              }
            });
          });
        }
      });
    },

    handleNetUpdate() {
      this.$confirm("确定设置为罗网？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        updateCar_path({
          id: this.markerData.carId,
          deviceId: this.markerData.deviceId,
          workPattern: this.workPattern.type,
        }).then((res) => {
          res.status === 200
            ? this.$message.success("更新成功")
            : this.$message.error("更新失败，请稍后重试");
        });
      });
    },

    

    // 获取AG302版本选择老方案
    // getAG302softVersion() {
    //   modelVersion_path({
    //     updateModel: "9",
    //   }).then((res) => {
    //     try {
    //       let tem = [];
    //       if (res.data && res.data.data) {
    //         for (let i in res.data.data) {
    //           let item = {
    //             label: res.data.data[i],
    //             value: i,
    //           };
    //           tem.push(item);
    //         }
    //       }
    //       this.AG302softOptions = tem;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   });
    // },
    //获取AG302版本选择新方案
    get302VersionPackage(para){
      getVersionPackage_path(para).then((res)=>{
          console.log(res.data.data)
          try{
            res?this.AG302softOptions = res.data.data.packgeList:''
            // console.log(this.AG302softOptions)
          }catch(error){
            console.log(error)
          }
      })

    },

    // AG302强制远程升级
    handleForceUpdate() {
      if (!this.AG302softVersion) {
        this.$message.warning("请选择升级版本");
        return;
      }
      this.$confirm("此操作将立即发送升级指令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.updateAG302(0);
      });
    },

    // AG302远程升级
    handleUpdate() {
      if (!this.AG302softVersion) {
        this.$message.warning("请选择升级版本");
        return;
      }
      this.$confirm(
        "此操作将立即发送升级指令，并由客户选择升级，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.updateAG302(1);
      });
    },

    // 0:强制升级 1：选择升级
    updateAG302(upgradeWay = 1) {
      onlineUpgrade_path({
        installPackageId: this.AG302softVersion,
        sn: this.markerData.sn,
        updateModel: "9",
        upgradeWay: upgradeWay,
      }).then((res) => {
        try {
          if (res.data && res.data.data === 1) {
            this.$message.success("升级指令下发成功,待终端重启生效");
          } else {
            this.$message.error("升级失败，请稍后重试");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("升级失败，请稍后重试");
        }
      });
    },

    // AG360升级接口：

    // 获取神牛模块版本老方案
    // getAG360softVersion(model = "11") {
    //   modelVersion_path({
    //     updateModel: model,
    //   }).then((res) => {
    //     try {
    //       if (res) {
    //         this.AG360versionOptions = res.data.data;
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   });
    // },
    //获取神牛版本新方案
    get360VersionPackage(para){
      console.log(para)
      getVersionPackage_path(para).then((res)=>{
          try{
            res?this.AG360versionOptions = res.data.data.packgeList:''
            // console.log(this.AG360versionOptions)
          }catch(error){
            console.log(error)
          }
      })

    },

    // 神牛强制升级
    handleAG360ForceUpgrade() {
      if (!this.AG360UpdateVersion) {
        this.$message.warning("请选择升级版本");
        return;
      }
      let text = "此操作将立即发送升级指令，是否继续?";
      text =
        this.AG360UpdateModule === "13" || this.AG360UpdateModule === "12"
          ? text + " 下发指令后，请5分钟后重启设备"
          : text;
      text =
        this.AG360UpdateModule === "11"
          ? text + " 下发指令后，请2分钟后重启设备"
          : text;
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.updateAG360(0);
      });
    },

    // 神牛升级
    updateAG360(upgradeWay = 0) {
      console.log({
        installPackageId: this.AG360UpdateVersion,
        sn: this.markerData.sn,
        updateModel: this.AG360UpdateModule,
        upgradeWay: upgradeWay,
      })
      onlineUpgrade_path({
        installPackageId: this.AG360UpdateVersion,
        sn: this.markerData.sn,
        updateModel: this.AG360UpdateModule,
        upgradeWay: upgradeWay,
      }).then((res) => {
        try {
          if (res.data && res.data.data === 1) {
            this.$message.success("升级指令下发成功,待终端重启生效");
          } else {
            this.$message.error("升级失败，请稍后重试");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("升级失败，请稍后重试");
        }
      });
    },

    clearAllState() {
      this.closeMe();
      this.carParamModel = {};
      this.carParamDes = {};
      this.calibParamModel = {};
      this.calibParamDes = {};
      this.pidParamModel = {};
      this.pidParamDes = {};
      this.currentSlideIndex = 0;
      this.$refs["swipper"].setActiveItem(0);
      for (let a in this.radioParamModel) {
        this.radioParamModel[a] = null;
      }
      for (let a in this.netParamModel) {
        this.netParamModel[a] = null;
      }
      for (let a in this.extendNetParamModel) {
        this.extendNetParamModel[a] = null;
      }
      this.$refs["radioParam"] ? this.$refs["radioParam"].clearValidate() : "";
      this.$refs["netParam"] ? this.$refs["netParam"].clearValidate() : "";
      this.$refs["outNetParam"]
        ? this.$refs["outNetParam"].clearValidate()
        : "";
    },

    closeMe() {
      this.$emit("closeMe");
    },

    // 动态解析表单效验规则
    parseVerification(objItem) {
      console.log(objItem)
      try {
        let temRule = [];
        if (objItem.type === "String") {
          let rule1 = {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          };
          temRule.push(rule1);
        }
        if (objItem.type === "int"|| objItem.type === "Int") {
          if (typeof objItem.range === "string") {
            let [min, max] = objItem.range.split(",").map((element) => {
              return Number(element);
            });
            // let rule2 = { min: min, max: max, message: `长度在 ${min} 到 ${max} 位`, trigger: 'blur' };
            let checkInt = (rule, value, callback) => {
              // 判断数字
              let checkNumber = (input) => {
                let testRe = /^[1-9]\d*|0$/;
                return testRe.test(input);
              };
              if (!value && value !== 0) {
                return callback(new Error("请输入参数"));
              }
              if (!checkNumber(value)) {
                return callback(new Error("值必须为整型"));
              }
              if (value < min || value > max) {
                return callback(new Error(`范围 ${min} 到 ${max} `));
              }
              callback();
            };
            let rule2 = { validator: checkInt, trigger: "blur" };
            temRule.push(rule2);
          }
          if (Array.isArray(objItem.range)) {
            //
          }
        }
        if (objItem.type === "double" || objItem.type === "Double") {
          if (objItem.range === "") {
            // let rule3 = { min: 1, max: 8, message: '长度在 1 到 8 位', trigger: 'blur' };
            // temRule.push(rule3);
            let checkDouble = (rule, value, callback) => {
              // 判断数字
              let checkNumber = (input) => {
                let testRe = /^[-]?[0-9]+.?[0-9]*/;
                return testRe.test(input);
              };
              if (!value && value !== 0) {
                return callback(new Error("请输入参数"));
              }
              if (!checkNumber(value)) {
                return callback(new Error("参数必须为数字"));
              }
              callback();
            };
            let rule3 = { validator: checkDouble, trigger: "blur" };
            temRule.push(rule3);
          }
          if (objItem.range !== "") {
            let checkDouble = (rule, value, callback) => {
              // 判断数字
              let checkNumber = (input) => {
                let testRe = /^[-]?[0-9]+.?[0-9]*/;
                return testRe.test(input);
              };
              let [min, max] = objItem.range.split(",").map((element) => {
                return Number(element);
              });
              if (!value && value !== 0) {
                return callback(new Error("请输入参数"));
              }
              if (!checkNumber(value)) {
                return callback(new Error("参数必须为数字"));
              }
              if (value < min || value > max) {
                return callback(new Error(`范围 ${min}到${max}`));
              }
              callback();
            };
            let rule4 = { validator: checkDouble, trigger: "blur" };
            temRule.push(rule4);
          }
        }
        console.log(temRule)
        return temRule;
      } catch (err) {
        console.log(err);
        console.warn(
          "解析参数描述失败，请检查是否更改了参数描述规则，和返回的字段是否正确！"
        );
      }
    },
    


  },
};
</script>
<style scoped lang="scss">
.param_container {
  text-align: center;
  .secondSelect {
    margin-left: -15px;
    margin-top: 20px;
    .selectVesion {
      width: 30%;
      display: inline-block;
    }
  }
  .upDataButton {
    margin-top: 30px;
  }
  .upData {
    .secondGroup {
      padding-left: 0;
      position: absolute;
      top: 15px;
      margin-left: 15px;
      .el-radio {
        width: 100px;
      }
    }
    .threeGroup {
      padding-left: 0;
      position: absolute;
      bottom: 165px;
      margin-left: 15px;
      .el-radio {
        width: 100px;
      }
    }
    .fourGroup {
      padding-left: 0;
      position: absolute;
      bottom: 120px;
      margin-left: 15px;
      .el-radio {
        width: 100px;
      }
    }
    .firstGroup {
      padding-left: 0;
      margin-left: -89px;
    }
    .el-radio {
      padding-top: 0;
      width: 140px;
      line-height: 30px;
      height: 30px;
    }
    .radioSelect {
      display: inline-block;
    }
    .text {
      font-size: 16px;
      vertical-align: top;
      margin-top: 22px;
      display: inline-block;
    }
    .radioMar {
      margin-top: 15px;
      text-align: left;
    }
  }
  .param_title {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid rgb(165, 165, 165);
    position: relative;
    bottom: 20px;
    .param_title_item {
      border-bottom: 1px solid rgb(165, 165, 165);
      padding-bottom: 8px;
      position: relative;
      top: 1px;
      cursor: pointer;
    }
    .param_title_item_active {
      border-bottom: 1px solid rgb(8, 123, 247);
      color: rgb(8, 123, 247);
    }
  }
  .el-carousel__item {
    height: auto;
  }
  .soft_update_container {
    text-align: left;
    margin-top: 20px;
    .versionSelect{
      //  color:pink;
       .el-col{
          &:nth-child(2){
            // color:yellow;
            
           .el-select {
              width: unset;
              & ::v-deep .el-input__inner{
                height: 32px;
                line-height: 32px;
              }
              & ::v-deep .el-input__suffix{
                height: 32px;
                line-height: 32px;
                .el-input__icon{
                  line-height: 32px;
                }
              }
              
            }   
          }   
       }
   
    }
  }
}
.el-form-item__label {
  text-align: left;
  padding-left: 10px;
}
.el-select {
  width: 100%;
}

.AG360_upgrade_container {
  text-align: left;
  .el-row {
    padding: 5px 0px;
  }
  .el-col {
    // white-space: nowrap;
  }
  .el-radio {
    width: 120px;
  }
}
.el-select ::v-deep .el-select-dropdown {
  position: absolute !important;
}
.fileForm {
  width:100%;
  display:flex;
  // justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
