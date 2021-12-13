<template>
  <div class="legend_container">
    <div
      class="legend_item"
      :class="{ active: activeIndex === 0 }"
      @click="changeActiveIndex(0)"
    >
      今日
    </div>
    <div
      class="legend_item"
      :class="{ active: activeIndex === 1 }"
      @click="changeActiveIndex(1)"
    >
      本月
    </div>
    <div
      class="legend_item"
      :class="{ active: activeIndex === 2 }"
      @click="changeActiveIndex(2)"
    >
      今年
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: 0
    }
  },
  methods: {
    changeActiveIndex(index = 0) {
      if (this.activeIndex === index) return
      this.activeIndex = index
      let st, et
      let date = new Date()
      let day = date.getDate() // 今天
      let month = date.getMonth() + 1 // 当月
      let year = date.getFullYear() // 年份
      switch (index) {
        case 0:
          st = `${year}-${month}-${day} 00:00:00`
          et = `${year}-${month}-${day} 23:59:59`
          break
        case 1:
          st = `${year}-${month}-01 00:00:00`
          et = `${year}-${month}-${day} 23:59:59`
          break
        case 2:
          st = `${year}-01-01 00:00:00`
          et = `${year}-${month}-${day} 23:59:59`
          break
      }
      this.$emit('params', {
        index: this.activeIndex,
        st: st,
        et: et
      })
    }
  }
}
</script>

<style scope>
.legend_container {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
}
.active {
  color: #0080ff;
}
</style>
