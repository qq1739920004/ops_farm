<template>
  <div class="noPermission-container">
    <div class="content">
      <img src="./images/noPermission.png" alt="" />
      <div class="words">
        <p class="tip" v-if="!isShowAuthBtn">
          暂无权限！请联系管理员获取~<span> {{ companyManagerTel }}</span>
        </p>
        <p class="tip" v-if="isShowAuthBtn">暂无权限！请立即申请权限～</p>
        <el-button type="primary" v-if="isShowAuthBtn" @click="dialogFormVisible = true"
          >申请权限</el-button
        >
      </div>
    </div>

    <!-- 申请权限dialog -->
    <el-dialog width="30%" title="申请权限" v-model="dialogFormVisible">
      <el-form
        :model="applyForm"
        ref="applyForm"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <el-form-item label="行业" prop="industry">
          <el-input
            v-model="applyForm.industry"
            autocomplete="off"
            placeholder="请输入您的行业"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请简单描述下您想申请的权限"
            v-model="applyForm.description"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureApply('applyForm')"
          >提 交</el-button
        >
      </div>
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
          { required: true, message: "行业不能为空", trigger: "change" },
        ],
        description: [
          { required: true, message: "描述不能为空", trigger: "change" },
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
            this.$message({ type: "success", message: "申请成功" });
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
