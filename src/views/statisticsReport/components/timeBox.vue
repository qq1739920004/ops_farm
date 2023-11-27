<template>
  <div class="legend_container">
    <div
      class="legend_item"
      :class="{ active: activeIndex === 0 }"
      @click="changeActiveIndex(0)"
    >
      {{$t("work.today")}}
    </div>
    <div
      class="legend_item"
      :class="{ active: activeIndex === 1 }"
      @click="changeActiveIndex(1)"
    >
      {{$t("work.thisMonth")}}
    </div>
    <div
      class="legend_item"
      :class="{ active: activeIndex === 2 }"
      @click="changeActiveIndex(2)"
    >
    {{$t("work.thisYear")}}
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
  min-width: 190px;
  position: absolute;
  top: 50px;
  z-index: 999;
  left: 180px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  .active {
  color: #0080ff;
}
.legend_item:hover {
  color: #0080ff;
}
}

</style>
