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
<script setup lang="ts">
import {ref,onMounted} from 'vue';
const emits=defineEmits(['timeSelect'])
let activeIndex=ref(1)
function changeActiveIndex(index = 0) {
  if (activeIndex.value === index) return
  activeIndex.value = index
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
  emits('timeSelect', {
    index:activeIndex,
    st: st,
    et: et
  })
}
onMounted(()=>{
})
</script>

<style scope>
.legend_container {
  width: 120px;
  position: absolute;
  top: 20px;
  z-index: 999;
  left: 200px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  .active {
  color: #0080ff;
}
}

</style>
