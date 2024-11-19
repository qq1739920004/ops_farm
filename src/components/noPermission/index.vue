<template>
  <div class="noPermission-container">
    <div class="content">
      <img src="./images/noPermission.png" alt="" />
      <div class="words">
        <p class="tip" v-if="!isShowAuthBtn">
          {{ $t("tip.noPermission") }}<span>
            {{ companyManagerTel }}</span
          >
        </p>
        <p class="tip" v-if="isShowAuthBtn">{{ $t("tip.noPermission") }}</p>
        <span v-if="isShowAuthBtn" style="color: #409eff;"  @click="dialogFormVisible = true"
          >{{ $t("permission.apply") }}</span
        >
      </div>
    </div>

    <!-- 申请权限dialog -->
    <el-dialog
    center
      width="30%"
      :title="$t('permission.apply')"
      v-model="dialogFormVisible"
      @open="applyFormOpen"
    >
      <el-form
        :model="applyForm"
        ref="applyForm"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <el-form-item :label="$t('permission.industry')" prop="industry">
          <el-input
            v-model="applyForm.industry"
            autocomplete="off"
            :placeholder="$t('permission.industryTip')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('permission.description')" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('permission.descriptionTip')"
            v-model="applyForm.description"
          >
          </el-input>
        </el-form-item>
       
        <div style="width:100%;display:flex;justify-content:center">
          <el-button type="primary" @click="sureApply('applyForm')">{{
            $t("message.submit")
          }}</el-button>
        </div>
   
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserCompanyManager_path,
  userAuthApply_path,
} from "@/api/permission";
export default {
  data() {
    return {
      appId: 1691041354632,
      dialogFormVisible: false,
      applyForm: { industry: "", description: "" },
      formLabelWidth: "100px",
      companyManagerTel: "",
      isShowAuthBtn: false,
      rules: {
        industry: [
          { required: true, message:  this.$t("tip.industry"), trigger: "change" },
        ],
        description: [
          { required: true, message: this.$t("tip.description"), trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getCompanyManager();
  },
  methods: {
    // 查询管理员信息
    getCompanyManager() {
      getUserCompanyManager_path().then((res) => {
        if (res.code == 200) {
          if (res.data) {
            res.data.isCurrentUser
              ? (this.isShowAuthBtn = true)
              : (this.isShowAuthBtn = false);
            this.companyManagerTel = res.data.tel;
          } else {
            this.isShowAuthBtn = true;
          }
        }
      });
    },
    // 申请权限
    sureApply(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (!valid) return;
        let { industry, description } = this.applyForm;
        let params = {
          appId: this.appId,
          industry,
          description,
        };

        userAuthApply_path(params).then((res) => {
          if (res.code == 200) {
            this.dialogFormVisible = false;
            this.$message({ type: "success", message: "请等待系统管理员分配权限" });
            dialogFormVisible.value = false
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.noPermission-container {
  height: calc(100% - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    text-align: center;
    .words {
      margin-top: -60px;
      font-size: 24px;
      p {
        margin-top: 0px;
        color: rgba(0, 0, 0, 1);
        span {
          color: #409eff;
        }
      }
    }
  }
}
</style>
