<template>
  <div class="month-range-picker">
    <el-date-picker
      v-model="dateValue"
      type="monthrange"
      range-separator="--"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
      value-format="YYYY-MM"
      :clearable="false"
      :disabled-date="pickerOptions.disabledDate"
      @change="handleDateChange"
      style="width: 320px;">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: "MonthRangePicker",
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          // 禁用当前月之后的日期
          const currentMonth = new Date();
          currentMonth.setDate(1); // 设置为当月1号
          return time.getTime() > currentMonth.getTime();
        }
      }
    };
  },
  computed: {
    dateValue: {
      get() {
        return this.modelValue || this.value;
      },
      set(val) {
        this.$emit('update:modelValue', val);
        this.$emit('input', val);
      }
    }
  },
  methods: {
    handleDateChange(val) {
      if (!val) return;
      this.$emit('change', val);
    }
  }
};
</script>

<style scoped lang="scss">
.month-range-picker .el-input__icon {
  color: #5ba4f7;
  font-size: 18px;
}

.month-range-picker .el-input__icon:hover {
  color: #4070e8;
}
</style> 